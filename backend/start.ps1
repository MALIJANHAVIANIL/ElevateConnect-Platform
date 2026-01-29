Write-Host "==================================" -ForegroundColor Green
Write-Host "Starting ElevateConnect Backend" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
Write-Host "Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "Downloading Maven wrapper..." -ForegroundColor Yellow

# Download Maven if needed
$mavenHome = "$env:USERPROFILE\.m2\wrapper\dists\apache-maven-3.9.6"
if (-not (Test-Path "$mavenHome\bin\mvn.cmd")) {
    Write-Host "Downloading Apache Maven 3.9.6..." -ForegroundColor Yellow
    $mavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    $zipFile = "$env:TEMP\maven.zip"
    Invoke-WebRequest -Uri $mavenUrl -OutFile $zipFile
    
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath "$env:USERPROFILE\.m2\wrapper\dists" -Force
    Remove-Item $zipFile
}

Write-Host "Starting Spring Boot..." -ForegroundColor Cyan
$mvnCmd = "$env:USERPROFILE\.m2\wrapper\dists\apache-maven-3.9.6\bin\mvn.cmd"
& $mvnCmd spring-boot:run
