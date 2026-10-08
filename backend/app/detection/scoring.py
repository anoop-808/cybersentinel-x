def calculate_risk(rule_score: int | float, ml_score: int | float) -> int:
    """Combine the two baseline signals into one bounded score."""
    rule = max(0, min(100, float(rule_score)))
    ml = max(0, min(100, float(ml_score)))
    return max(0, min(100, round(rule * 0.7 + ml * 0.3)))


def classify_risk(risk_score: int) -> tuple[str, str]:
    if risk_score >= 90:
        return "CRITICAL", "Malicious"
    if risk_score >= 75:
        return "HIGH", "Malicious"
    if risk_score >= 45:
        return "MEDIUM", "Suspicious"
    return "LOW", "Benign"
