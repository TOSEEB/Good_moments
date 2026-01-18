// Vercel Serverless Function - Express API Handler
// This file is automatically detected by Vercel and handles all API routes

import app from '../server/index.js';

// Vercel serverless function handler
// When Vercel rewrites /api/* to this function, Express receives the full path
// Our routes are registered at both /api/user and /user, so both should work
export default async (req, res) => {
  // Log incoming request for debugging
  console.log(`🔵 Serverless Function Entry: ${req.method}`);
  console.log(`   URL: ${req.url}`);
  console.log(`   Path: ${req.path}`);
  console.log(`   Original URL: ${req.originalUrl}`);
  
  // Pass request directly to Express app
  // Express will match routes at /api/user/* (registered first) or /user/*
  return app(req, res);
};

