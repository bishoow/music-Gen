@echo off
echo Starting Music Composer Application...

echo Starting Backend Server...
start cmd /k "cd backend && venv\Scripts\activate.bat && python app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
start cmd /k "cd frontend && npm start"

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000

pause
