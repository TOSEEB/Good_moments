@echo off
echo 🚀 Starting MERN Memories Project...
echo.

echo 📡 Starting Server...
start "Server" cmd /k "cd server && npm start"

echo ⏳ Waiting 3 seconds for server to start...
timeout /t 3 /nobreak > nul

echo 🎨 Starting Client...
start "Client" cmd /k "cd client && npm start"

echo.
echo ✅ Both server and client are starting!
echo 🌐 Server: http://localhost:5000
echo 🎨 Client: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
