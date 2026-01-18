// Test API endpoints locally to simulate Vercel behavior
// Run: node test-api-local.js

import http from 'http';

const testEndpoint = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          body: body ? JSON.parse(body) : null,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Testing API Endpoints Locally...\n');
  console.log('⚠️  Make sure server is running: cd server && npm start\n');

  const tests = [
    {
      name: 'Root endpoint',
      path: '/',
      method: 'GET',
    },
    {
      name: 'Google OAuth (with /api prefix)',
      path: '/api/user/google',
      method: 'POST',
      data: {
        email: 'test@example.com',
        googleId: '123456',
        name: 'Test User',
      },
    },
    {
      name: 'Google OAuth (without /api prefix)',
      path: '/user/google',
      method: 'POST',
      data: {
        email: 'test@example.com',
        googleId: '123456',
        name: 'Test User',
      },
    },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`  ${test.method} ${test.path}`);
      
      const result = await testEndpoint(test.path, test.method, test.data);
      
      if (result.status === 405) {
        console.log(`  ❌ 405 Method Not Allowed - Route exists but method doesn't match\n`);
      } else if (result.status === 404) {
        console.log(`  ❌ 404 Not Found - Route doesn't exist\n`);
      } else {
        console.log(`  ✅ ${result.status} ${result.statusText}\n`);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`  ⚠️  Server not running. Start with: cd server && npm start\n`);
      } else {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }
  }

  console.log('\n✨ Test complete!');
  console.log('\n💡 If /api/user/google returns 405, check route mounting.');
  console.log('💡 If /api/user/google returns 404, route is not mounted correctly.');
  console.log('💡 If /api/user/google returns 400/500, route works but needs valid data.\n');
};

runTests();

