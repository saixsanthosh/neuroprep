@echo off
setlocal

set ROOT=%~dp0
set BACKEND=%ROOT%backend
set FRONTEND=%ROOT%frontend
set PYTHON=%BACKEND%\.venv\Scripts\python.exe

if not exist "%PYTHON%" (
  echo Backend virtual environment was not found at:
  echo %PYTHON%
  exit /b 1
)

start "NeuroPrep API" cmd /k "cd /d \"%BACKEND%\" && \"%PYTHON%\" -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
start "NeuroPrep Web" cmd /k "cd /d \"%FRONTEND%\" && npm run build && npm run preview -- --host 127.0.0.1 --port 5173"

timeout /t 5 /nobreak >nul
start "" http://127.0.0.1:5173
