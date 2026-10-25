param(
    [ValidateRange(1,65535)]
    [int]$Port = 3000,
    [ValidateRange(1,300)]
    [int]$TimeoutSeconds = 120
)
$ErrorActionPreference = 'SilentlyContinue'
$uri = "http://localhost:$Port/"
$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $deadline) {
    try {
        $response = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 3
        if ([int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 500) {
            Start-Process $uri
            exit 0
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}
Write-Host "AviNexus did not respond at $uri within $TimeoutSeconds seconds."
exit 1
