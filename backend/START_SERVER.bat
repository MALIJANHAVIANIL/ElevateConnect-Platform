@echo off
cls
echo ============================================
echo   ElevateConnect Backend - Quick Start
echo ============================================
echo.

REM Ask for MySQL password
set /p MYSQL_PASSWORD="Enter your MySQL root password (press Enter if no password): "

REM Set Java Home
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo.
echo [1/3] Updating database password...
powershell -Command "(Get-Content 'src\main\resources\application.properties' -Raw) -replace 'spring.datasource.password=.*', 'spring.datasource.password=%MYSQL_PASSWORD%' | Set-Content 'src\main\resources\application.properties'"

echo [2/3] Cleaning previous build...
call "C:\Users\Lenovo\.m2\wrapper\dists\apache-maven-3.9.6\bin\mvn.cmd" clean

echo [3/3] Starting backend server...
echo.
echo ============================================
echo   Server starting on http://localhost:8080
echo   Press Ctrl+C to stop
echo ============================================
echo.

call "C:\Users\Lenovo\.m2\wrapper\dists\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run

pause
