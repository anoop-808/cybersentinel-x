# CyberSentinel-X Phase-II Frontend UI

This frontend redesign keeps the existing React + TypeScript + Vite architecture and API contracts. It is designed as a SOC/threat-investigation workspace rather than a generic admin dashboard.

## Design principles
- Monitor -> Investigate -> Intelligence -> Lab navigation model
- Backend-driven metrics, alerts, incidents, timeline and MITRE data
- Dense analyst-friendly Event Explorer
- Alert investigation drawer
- Investigation workspace combining case, evidence and timeline
- Detection Lab showing the complete synthetic telemetry -> detection -> risk -> correlation -> MITRE path
- Subtle CSS motion with reduced-motion support
- No fake data added to the UI

## Backend compatibility
The frontend expects the existing API at `VITE_API_BASE_URL` (for example `http://192.168.1.20:8000`) or defaults to `http://127.0.0.1:8000`. The service appends `/api`.

## Note on Motion MCP
The ChatGPT Motion integration is a video creation/editing tool, not a React UI animation runtime. Therefore this frontend uses lightweight CSS transitions/animations instead of adding an unrelated Motion MCP dependency. The design is intentionally ready for a future UI motion library if desired.
