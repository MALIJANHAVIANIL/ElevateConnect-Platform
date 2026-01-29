@echo off
echo ==================================
echo Starting ElevateConnect Backend
echo ==================================

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Using Java: %JAVA_HOME%
echo.

cd /d "%~dp0"
call mvnw.cmd spring-boot:run

pause
