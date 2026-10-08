from datetime import datetime, timedelta, timezone
from pathlib import Path
import csv
import io
import json
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, select
from sqlalchemy.orm import declarative_base, sessionmaker

from .detection.engine import DetectionEngine
from .services.seed import seed_demo_data
from .correlation.engine import correlate_events
from .mitre.mapper import MITRE_CATALOG, map_event_to_mitre

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
DB_PATH = DATA_DIR / "cybersentinel.db"
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    event_id = Column(String(64), index=True)
    timestamp = Column(DateTime, index=True)
    source = Column(String(64), default="Windows")
    event_type = Column(String(100), index=True)
    computer = Column(String(120))
    user_name = Column(String(120))
    process_name = Column(String(255))
    command_line = Column(Text)
    parent_process = Column(String(255))
    registry_path = Column(String(500))
    destination_ip = Column(String(64))
    process_id = Column(String(64))
    logon_id = Column(String(64))
    severity = Column(String(32), default="INFO")
    raw_data = Column(Text, default="{}")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, index=True)
    title = Column(String(255))
    severity = Column(String(32))
    risk_score = Column(Integer)
    classification = Column(String(64))
    rule_hits = Column(Text, default="[]")
    explanation = Column(Text, default="")
    mitre_techniques = Column(Text, default="[]")
    status = Column(String(32), default="Open")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True)
    incident_code = Column(String(32), unique=True)
    title = Column(String(255))
    summary = Column(Text)
    severity = Column(String(32))
    risk_score = Column(Integer)
    status = Column(String(32), default="Investigating")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class IncidentEvent(Base):
    __tablename__ = "incident_events"
    id = Column(Integer, primary_key=True)
    incident_id = Column(Integer, index=True)
    event_id = Column(Integer, index=True)


Base.metadata.create_all(engine)

app = FastAPI(title="CyberSentinel-X API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = DetectionEngine()


def dt_to_iso(value: datetime | None) -> str | None:
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.isoformat()


def event_dict(e: Event) -> dict[str, Any]:
    return {
        "id": e.id,
        "event_id": e.event_id,
        "timestamp": dt_to_iso(e.timestamp),
        "source": e.source,
        "event_type": e.event_type,
        "computer": e.computer,
        "user_name": e.user_name,
        "process_name": e.process_name,
        "command_line": e.command_line,
        "parent_process": e.parent_process,
        "registry_path": e.registry_path,
        "destination_ip": e.destination_ip,
        "process_id": e.process_id,
        "logon_id": e.logon_id,
        "severity": e.severity,
        "raw_data": json.loads(e.raw_data or "{}"),
    }


def alert_dict(a: Alert) -> dict[str, Any]:
    return {
        "id": a.id,
        "event_id": a.event_id,
        "title": a.title,
        "severity": a.severity,
        "risk_score": a.risk_score,
        "classification": a.classification,
        "rule_hits": json.loads(a.rule_hits or "[]"),
        "explanation": a.explanation,
        "mitre_techniques": json.loads(a.mitre_techniques or "[]"),
        "status": a.status,
        "created_at": dt_to_iso(a.created_at),
    }


def incident_dict(i: Incident) -> dict[str, Any]:
    return {
        "id": i.id,
        "incident_code": i.incident_code,
        "title": i.title,
        "summary": i.summary,
        "severity": i.severity,
        "risk_score": i.risk_score,
        "status": i.status,
        "created_at": dt_to_iso(i.created_at),
    }


def normalize_record(record: dict[str, Any], index: int) -> dict[str, Any]:
    def pick(*keys: str, default: Any = "") -> Any:
        for key in keys:
            if key in record and record[key] not in (None, ""):
                return record[key]
        return default

    timestamp = pick("timestamp", "TimeCreated", "time", default=datetime.now(timezone.utc).isoformat())
    if isinstance(timestamp, (int, float)):
        timestamp = datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat()
    timestamp = str(timestamp).replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(timestamp)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
    except ValueError:
        dt = datetime.now(timezone.utc)

    return {
        "event_id": str(pick("event_id", "EventId", "Id", default=f"IMP-{index:04d}")),
        "timestamp": dt,
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
        "raw_data": json.dumps(record, default=str),
    }


def save_events(records: list[dict[str, Any]]) -> int:
    db = SessionLocal()
    created = 0
    try:
        for idx, raw in enumerate(records, start=1):
            item = normalize_record(raw, idx)
            event = Event(**item)
            db.add(event)
            created += 1
        db.commit()
        return created
    finally:
        db.close()


def rebuild_alerts_and_incidents() -> None:
    db = SessionLocal()
    try:
        events = db.scalars(select(Event).order_by(Event.timestamp)).all()
        db.query(Alert).delete()
        db.query(IncidentEvent).delete()
        db.query(Incident).delete()
        db.commit()

        alerts: list[Alert] = []
        for e in events:
            result = detector.analyze(event_dict(e))
            if result["risk_score"] >= 45:
                a = Alert(
                    event_id=e.id,
                    title=result["title"],
                    severity=result["severity"],
                    risk_score=result["risk_score"],
                    classification=result["classification"],
                    rule_hits=json.dumps(result["rule_hits"]),
                    explanation=result["explanation"],
                    mitre_techniques=json.dumps(result["mitre_techniques"]),
                )
                db.add(a)
                alerts.append(a)
        db.commit()
        alerts = db.scalars(select(Alert).order_by(Alert.created_at)).all()
        groups = correlate_events([event_dict(e) for e in events], [alert_dict(a) for a in alerts])
        for n, group in enumerate(groups, start=1):
            highest = max((a["risk_score"] for a in group["alerts"]), default=0)
            sev = "CRITICAL" if highest >= 90 else "HIGH" if highest >= 75 else "MEDIUM"
            incident = Incident(
                incident_code=f"INC-{n:04d}",
                title=group["title"],
                summary=group["summary"],
                severity=sev,
                risk_score=highest,
            )
            db.add(incident)
            db.flush()
            for ev_id in group["event_db_ids"]:
                db.add(IncidentEvent(incident_id=incident.id, event_id=ev_id))
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def startup() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(Event.id).limit(1)) is None:
            seed_demo_data(save_events)
            rebuild_alerts_and_incidents()
    finally:
        db.close()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "CyberSentinel-X API"}


