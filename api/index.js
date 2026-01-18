// Vercel Serverless Function - Express API Handler
// This file is automatically detected by Vercel and handles all API routes

import app from '../server/index.js';

// Vercel expects a default export for serverless functions
// When Vercel rewrites /api/* to this function, the path is preserved
export default app;

