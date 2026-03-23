@echo off
REM Online Exam Portal - Quick Setup Script for Windows

echo ==========================================
echo Online Exam Portal - Setup Script
echo ==========================================
echo.

REM Check Python installation
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)
echo √ Python found
echo.

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo X Failed to create virtual environment
    pause
    exit /b 1
)
echo √ Virtual environment created
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo √ Virtual environment activated
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)
echo √ Dependencies installed
echo.

REM Create necessary directories
echo Creating necessary directories...
if not exist "flask_session" mkdir flask_session
if not exist "static\images" mkdir static\images
echo √ Directories created
echo.

REM Create __init__.py files
echo Creating package initialization files...
type nul > models\__init__.py
type nul > routes\__init__.py
type nul > utils\__init__.py
echo √ Package files created
echo.

echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo 1. Start MySQL server
echo 2. Import database: mysql -u root -p ^< database_setup.sql
echo 3. Update database credentials in config.py
echo 4. Run: python app.py
echo.
echo Default Admin Login:
echo   Email: admin@exam.com
echo   Password: admin123
echo.
echo Happy Coding! 🚀
echo.
pause