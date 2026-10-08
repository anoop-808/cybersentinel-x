MITRE_CATALOG = {
    "T1059.001": {"id": "T1059.001", "name": "PowerShell", "tactic": "Execution", "description": "Command and scripting interpreter using PowerShell."},
    "T1547.001": {"id": "T1547.001", "name": "Registry Run Keys / Startup Folder", "tactic": "Persistence", "description": "Persistence through startup registry locations."},
    "T1105": {"id": "T1105", "name": "Ingress Tool Transfer", "tactic": "Command and Control", "description": "Transfer tools or files into an environment."},
    "T1071.001": {"id": "T1071.001", "name": "Web Protocols", "tactic": "Command and Control", "description": "Application-layer communication over web protocols."},
    "T1204.002": {"id": "T1204.002", "name": "Malicious File", "tactic": "Execution", "description": "User execution of a malicious file."},
}


def map_event_to_mitre(event: dict) -> list[dict]:
    text = " ".join(str(event.get(k, "")) for k in ["event_type", "process_name", "command_line", "registry_path", "destination_ip", "raw_data"]).lower()
    matches = []
    if "powershell" in text:
        matches.append(MITRE_CATALOG["T1059.001"])
    if "currentversion\\run" in text or "run\\" in text:
        matches.append(MITRE_CATALOG["T1547.001"])
    if "invoke-webrequest" in text or "download" in text:
        matches.append(MITRE_CATALOG["T1105"])
    if "203.0.113." in text or "198.51.100." in text:
        matches.append(MITRE_CATALOG["T1071.001"])
    if "word.exe->powershell.exe" in text or "excel.exe->powershell.exe" in text:
        matches.append(MITRE_CATALOG["T1204.002"])
    return matches
