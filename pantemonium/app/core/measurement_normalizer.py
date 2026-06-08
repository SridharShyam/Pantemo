from decimal import Decimal
from typing import Dict, Union

def normalize_measurements(measurements: Dict[str, Union[float, Decimal]]) -> Dict[str, Decimal]:
    """
    Ensure all measurements are Decimals and standardized (e.g. cm).
    In a real app, might handle inches conversion. 
    Here just casting to Decimal.
    """
    normalized = {}
    for k, v in measurements.items():
        if v is None:
            continue
        try:
            normalized[k] = Decimal(str(v))
        except:
            # Handle invalid values gracefully or raise exception
            pass
            
    return normalized
