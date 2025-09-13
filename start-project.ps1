Write-Host "🚀 Starting MERN Memories Project..." -ForegroundColor Green
Write-Host ""

Write-Host "📡 Starting Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start"

Write-Host "⏳ Waiting 3 seconds for server to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "🎨 Starting Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"

Write-Host ""
Write-Host "✅ Both server and client are starting!" -ForegroundColor Green
Write-Host "🌐 Server: http://localhost:5000" -ForegroundColor Blue
Write-Host "🎨 Client: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
