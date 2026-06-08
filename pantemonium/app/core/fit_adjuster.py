from decimal import Decimal
from typing import Dict, Any

def apply_fit_adjustments(user_measurements: Dict[str, Decimal], adjustments: Dict[str, Decimal]) -> Dict[str, Decimal]:
    """
    Apply fit adjustments to user measurements.
    adjustments: dict with keys like 'chest_adjustment_cm', 'waist_adjustment_cm', etc.
    """
    adjusted = user_measurements.copy()
    
    # Map adjustment keys to measurement keys
    # specific logic based on naming conventions
    
    if 'chest_adjustment_cm' in adjustments:
        adjusted['chest_cm'] = adjusted.get('chest_cm', Decimal('0')) + adjustments['chest_adjustment_cm']
        
    if 'waist_adjustment_cm' in adjustments:
        adjusted['waist_cm'] = adjusted.get('waist_cm', Decimal('0')) + adjustments['waist_adjustment_cm']
        
    if 'hip_adjustment_cm' in adjustments:
        adjusted['hip_cm'] = adjusted.get('hip_cm', Decimal('0')) + adjustments['hip_adjustment_cm']
        
    return adjusted
