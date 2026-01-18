#!/bin/bash
# Test script to verify routes work locally (simulating Vercel behavior)
# Run: bash test-vercel-routes.sh

echo "🧪 Testing Routes for Vercel Compatibility..."
echo ""

# Test if server is running
if ! curl -s http://localhost:5000/ > /dev/null 2>&1; then
    echo "❌ Server not running!"
    echo "   Start server: cd server && npm start"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Test routes
echo "Testing routes..."
echo ""

# Test 1: Root endpoint
echo "1. Testing GET /"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/)
if [ "$RESPONSE" = "200" ]; then
    echo "   ✅ GET / → 200 OK"
else
    echo "   ❌ GET / → $RESPONSE"
fi

# Test 2: /api/user/google (POST) - This is what Vercel will use
echo "2. Testing POST /api/user/google"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","googleId":"123","name":"Test"}' \
    http://localhost:5000/api/user/google)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "400" ] || [ "$RESPONSE" = "500" ]; then
    echo "   ✅ POST /api/user/google → $RESPONSE (Route exists!)"
elif [ "$RESPONSE" = "405" ]; then
    echo "   ❌ POST /api/user/google → 405 Method Not Allowed"
    echo "      Route exists but doesn't accept POST method"
elif [ "$RESPONSE" = "404" ]; then
    echo "   ❌ POST /api/user/google → 404 Not Found"
    echo "      Route doesn't exist - check server/index.js"
else
    echo "   ⚠️  POST /api/user/google → $RESPONSE"
fi

# Test 3: /user/google (POST) - Local dev path
echo "3. Testing POST /user/google"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","googleId":"123","name":"Test"}' \
    http://localhost:5000/user/google)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "400" ] || [ "$RESPONSE" = "500" ]; then
    echo "   ✅ POST /user/google → $RESPONSE (Route exists!)"
elif [ "$RESPONSE" = "405" ]; then
    echo "   ❌ POST /user/google → 405 Method Not Allowed"
elif [ "$RESPONSE" = "404" ]; then
    echo "   ❌ POST /user/google → 404 Not Found"
else
    echo "   ⚠️  POST /user/google → $RESPONSE"
fi

echo ""
echo "✨ Test complete!"
echo ""
echo "💡 If /api/user/google returns 405, the route mounting is wrong."
echo "💡 If /api/user/google returns 404, the route doesn't exist."
echo "💡 If /api/user/google returns 200/400/500, the route works! ✅"