@app.get("/api/stats")
def stats() -> dict[str, Any]:
    db = SessionLocal()
    try:
        events = db.scalars(select(Event)).all()
        alerts = db.scalars(select(Alert)).all()
        incidents = db.scalars(select(Incident)).all()
        high = sum(1 for a in alerts if a.risk_score >= 75)
        critical = sum(1 for a in alerts if a.risk_score >= 90)
        return {"events": len(events), "alerts": len(alerts), "high_risk": high, "critical": critical, "incidents": len(incidents)}
    finally:
        db.close()


@app.get("/api/events")
def list_events(limit: int = 200) -> list[dict[str, Any]]:
    limit = max(1, min(limit, 5000))
    db = SessionLocal()
    try:
        return [event_dict(e) for e in db.scalars(select(Event).order_by(Event.timestamp.desc()).limit(limit)).all()]
    finally:
        db.close()


@app.get("/api/events/{event_id}")
def get_event(event_id: int) -> dict[str, Any]:
    db = SessionLocal()
    try:
        e = db.get(Event, event_id)
        if not e:
            raise HTTPException(404, "Event not found")
        return event_dict(e)
    finally:
        db.close()


@app.get("/api/alerts")
def list_alerts(limit: int = 200) -> list[dict[str, Any]]:
    limit = max(1, min(limit, 5000))
    db = SessionLocal()
    try:
        return [alert_dict(a) for a in db.scalars(select(Alert).order_by(Alert.risk_score.desc()).limit(limit)).all()]
    finally:
        db.close()


@app.get("/api/alerts/{alert_id}")
def get_alert(alert_id: int) -> dict[str, Any]:
    db = SessionLocal()
    try:
        a = db.get(Alert, alert_id)
        if not a:
            raise HTTPException(404, "Alert not found")
        return alert_dict(a)
    finally:
        db.close()


@app.get("/api/incidents")
def list_incidents() -> list[dict[str, Any]]:
    db = SessionLocal()
    try:
        return [incident_dict(i) for i in db.scalars(select(Incident).order_by(Incident.risk_score.desc())).all()]
    finally:
        db.close()


@app.get("/api/incidents/{incident_id}")
def get_incident(incident_id: int) -> dict[str, Any]:
    db = SessionLocal()
    try:
        incident = db.get(Incident, incident_id)
        if not incident:
            raise HTTPException(404, "Incident not found")
        event_ids = [x.event_id for x in db.scalars(select(IncidentEvent).where(IncidentEvent.incident_id == incident.id)).all()]
        events = [db.get(Event, x) for x in event_ids]
        return {**incident_dict(incident), "events": [event_dict(e) for e in events if e]}
    finally:
        db.close()


@app.get("/api/timeline")
def timeline() -> list[dict[str, Any]]:
    db = SessionLocal()
    try:
        events = db.scalars(select(Event).order_by(Event.timestamp)).all()
        alerts = {a.event_id: a for a in db.scalars(select(Alert)).all()}
        return [
            {
                **event_dict(e),
                "alert": alert_dict(alerts[e.id]) if e.id in alerts else None,
            }
            for e in events
        ]
    finally:
        db.close()


@app.get("/api/mitre")
def mitre() -> list[dict[str, str]]:
    return list(MITRE_CATALOG.values())


@app.post("/api/events/ingest")
async def ingest(file: UploadFile = File(...)) -> dict[str, Any]:
    name = (file.filename or "").lower()
    if not (name.endswith(".json") or name.endswith(".csv")):
        raise HTTPException(400, "Upload JSON or CSV. Use the included PowerShell exporter for Windows Event Logs.")
    content = await file.read()
    try:
        if name.endswith(".json"):
            payload = json.loads(content.decode("utf-8-sig"))
            records = payload if isinstance(payload, list) else payload.get("events", [])
        else:
            records = list(csv.DictReader(io.StringIO(content.decode("utf-8-sig"))))
        if not isinstance(records, list) or not records:
            raise ValueError("No event records found")
        if len(records) > 5000:
            raise ValueError("Maximum 5000 records per upload")
        created = save_events(records)
        rebuild_alerts_and_incidents()
        return {"created": created, "status": "ingested"}
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as exc:
        raise HTTPException(400, f"Invalid input: {exc}") from exc


@app.get("/api/reports/incidents/{incident_id}", response_class=PlainTextResponse)
def report(incident_id: int) -> str:
    result = get_incident(incident_id)
    lines = [
        "CYBERSENTINEL-X FORENSIC INVESTIGATION REPORT",
        "=" * 50,
        f"Incident: {result['incident_code']}",
        f"Title: {result['title']}",
        f"Severity: {result['severity']}",
        f"Risk Score: {result['risk_score']}/100",
        f"Status: {result['status']}",
        "",
        "Summary",
        result["summary"],
        "",
        "Timeline",
    ]
    for e in result["events"]:
        lines.append(f"- {e['timestamp']} | {e['event_type']} | {e['process_name']} | {e['command_line']}")
    return "\n".join(lines)
