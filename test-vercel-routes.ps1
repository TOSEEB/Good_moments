# PowerShell script to test routes locally (simulating Vercel behavior)
# Run: .\test-vercel-routes.ps1

Write-Host "🧪 Testing Routes for Vercel Compatibility..." -ForegroundColor Cyan
Write-Host ""

# Test if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/" -Method GET -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Server not running!" -ForegroundColor Red
    Write-Host "   Start server: cd server && npm start" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test routes
Write-Host "Testing routes..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Root endpoint
Write-Host "1. Testing GET /" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ GET / → $($response.StatusCode) OK" -ForegroundColor Green
} catch {
    Write-Host "   ❌ GET / → Error" -ForegroundColor Red
}

# Test 2: /api/user/google (POST) - This is what Vercel will use
Write-Host "2. Testing POST /api/user/google" -ForegroundColor Yellow
$body = @{
    email = "test@test.com"
    googleId = "123"
    name = "Test"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/user/google" -Method POST `
        -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ POST /api/user/google → $($response.StatusCode) (Route exists!)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 405) {
        Write-Host "   ❌ POST /api/user/google → 405 Method Not Allowed" -ForegroundColor Red
        Write-Host "      Route exists but doesn't accept POST method" -ForegroundColor Yellow
    } elseif ($statusCode -eq 404) {
        Write-Host "   ❌ POST /api/user/google → 404 Not Found" -ForegroundColor Red
        Write-Host "      Route doesn't exist - check server/index.js" -ForegroundColor Yellow
    } elseif ($statusCode -eq 400 -or $statusCode -eq 500) {
        Write-Host "   ✅ POST /api/user/google → $statusCode (Route exists!)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  POST /api/user/google → $statusCode" -ForegroundColor Yellow
    }
}

# Test 3: /user/google (POST) - Local dev path
Write-Host "3. Testing POST /user/google" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/user/google" -Method POST `
        -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ POST /user/google → $($response.StatusCode) (Route exists!)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 405) {
        Write-Host "   ❌ POST /user/google → 405 Method Not Allowed" -ForegroundColor Red
    } elseif ($statusCode -eq 404) {
        Write-Host "   ❌ POST /user/google → 404 Not Found" -ForegroundColor Red
    } elseif ($statusCode -eq 400 -or $statusCode -eq 500) {
        Write-Host "   ✅ POST /user/google → $statusCode (Route exists!)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  POST /user/google → $statusCode" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Test complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 If /api/user/google returns 405, the route mounting is wrong." -ForegroundColor Yellow
Write-Host "💡 If /api/user/google returns 404, the route doesn't exist." -ForegroundColor Yellow
Write-Host "💡 If /api/user/google returns 200/400/500, the route works! ✅" -ForegroundColor Green

