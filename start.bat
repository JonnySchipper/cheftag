@echo off
echo ========================================
echo   Ticketer Label Printing System
echo ========================================
echo.
echo Choose an option:
echo.
echo 1. Start Print Server (Mock Mode)
echo 2. Start Web Interface
echo 3. Start Both
echo 4. Install Dependencies
echo 5. Exit
echo.

set /p choice="Enter choice (1-5): "

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto start_web
if "%choice%"=="3" goto start_both
if "%choice%"=="4" goto install_deps
if "%choice%"=="5" goto exit

:start_server
echo Starting Print Server...
cd print-server
python server.py
pause
goto exit

:start_web
echo Starting Web Interface...
cd web
python -m http.server 8000
pause
goto exit

:start_both
echo Starting both servers...
echo.
echo Print Server will run in one window...
echo Web Interface will open in your browser...
echo.
start cmd /k "cd /d print-server && python server.py"
timeout /t 3 /nobreak > nul
start http://localhost:8000
cd web
python -m http.server 8000
goto exit

:install_deps
echo Installing dependencies...
cd print-server
pip install -r requirements.txt
echo Dependencies installed successfully!
pause
goto exit

:exit
echo.
echo Thank you for using Ticketer!
pause