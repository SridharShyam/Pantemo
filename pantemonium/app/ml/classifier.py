import random
import logging

logger = logging.getLogger(__name__)

class ConfidenceClassifier:
    """
    Mock XGBoost / Random Forest Classifier.
    Instead of calculating a static percentage, maps to a logistic curve
    representing the probability (0.0 to 1.0) that a user will KEEP their item and not return it!
    """
    def __init__(self):
        logger.info("Initializing Confidence Classifier mapping...")
        
    def predict_keep_probability(self, 
                                 size_chart_overlap_percent: float, 
                                 nlp_penalty: float, 
                                 cf_agreement: bool) -> float:
        """
        Calculates the final ML-driven confidence score leveraging all models.
        """
        # Base probability is initially driven by physics and chart accuracy (0.85 = 85%)
        # Note the parameter comes in as e.g. 85.something so we divide by 100 
        base_prob = size_chart_overlap_percent / 100.0 if size_chart_overlap_percent > 1.0 else size_chart_overlap_percent
        
        # Penalize if NLP flagged the brand as notoriously inconsistent across forums
        base_prob -= nlp_penalty
        
        # Boost confidence severely if the Collaborative Filter (similar users) organically matches
        # this exact brand and shape prediction
        base_prob += 0.12 if cf_agreement else -0.05
            
        # Add slight randomness to simulate ML model node variance
        final_prob = base_prob + random.uniform(-0.02, 0.03)
        
        # Clamp between standard e-com probabilities (You rarely ensure 100% keeping chance)
        clamped_score = max(0.10, min(0.99, final_prob))
        
        logger.info(f"Classifier prediction processed: {clamped_score*100:.1f}% likelihood of retention")
        return clamped_score
