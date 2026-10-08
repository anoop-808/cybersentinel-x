# CyberSentinel-X modular architecture

```text
Windows Event Logs / JSON / CSV
            |
            v
     +---------------+
     | Ingestion      |
     | Normalization  |
     +-------+--------+
             |
             v
     +---------------+
     | Core Event     |
     | Data Model     |
     +-------+--------+
             |
       +-----+------+
       |            |
       v            v
  +---------+  +---------+
  | Rules   |  | ML      |
  | Engine  |  | Baseline|
  +----+----+  +----+----+
       |            |
       +-----+------+
             v
       +-------------+
       | Risk Score  |
       +------+------+ 
              |
      +-------+--------+
      |       |        |
      v       v        v
 Explain   MITRE   Correlation
   |        |         |
   +--------+---------+
            v
       Incident Model
            |
      +-----+------+
      |            |
      v            v
 Timeline     Investigation /
              Reporting
            |
            v
       REST API (FastAPI)
            |
            v
      React Dashboard
```

## Stable boundaries

- **Ingestion:** accepts external telemetry and produces normalized events.
- **Detection:** produces structured detection results and does not know how the frontend renders them.
- **Correlation:** converts event/alert sequences into incidents.
- **Explainability:** turns detection features/rule hits into analyst-readable evidence.
- **MITRE mapper:** maps observed behavior to technique records independently of UI.
- **Investigation:** consumes incidents/events and creates analyst/report views.
- **API:** the only contract the frontend depends on.

## Extension principle

Adding a new collector, detection rule, classifier, or mapping should primarily add a module or adapter. Existing API response shapes should remain stable unless a deliberate versioned change is required.
