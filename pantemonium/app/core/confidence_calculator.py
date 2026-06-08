from decimal import Decimal
from typing import Dict, Optional, Tuple

def calculate_overlap_percentage(user_val: Decimal, size_min: Decimal, size_max: Decimal, tolerance: Decimal = Decimal('2.0')) -> Decimal:
    """
    Calculate overlap between user measurement (point) and size range.
    Treat user measurement as a range [val - tolerance/2, val + tolerance/2].
    """
    user_min = user_val - (tolerance / 2)
    user_max = user_val + (tolerance / 2)

    overlap = max(Decimal('0'), min(user_max, size_max) - max(user_min, size_min))
    size_range = size_max - size_min
    
    if size_range <= 0:
        # Handle single size point (rare but possible in some charts)
        if user_val == size_min:
            return Decimal('100.0')
        return Decimal('0.0')

    # If overlap is full user range, it's 100% match? 
    # Or is it relative to size range? The formula says (overlap / range) * 100. Not clarifying which range.
    # Usually relative to the size range means how much of the size range is covered by the user. If user is tiny range inside big size range, overlap is small percentage?
    # That doesn't make sense for fit. 
    # If user is 100, size is [90, 110], user is perfectly in middle. User fits 100%.
    # If overlap formula is used literally as (overlap / size_range), then a narrow user range inside a wide size range gives low score.
    # Logic might be: (overlap / user_range) * 100? ie. how much of the user's measurement falls within the size range?
    # Let's assume the latter makes more sense for "Fit Confidence".
    
    user_range_width = user_max - user_min
    if user_range_width == 0:
         return Decimal('0') if overlap == 0 else Decimal('100')
         
    percentage = (overlap / user_range_width) * 100
    
    # Cap at 100
    return min(percentage, Decimal('100.0'))


def calculate_confidence_score(overlap_score: Decimal, completeness_score: Decimal, historical_score: Decimal = Decimal('0')) -> Decimal:
    """
    Weighted confidence score calculation.
    """
    # Weights
    w_overlap = Decimal('0.6')
    w_completeness = Decimal('0.2') # e.g. if we have all needed measurements (chest, waist, etc) vs missing some
    w_historical = Decimal('0.2') # default 0 if no history
    
    # If no history, re-normalize weights? 
    # For MVP, let's keep it simple: if historical is 0 (no data), maybe distribute its weight or just cap?
    # Let's assume standard weights for now.
    
    score = (overlap_score * w_overlap) + (completeness_score * w_completeness) + (historical_score * w_historical)
    return score
