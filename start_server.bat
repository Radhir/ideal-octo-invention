@echo off
echo Starting Elite Shine Workshop Suite...
echo.

:: Change to the script's directory
cd /d "%~dp0"

:: Check if virtual environment exists
if not exist venv\Scripts\activate.bat (
    echo [ERROR] Virtual environment 'venv' not found!
    echo Please ensure the project is set up correctly.
    pause
    exit /b
)

:: Activate virtual environment and start server
echo [1/2] Activating Virtual Environment...
call venv\Scripts\activate

echo [2/2] Launching Django Server...
echo The application will be available at http://127.0.0.1:8000/
echo Press Ctrl+C to stop the server.
echo.

:: Open browser automatically
start http://127.0.0.1:8000/

:: Start the server
python manage.py runserver

pause
