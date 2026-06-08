import asyncio
import sys
from os.path import dirname, abspath
sys.path.insert(0, dirname(dirname(abspath(__file__))))

import logging
from app.database import AsyncSessionLocal, engine
from app.models.brands import Brand
from app.models.clothing import ClothingCategory, SizeChart, SizeMeasurement, FitAdjustment, CategoryType, Region, FitStyle
from app.models.users import User
from app.models.measurements import UserMeasurement, FitPreference
from app.core import security
from sqlalchemy import select

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_data():
    async with AsyncSessionLocal() as session:
        logger.info("Starting database seed...")

        # 1. Create Brands
        brands_data = [
            "Nike", "Adidas", "H&M", "Zara", "Uniqlo", "Gap", "Levi's", "Tommy Hilfiger", "Ralph Lauren", "American Eagle",
            "Gucci", "Puma", "ASOS", "Calvin Klein", "Patagonia", "Under Armour", "Lululemon", "Vans", "Converse", "Champion",
            "Balenciaga", "Prada", "Versace", "Burberry", "Hugo Boss", "New Balance", "Reebok", "Supreme", "The North Face", "Columbia",
            "Fila", "Lacoste", "Guess", "Hollister", "Abercrombie & Fitch", "Mango", "Massimo Dutti", "Pull&Bear", "Bershka", "Stradivarius",
            "Armani", "Diesel", "G-Star RAW", "Superdry", "Timberland", "Carhartt", "Dickies", "Crocs", "Skechers"
        ]
        
        brands = {}
        for name in brands_data:
            result = await session.execute(select(Brand).where(Brand.name == name))
            brand = result.scalar_one_or_none()
            if not brand:
                brand = Brand(name=name, description=f"Global fashion brand {name}")
                session.add(brand)
                logger.info(f"Adding Brand: {name}")
            brands[name] = brand
        
        await session.flush()

        # 2. Create Categories
        categories_data = [
            ("T-Shirt", CategoryType.tops),
            ("Casual Shirt", CategoryType.tops),
            ("Formal Shirt", CategoryType.tops),
            ("Polo Shirt", CategoryType.tops),
            ("Sweatshirt", CategoryType.tops),
            ("Hoodie", CategoryType.tops),
            ("Jeans", CategoryType.bottoms),
            ("Chinos", CategoryType.bottoms),
            ("Shorts", CategoryType.bottoms),
        ]

        categories = {}
        for name, cat_type in categories_data:
            result = await session.execute(select(ClothingCategory).where(ClothingCategory.name == name))
            category = result.scalar_one_or_none()
            if not category:
                category = ClothingCategory(name=name, category_type=cat_type, description=f"Standard {name}")
                session.add(category)
                logger.info(f"Adding Category: {name}")
            categories[name] = category
            
        await session.flush()

        # 3. Create Users
        test_user_email = "test@example.com"
        result = await session.execute(select(User).where(User.email == test_user_email))
        user = result.scalar_one_or_none()
        
        if not user:
            user = User(
                email=test_user_email,
                hashed_password=security.get_password_hash("password123"),
                is_active=True
            )
            session.add(user)
            logger.info(f"Adding User: {test_user_email}")
            await session.flush() # Need ID for measurements
            
            # Add measurements
            m = UserMeasurement(
                user_id=user.id,
                chest_cm=100.0,
                waist_cm=85.0,
                hip_cm=98.0,
                shoulder_width_cm=45.0,
                height_cm=180.0,
                weight_kg=75.0,
                preferred_fit=FitPreference.regular,
                is_current=True
            )
            session.add(m)

        # 4. Create Fit Adjustments (Example for T-Shirt)
        t_shirt = categories.get("T-Shirt")
        if t_shirt:
            adjustments = [
                (FitStyle.slim, -2.0, -2.0),
                (FitStyle.regular, 0.0, 0.0),
                (FitStyle.relaxed, 3.0, 3.0),
                (FitStyle.oversized, 6.0, 4.0)
            ]
            for style, chest_adj, waist_adj in adjustments:
               result = await session.execute(select(FitAdjustment).where(
                   FitAdjustment.category_id == t_shirt.id,
                   FitAdjustment.fit_style == style
               ))
               if not result.scalar_one_or_none():
                   adj = FitAdjustment(
                       category_id=t_shirt.id,
                       fit_style=style,
                       chest_adjustment_cm=chest_adj,
                       waist_adjustment_cm=waist_adj,
                       description=f"{style.value} fit adjustment"
                   )
                   session.add(adj)

        # 5. Create Size Charts for multiple brands and categories
        top_brands = ["Nike", "Adidas", "H&M", "Zara", "Uniqlo"]
        
        # Mapping for sizes (approximate)
        # Tops: T-Shirt, Casual Shirt, Formal Shirt, etc.
        tops_sizes = [
            ("S", 88.0, 96.0),
            ("M", 96.0, 104.0),
            ("L", 104.0, 112.0),
            ("XL", 112.0, 124.0),
            ("XXL", 124.0, 136.0)
        ]
        
        # Bottoms: Jeans, Chinos, Shorts
        bottoms_sizes = [
            ("28", 71.0, 74.0),
            ("30", 76.0, 79.0),
            ("32", 81.0, 84.0),
            ("34", 86.0, 89.0),
            ("36", 91.0, 94.0),
            ("38", 96.0, 99.0)
        ]

        logger.info("Seeding size charts for top brands...")
        for brand_name in top_brands:
            brand = brands.get(brand_name)
            if not brand: continue
            
            for cat_name, category in categories.items():
                # Check if chart exists
                result = await session.execute(select(SizeChart).where(
                    SizeChart.brand_id == brand.id,
                    SizeChart.category_id == category.id
                ))
                if result.scalar_one_or_none(): continue
                
                chart = SizeChart(
                    brand_id=brand.id,
                    category_id=category.id,
                    region=Region.US,
                    fit_style=FitStyle.regular,
                    is_active=True
                )
                session.add(chart)
                await session.flush()
                
                size_data = tops_sizes if category.category_type == CategoryType.tops else bottoms_sizes
                
                for label, min_val, max_val in size_data:
                    sm = SizeMeasurement(
                        size_chart_id=chart.id,
                        size_label=label,
                        sort_order=int(min_val)
                    )
                    
                    if category.category_type == CategoryType.tops:
                        sm.chest_min_cm = min_val
                        sm.chest_max_cm = max_val
                        sm.waist_min_cm = min_val - 15
                        sm.waist_max_cm = max_val - 15
                    else:
                        sm.waist_min_cm = min_val
                        sm.waist_max_cm = max_val
                        sm.hip_min_cm = min_val + 20
                        sm.hip_max_cm = max_val + 20
                        
                    session.add(sm)
                
                logger.info(f"Added Size Chart: {brand_name} {cat_name}")

        await session.commit()
        logger.info("Seed completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
