from datetime import datetime


def correlate_events(events: list[dict], alerts: list[dict]) -> list[dict]:
    if not events:
        return []
    alert_by_event = {a["event_id"]: a for a in alerts}
    groups: list[dict] = []
    current = None
    for event in sorted(events, key=lambda x: x["timestamp"] or ""):
        event_alert = alert_by_event.get(event["id"])
        if not event_alert:
            continue
        stamp = datetime.fromisoformat(event["timestamp"].replace("Z", "+00:00"))
        if current is None:
            current = {"events": [], "alerts": [], "start": stamp, "end": stamp, "computer": event["computer"]}
        gap = (stamp - current["end"]).total_seconds()
        same_host = event["computer"] == current["computer"]
        if gap > 600 or not same_host:
            groups.append(_build_group(current))
            current = {"events": [], "alerts": [], "start": stamp, "end": stamp, "computer": event["computer"]}
        current["events"].append(event)
        current["alerts"].append(event_alert)
        current["end"] = stamp
    if current:
        groups.append(_build_group(current))
    return groups


def _build_group(group: dict) -> dict:
    max_risk = max((a["risk_score"] for a in group["alerts"]), default=0)
    title = "Correlated suspicious activity"
    if any("PowerShell" in a["title"] for a in group["alerts"]):
        title = "Potential PowerShell-led intrusion sequence"
    return {
        "title": title,
        "summary": (
            f"Correlated {len(group['events'])} events on {group['computer']} between "
            f"{group['start'].isoformat()} and {group['end'].isoformat()}. "
            f"Highest observed risk was {max_risk}/100."
        ),
        "alerts": group["alerts"],
        "event_db_ids": [e["id"] for e in group["events"]],
    }
