# Five-minute demo flow

1. Start the backend and frontend.
2. Open **Overview** and point out the API-backed event, alert, and incident counters.
3. Open **Detection Lab**. Confirm the banner says synthetic telemetry.
4. Walk through the chain: PowerShell → encoded command → transfer → registry Run key → network activity.
5. Open **Threat Alerts** and use **Explain** to show rule hits, risk score, and deterministic reasons.
6. Open **Incidents** or **Investigation** to show the correlated case and its evidence.
7. Open **Attack Timeline** and **MITRE ATT&CK** to show backend-generated chronology and technique mappings.
8. For imported telemetry, run `scripts/export_windows_events.ps1`, then use **Event Explorer → Ingest Logs**. Imported records are real exported telemetry; the Detection Lab remains synthetic.
