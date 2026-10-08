# CyberSentinel-X — Phase-I Working Prototype

CyberSentinel-X is a modular research prototype built from the supplied Phase-I abstract. The current implementation provides a working React frontend, FastAPI backend, SQLite persistence, Windows-style event ingestion, hybrid rule + lightweight ML baseline detection, risk scoring, explainability, event correlation, attack timeline reconstruction, MITRE ATT&CK mapping, incident investigation, and a text investigation report.

## Why this foundation is flexible

The implementation is deliberately split into ingestion, detection, correlation, explainability, MITRE mapping, investigation, and presentation layers. Later work can replace the baseline ML classifier, add Sysmon/EVTX collection, add richer datasets, improve XAI, add streaming, introduce another database, or add SIEM integrations without redesigning the UI contract.

## Project layout

```text
cybersentinel-x/
├── backend/
│   ├── app/
│   │   ├── detection/        # Rules + baseline ML
│   │   ├── correlation/      # Event-to-incident grouping
│   │   ├── mitre/            # ATT&CK technique mapping
│   │   ├── ingestion/         # Windows JSON normalization
│   │   ├── services/          # Seed/demo data
│   │   └── main.py            # FastAPI + persistence + API
│   ├── data/                 # SQLite DB + imported logs
│   └── requirements.txt
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/services/api.ts
│   └── package.json
├── scripts/
│   ├── export_windows_events.ps1
│   ├── start_windows.ps1
│   └── start_linux.sh
└── docs/
```

## Windows (primary path)

Prerequisites: Python 3.11+ and Node.js 20+ recommended.

Option A — one command:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\start_windows.ps1
```

Option B — two terminals:

Terminal 1:

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2:

```powershell
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

The backend API is available at `http://127.0.0.1:8000/docs`.

## Linux

```bash
./scripts/start_linux.sh
```

Open `http://localhost:5173`.

## Import real Windows logs

On Windows, with the backend stopped or while using another PowerShell window:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\export_windows_events.ps1
```

Then open **Event Explorer → Ingest Logs** and select `backend\data\windows_events.json`.

The importer accepts either JSON arrays or CSV files and normalizes common field names. This lets the same backend work with datasets created on Windows or Linux.

The exporter skips unavailable channels with a warning. It attempts Security, System, Windows PowerShell, PowerShell Operational, and Sysmon Operational logs; Sysmon is optional. The output is synthetic-safe normalized JSON and retains the original message/record ID in `raw_data`.

## API workflow

The main API contract is:

```text
GET  /api/health
GET  /api/stats
GET  /api/events
POST /api/events/ingest       multipart field: file (.json or .csv)
GET  /api/alerts
GET  /api/incidents
GET  /api/timeline
GET  /api/mitre
GET  /api/demo/malware-chain
```

Ingestion normalizes each record, stores it in SQLite, rebuilds baseline detections, correlates same-host events within ten minutes, and exposes the resulting alerts/incidents. Malformed records are counted as rejected when at least one valid record remains.

## Demo walkthrough

Use **Detection Lab** to view the deterministic synthetic PowerShell chain. It demonstrates encoded PowerShell, transfer activity, registry persistence, network communication, risk scoring, explanations, MITRE IDs, and the correlated incident/timeline. It does not download or execute malware and is not a claim of arbitrary malware classification.

## Development checks

```bash
cd backend && python -m unittest discover -s tests -v
cd ../frontend && npm run build
```

## Current prototype scope

Working now:
- API health endpoint
- SQLite event/alert/incident storage
- Demo telemetry seeding
- JSON/CSV ingestion
- Rule-based threat detections
- Pure-Python baseline Naive Bayes risk component
- Combined risk scoring and classification
- Human-readable detection explanation
- MITRE ATT&CK baseline mapping
- Alert view
- Correlated incidents
- Attack timeline
- Investigation workspace
- Text investigation report endpoint
- Responsive dashboard

Not claimed as final:
- Production malware sandboxing
- Live EDR-grade telemetry
- Production-trained ML accuracy
- Full Sysmon/EVTX semantic parsing
- Production-scale streaming
- Automated containment

Those are natural Phase-II/final-project extensions.
