# CyberSentinel-X extension roadmap

## Phase-I baseline

1. Normalize event records into a stable schema.
2. Run deterministic detection rules and the baseline ML classifier.
3. Calculate a risk score and expose explanation data.
4. Map observed behavior to MITRE ATT&CK.
5. Correlate related alerts into incidents.
6. Present the evidence through the React dashboard.

## Phase-II candidates

- Native EVTX parser and Sysmon Event ID mapping.
- Configurable YAML/JSON detection rules.
- Model training on a documented real dataset.
- SHAP/LIME or feature-level explainability where justified.
- Entity graph for users, processes, hosts and network endpoints.
- WebSocket/live event streaming.
- Analyst feedback loop and alert disposition.
- PDF/HTML forensic report generation.
- Elasticsearch/OpenSearch connector.
- Authentication and role-based access control.

## Final research evaluation candidates

- Precision, recall, F1-score and confusion matrix for the ML component.
- Rule detection coverage by attack technique.
- Event-correlation accuracy on staged multi-event scenarios.
- Analyst usefulness of explanations.
- Timeline reconstruction completeness.
- MITRE ATT&CK mapping coverage.
- Processing latency as event volume increases.
