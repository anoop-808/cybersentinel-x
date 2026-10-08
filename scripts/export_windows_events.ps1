# CyberSentinel-X demo collector for Windows PowerShell.
# Exports a normalized starter dataset from common Windows logs.
# Run from PowerShell: .\export_windows_events.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'backend\data\windows_events.json'

$logs = @('Security','System','Windows PowerShell')
$records = @()

foreach ($log in $logs) {
    try {
        $records += Get-WinEvent -LogName $log -MaxEvents 150 | ForEach-Object {
            [PSCustomObject]@{
                event_id = [string]$_.Id
                timestamp = $_.TimeCreated.ToUniversalTime().ToString('o')
                source = [string]$_.ProviderName
                event_type = [string]$_.LevelDisplayName
                computer = [string]$_.MachineName
                user_name = if ($_.UserId) { $_.UserId.Value } else { 'UNKNOWN' }
                process_name = ''
                command_line = ''
                parent_process = ''
                registry_path = ''
                destination_ip = ''
                process_id = ''
                logon_id = ''
                severity = [string]$_.LevelDisplayName
                raw_message = [string]$_.Message
            }
        }
    } catch {
        Write-Warning "Could not read log '$log': $($_.Exception.Message)"
    }
}

$records | Sort-Object timestamp | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 $out
Write-Host "Exported $($records.Count) records to $out"
Write-Host "Upload the JSON in Event Explorer after starting CyberSentinel-X."
