from .ml_model import BaselineNBClassifier

RULES = [
    {
        "name": "Suspicious PowerShell",
        "terms": ["powershell", "encodedcommand"],
        "score": 58,
        "mitre": "T1059.001",
        "reason": "PowerShell execution contains suspicious encoded-command indicators.",
    },
    {
        "name": "PowerShell Download",
        "terms": ["powershell", "invoke-webrequest"],
        "score": 50,
        "mitre": "T1105",
        "reason": "PowerShell references a file/network transfer command.",
    },
    {
        "name": "Registry Run Key Persistence",
        "terms": ["run\\", "currentversion\\run"],
        "score": 55,
        "mitre": "T1547.001",
        "reason": "Registry activity targets a common startup persistence location.",
    },
    {
        "name": "Suspicious Remote Connection",
        "terms": ["203.0.113."],
        "score": 28,
        "mitre": "T1071.001",
        "reason": "Network activity references a documentation-range external address used in the demo scenario.",
    },
    {
        "name": "Unusual Process Parent",
        "terms": ["winword.exe->powershell.exe", "excel.exe->powershell.exe"],
        "score": 35,
        "mitre": "T1204.002",
        "reason": "Office application spawning PowerShell is treated as suspicious in this baseline.",
    },
]


class DetectionEngine:
    def __init__(self) -> None:
        self.model = BaselineNBClassifier()

    def analyze(self, event: dict) -> dict:
        text = " ".join(
            str(event.get(k, ""))
            for k in ["event_type", "process_name", "command_line", "parent_process", "registry_path", "destination_ip", "raw_data"]
        ).lower()
        rule_hits = []
        reasons = []
        mitre = []
        rule_score = 0
        for rule in RULES:
            if all(term in text for term in rule["terms"]):
                rule_score += rule["score"]
                rule_hits.append(rule["name"])
                reasons.append(rule["reason"])
                mitre.append(rule["mitre"])
        ml_score = self.model.predict_risk(text)
        risk = min(100, round(rule_score * 0.7 + ml_score * 0.3)) if rule_score else ml_score
        if risk >= 90:
            severity = "CRITICAL"
        elif risk >= 75:
            severity = "HIGH"
        elif risk >= 45:
            severity = "MEDIUM"
        else:
            severity = "LOW"
        classification = "Malicious" if risk >= 75 else "Suspicious" if risk >= 45 else "Benign"
        if not reasons and ml_score >= 45:
            reasons.append("Baseline ML classifier identified a high-risk lexical pattern.")
        if not reasons:
            reasons.append("No strong rule match was observed; baseline model risk remains low.")
        return {
            "title": f"{classification} activity detected",
            "severity": severity,
            "risk_score": risk,
            "classification": classification,
            "rule_hits": rule_hits,
            "explanation": " ".join(reasons),
            "mitre_techniques": sorted(set(mitre)),
            "ml_score": ml_score,
            "rule_score": min(rule_score, 100),
        }
