// Vercel Serverless Function - Express API Handler
// This file is automatically detected by Vercel and handles all API routes

import app from '../server/index.js';

// Vercel serverless function handler
// Vercel passes the request with the full path including /api prefix
export default async (req, res) => {
  // Log incoming request for debugging
  console.log(`🔵 Serverless Function: ${req.method} ${req.url || req.path}`);
  
  // Ensure the path is preserved correctly
  // Vercel should pass /api/user/google as req.url
  return app(req, res);
};

