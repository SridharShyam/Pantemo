from decimal import Decimal
from typing import List, Dict, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.clothing import FitAdjustment, SizeChart, SizeMeasurement, ClothingCategory
from app.core.fit_adjuster import apply_fit_adjustments
from app.core.confidence_calculator import calculate_confidence_score, calculate_overlap_percentage
from app.models.brands import Brand
from app.ml import cf_recommender, nlp_miner, xgboost_classifier

class FitEngine:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_fit_adjustments(self, category_id: str, fit_style: str) -> Dict[str, Decimal]:
        # Query FitAdjustment table
        result = await self.db.execute(
            select(FitAdjustment).where(
                FitAdjustment.category_id == category_id,
                FitAdjustment.fit_style == fit_style
            )
        )
        adj = result.scalar_one_or_none()
        if not adj:
            return {}
            
        return {
            "chest_adjustment_cm": adj.chest_adjustment_cm,
            "waist_adjustment_cm": adj.waist_adjustment_cm,
            "hip_adjustment_cm": adj.hip_adjustment_cm,
        }

    async def calculate_recommendation(
        self, 
        user_measurements: Dict[str, Decimal], 
        brand_id: str, 
        category_id: str, 
        fit_preference: str, 
        region: str = "US"
    ) -> Dict[str, Any]:
        """
        Main entry point for fit calculation.
        """
        # Fetch Brand Name explicitly for ML NLP usage
        brand_result = await self.db.execute(select(Brand).where(Brand.id == brand_id))
        brand_record = brand_result.scalar_one_or_none()
        brand_name = brand_record.name if brand_record else "Unknown"

        cat_result = await self.db.execute(select(ClothingCategory).where(ClothingCategory.id == category_id))
        category_record = cat_result.scalar_one_or_none()
        category_name = category_record.name if category_record else "Clothing"
        
        # 0. RUN ML PIPELINES: Recommender & NLP Mining
        cf_prediction = cf_recommender.predict_size(adjusted_measurements, brand_name)
        nlp_review_results = nlp_miner.analyze_brand_fit(brand_name, category_name)
        
        nlp_modifier_cm = Decimal(str(nlp_review_results['chart_modifier_cm']))

        # 1. Measurement Adjustment
        adjustments = await self.get_fit_adjustments(category_id, fit_preference)
        adjusted_measurements = apply_fit_adjustments(user_measurements, adjustments)
        
        query = select(SizeChart).where(
            SizeChart.brand_id == brand_id,
            SizeChart.category_id == category_id,
            SizeChart.region == region
        )
        
        result = await self.db.execute(query.where(SizeChart.fit_style == fit_preference))
        size_charts = result.scalars().all()
        
        if not size_charts:
            result = await self.db.execute(query)
            size_charts = result.scalars().all()
            
        if not size_charts:
            return {"error": "No size chart found"}
            
        best_match = None
        highest_confidence = Decimal('-1')
        all_options = []

        # 3. Size Matching (With NLP Chart Shift injections)
        for chart in size_charts:
            ms_result = await self.db.execute(select(SizeMeasurement).where(SizeMeasurement.size_chart_id == chart.id))
            measurements_list = ms_result.scalars().all()
            
            for size_m in measurements_list:
                cat_result = await self.db.execute(select(ClothingCategory).where(ClothingCategory.id == category_id))
                category = cat_result.scalar_one()
                
                dims_checked = 0
                total_overlap = Decimal('0')
                
                # Chest + NLP Modifiers (If brand runs loose, the size chart bounds mentally shift logic upward)
                if size_m.chest_min_cm and 'chest_cm' in adjusted_measurements:
                    ov = calculate_overlap_percentage(
                        adjusted_measurements['chest_cm'], 
                        size_m.chest_min_cm + nlp_modifier_cm, 
                        size_m.chest_max_cm + nlp_modifier_cm
                    )
                    total_overlap += ov
                    dims_checked += 1
                    
                # Waist
                if size_m.waist_min_cm and 'waist_cm' in adjusted_measurements:
                    ov = calculate_overlap_percentage(
                        adjusted_measurements['waist_cm'], 
                        size_m.waist_min_cm + nlp_modifier_cm, 
                        size_m.waist_max_cm + nlp_modifier_cm
                    )
                    total_overlap += ov
                    dims_checked += 1
                
                # Hip
                if size_m.hip_min_cm and 'hip_cm' in adjusted_measurements:
                     ov = calculate_overlap_percentage(
                        adjusted_measurements['hip_cm'], 
                        size_m.hip_min_cm + nlp_modifier_cm, 
                        size_m.hip_max_cm + nlp_modifier_cm
                    )
                     total_overlap += ov
                     dims_checked += 1

                if dims_checked > 0:
                    avg_overlap = total_overlap / dims_checked
                    
                    # RUN ML CLASSIFIER INJECTION: Instead of just overlap, get true retention probability
                    cf_agrees = (size_m.size_label == cf_prediction)
                    
                    final_ml_probability = xgboost_classifier.predict_keep_probability(
                        size_chart_overlap_percent=float(avg_overlap.quantize(Decimal('1.000'))),
                        nlp_penalty=nlp_review_results['confidence_penalty'],
                        cf_agreement=cf_agrees
                    )
                    
                    confidence = Decimal(str(final_ml_probability))
                else:
                    confidence = Decimal('0')

                match_info = {
                    "size": size_m.size_label,
                    "confidence": float(confidence),
                    "chart_id": str(chart.id),
                    "fit_style": chart.fit_style
                }
                
                all_options.append(match_info)
                
                if confidence > highest_confidence:
                    highest_confidence = confidence
                    best_match = match_info
                    
        all_options.sort(key=lambda x: x['confidence'], reverse=True)
        alternatives = [x for x in all_options if x != best_match and x['confidence'] > 0.5]

        if not best_match:
             return {"error": "Could not determine size"}

        return {
            "recommended_size": best_match['size'],
            "confidence_score": best_match['confidence'],
            "alternatives": alternatives[:2],
            "fit_explanation": f"Sizing derived via {nlp_review_results['sentiment']} NLP metrics & similarity clustering.",
            "size_chart_reference": best_match['chart_id']
        }
