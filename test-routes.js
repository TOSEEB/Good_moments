// Quick test script to verify routes work locally
// Run: node test-routes.js

import app from './server/index.js';

const testRoutes = async () => {
  console.log('🧪 Testing Routes...\n');
  
  const routes = [
    { method: 'POST', path: '/user/google', description: 'Google OAuth endpoint' },
    { method: 'POST', path: '/api/user/google', description: 'Google OAuth endpoint (with /api prefix)' },
    { method: 'GET', path: '/posts', description: 'Get posts' },
    { method: 'GET', path: '/api/posts', description: 'Get posts (with /api prefix)' },
    { method: 'POST', path: '/user/signin', description: 'Sign in' },
    { method: 'POST', path: '/api/user/signin', description: 'Sign in (with /api prefix)' },
  ];

  console.log('📋 Registered Routes:\n');
  
  // Check if routes are registered
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
      console.log(`✅ ${methods.padEnd(8)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // This is a router middleware
      if (middleware.regexp) {
        const path = middleware.regexp.source.replace(/\\|\^|\$|\?/g, '').replace(/\(.*?\)/g, '');
        console.log(`📦 Router mounted at: ${path}`);
      }
    }
  });

  console.log('\n🔍 Testing Route Matching:\n');
  
  // Simulate requests
  const testRequest = (method, path) => {
    return new Promise((resolve) => {
      const req = {
        method: method,
        url: path,
        path: path,
        headers: {},
        body: {}
      };
      
      const res = {
        statusCode: null,
        headers: {},
        json: (data) => {
          resolve({ status: res.statusCode, data });
        },
        send: (data) => {
          resolve({ status: res.statusCode, data });
        },
        status: (code) => {
          res.statusCode = code;
          return res;
        }
      };
      
      let matched = false;
      app._router.stack.forEach((middleware) => {
        if (middleware.route && middleware.route.path === path.split('?')[0]) {
          if (middleware.route.methods[method.toLowerCase()]) {
            matched = true;
          }
        }
      });
      
      resolve({ matched, method, path });
    });
  };

  for (const route of routes) {
    const result = await testRequest(route.method, route.path);
    const status = result.matched ? '✅ MATCHES' : '❌ NOT FOUND';
    console.log(`${status.padEnd(15)} ${route.method.padEnd(6)} ${route.path.padEnd(25)} ${route.description}`);
  }

  console.log('\n✨ Route test complete!');
  console.log('\n💡 If routes show ✅ MATCHES, they should work on Vercel.');
  console.log('💡 If routes show ❌ NOT FOUND, check route mounting in server/index.js\n');
};

testRoutes().catch(console.error);

