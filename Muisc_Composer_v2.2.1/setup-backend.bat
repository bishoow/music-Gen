@echo off
echo Setting up Music Composer Backend...

cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo Installing ML dependencies...
pip install -r ..\Testings\requirements.txt

echo Backend setup complete!
echo.
echo To start the backend server, run:
echo cd backend
echo venv\Scripts\activate.bat
echo python app.py

pause
