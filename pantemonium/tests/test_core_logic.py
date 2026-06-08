from decimal import Decimal
from app.core.fit_adjuster import apply_fit_adjustments
from app.core.measurement_normalizer import normalize_measurements
from app.core.confidence_calculator import calculate_overlap_percentage, calculate_confidence_score

def test_measurement_normalization():
    data = {
        "chest": 100,
        "waist": "85.0",
        "missing": None
    }
    normalized = normalize_measurements(data)
    assert isinstance(normalized["chest"], Decimal)
    assert normalized["chest"] == Decimal("100")
    assert normalized["waist"] == Decimal("85.0")
    assert "missing" not in normalized

def test_fit_adjuster():
    user = {"chest_cm": Decimal("100"), "waist_cm": Decimal("85")}
    adj = {"chest_adjustment_cm": Decimal("-2.0"), "waist_adjustment_cm": Decimal("0")}
    
    result = apply_fit_adjustments(user, adj)
    assert result["chest_cm"] == Decimal("98.0")
    assert result["waist_cm"] == Decimal("85")

def test_overlap_calculation_perfect():
    user = Decimal("100")
    size_min = Decimal("98")
    size_max = Decimal("102")
    # User range [99, 101] fits completely inside [98, 102]
    # Overlap = 2.0 (range width)
    # Percentage = (2.0 / 2.0) * 100 = 100
    score = calculate_overlap_percentage(user, size_min, size_max)
    assert score == Decimal("100.0")

def test_overlap_calculation_partial():
    user = Decimal("102") # Range [101, 103]
    size_min = Decimal("98")
    size_max = Decimal("102") # Overlap [101, 102] -> width 1.0
    # User width is 2.0. Overlap is 1.0. 50% match
    score = calculate_overlap_percentage(user, size_min, size_max)
    assert score == Decimal("50.0")

def test_overlap_calculation_none():
    user = Decimal("105") # Range [104, 106]
    size_min = Decimal("98")
    size_max = Decimal("102")
    score = calculate_overlap_percentage(user, size_min, size_max)
    assert score == Decimal("0.0")

def test_confidence_score():
    overlap = Decimal("80.0")
    completeness = Decimal("100.0")
    # Score = 80*0.6 + 100*0.2 + 0*0.2 = 48 + 20 = 68
    score = calculate_confidence_score(overlap, completeness)
    assert score == Decimal("68.0")
