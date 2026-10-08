$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root 'backend'
$Venv = Join-Path $Backend '.venv'
$Py = Join-Path $Venv 'Scripts\python.exe'

if (-not (Test-Path $Py)) {
    Write-Host 'Creating Python virtual environment...'
    python -m venv $Venv
}

Write-Host 'Installing/updating backend dependencies...'
& $Py -m pip install -r (Join-Path $Backend 'requirements.txt')

Write-Host 'Starting CyberSentinel-X backend...'
$backendCommand = "Set-Location '$Backend'; & '$Py' -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
Start-Process powershell -ArgumentList @('-NoExit','-ExecutionPolicy','Bypass','-Command',$backendCommand)

Start-Sleep -Seconds 2
Write-Host 'Starting CyberSentinel-X frontend...'
Set-Location (Join-Path $Root 'frontend')
if (-not (Test-Path 'node_modules')) { npm install }
npm run dev -- --host 127.0.0.1
