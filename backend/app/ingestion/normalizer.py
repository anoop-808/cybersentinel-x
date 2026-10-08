from datetime import datetime, timezone
import json
from typing import Any


def normalize_record(record: dict[str, Any], index: int = 1) -> dict[str, Any]:
    if not isinstance(record, dict):
        raise TypeError("Each event must be a JSON object")

    def pick(*keys: str, default: Any = "") -> Any:
        for key in keys:
            value = record.get(key)
            if value not in (None, ""):
                return value
        return default

    timestamp = pick("timestamp", "TimeCreated", "time", default=datetime.now(timezone.utc).isoformat())
    if isinstance(timestamp, (int, float)):
        timestamp = datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat()
    try:
        parsed = datetime.fromisoformat(str(timestamp).replace("Z", "+00:00"))
    except (TypeError, ValueError) as exc:
        raise ValueError(f"Invalid timestamp at record {index}") from exc
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    raw = pick("raw_data", "RawData", "raw_message", "Message", default=record)
    if not isinstance(raw, (dict, list, str, int, float, bool)) and raw is not None:
        raw = str(raw)
    return {
        "event_id": str(pick("event_id", "EventId", "Id", default=f"IMP-{index:04d}")),
        "timestamp": parsed,
        "source": str(pick("source", "ProviderName", "Provider", default="Windows")),
        "event_type": str(pick("event_type", "EventType", "Type", "LevelDisplayName", default="Unknown Event")),
        "computer": str(pick("computer", "MachineName", default="ImportedHost")),
        "user_name": str(pick("user_name", "User", "AccountName", default="UNKNOWN")),
        "process_name": str(pick("process_name", "ProcessName", "Image", default="")),
        "command_line": str(pick("command_line", "CommandLine", "ScriptBlockText", default="")),
        "parent_process": str(pick("parent_process", "ParentProcess", "ParentImage", default="")),
        "registry_path": str(pick("registry_path", "RegistryPath", default="")),
        "destination_ip": str(pick("destination_ip", "DestinationIp", "DestinationIP", default="")),
        "process_id": str(pick("process_id", "ProcessId", default="")),
        "logon_id": str(pick("logon_id", "LogonId", default="")),
        "severity": str(pick("severity", "Severity", default="INFO")),
        "raw_data": json.dumps(raw, default=str),
    }
