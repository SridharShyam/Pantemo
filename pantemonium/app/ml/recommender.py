import math
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class CollaborativeFilter:
    """
    Mock Neural Collaborative Filtering (NCF) Recommender.
    Instead of math comparisons, it finds groups of users with similar physiques
    and returns their most highly-rated kept size for the brand requested.
    """
    def __init__(self):
        # Mock database of user clusters and successful purchases
        self.user_clusters = [
            {"chest": 96.0, "waist": 82.0, "brand": "Nike", "best_size": "M"},
            {"chest": 105.0, "waist": 90.0, "brand": "Nike", "best_size": "L"},
            {"chest": 88.0, "waist": 70.0, "brand": "Nike", "best_size": "S"},
            {"chest": 92.0, "waist": 78.0, "brand": "Zara", "best_size": "L"}, # Zara runs small
            {"chest": 100.0, "waist": 85.0, "brand": "H&M", "best_size": "M"},
        ]
        
    def _euclidean_distance(self, u1: Dict[str, float], u2: Dict[str, float]) -> float:
        return math.sqrt(
            (u1.get('chest', 96.0) - u2.get('chest', 96.0))**2 + 
            (u1.get('waist', 80.0) - u2.get('waist', 80.0))**2
        )
        
    def predict_size(self, user_measurements: Dict[str, float], brand_name: str) -> Optional[str]:
        """Finds the nearest neighbor in the cluster to recommend a size."""
        # Simple KNN implementation
        nearest = None
        min_dist = float('inf')
        
        for cluster in self.user_clusters:
            if cluster['brand'].lower() == brand_name.lower():
                dist = self._euclidean_distance(user_measurements, cluster)
                if dist < min_dist and dist < 10.0: # Arbitrary threshold so it doesn't match wildly off shapes
                    min_dist = dist
                    nearest = cluster['best_size']
        
        if nearest:
            logger.info(f"Collaborative Filtering matched user to cluster size: {nearest} (dist={min_dist:.2f})")
        else:
            logger.warning(f"No CF match found for brand '{brand_name}' within tolerance threshold.")
        return nearest
