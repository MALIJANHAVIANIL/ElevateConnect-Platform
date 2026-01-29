Write-Host "==================================" -ForegroundColor Green
Write-Host "Starting ElevateConnect Backend" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot
cmd /c "mvnw.cmd spring-boot:run"
