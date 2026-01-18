import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';

const app = express(); 

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// CORS configuration - allow all origins for Vercel deployments
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow all Vercel deployments
    if (origin.includes('.vercel.app')) return callback(null, true);
    
    // Allow custom domain (good-moments.vercel.app)
    if (origin.includes('good-moments')) return callback(null, true);
    
    callback(null, true); // Allow all origins
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Good Moments API is running!',
    version: '1.0.0',
    endpoints: {
      posts: '/posts',
      user: '/user'
    },
    status: 'active'
  });
});

// Test route to verify routing works
app.all('/api/test', (req, res) => {
  res.json({
    method: req.method,
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl,
    message: 'Test route working!'
  });
});

const CONNECTION_URL = process.env.MONGODB_URL;

// Serverless-friendly MongoDB connection (singleton pattern)
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!CONNECTION_URL) {
    console.error('❌ ERROR: MONGODB_URL is not defined in environment variables.');
    throw new Error('MONGODB_URL is required');
  }

  try {
    const connection = await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedConnection = connection;
    console.log('✅ Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('⚠️ MongoDB connection failed:', error.message);
    throw error;
  }
};

// Request logging middleware FIRST (before OPTIONS to see all requests)
app.use((req, res, next) => {
  // Log all request details for debugging
  console.log(`📥 [${new Date().toISOString()}] ${req.method}`);
  console.log(`   Path: ${req.path}`);
  console.log(`   URL: ${req.url}`);
  console.log(`   Original: ${req.originalUrl}`);
  console.log(`   Base URL: ${req.baseUrl || 'none'}`);
  next();
});

// Handle OPTIONS preflight requests explicitly (but let routes handle actual requests)
app.options('*', (req, res) => {
  console.log(`🔵 OPTIONS request: ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// Routes MUST be mounted in order - ALL paths registered for maximum compatibility
// IMPORTANT: Register /api/* routes FIRST for Vercel serverless functions
console.log('🔧 Registering routes...');
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
// Then register non-prefixed routes (for local dev and compatibility)
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
console.log('✅ Routes registered at: /api/posts, /api/user, /posts, /user');

// For Vercel serverless functions - connect on first request
app.use(async (req, res, next) => {
  try {
    if (!cachedConnection) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    // Continue without DB (for development/testing)
    next();
  }
});

// 404 handler - catch unmatched routes (MUST be last)
app.use('*', (req, res) => {
  console.error(`❌ 404 - Route not found: ${req.method} ${req.originalUrl || req.url}`);
  console.error(`   Path: ${req.path}, URL: ${req.url}, Original: ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found', 
    path: req.path, 
    url: req.url,
    originalUrl: req.originalUrl,
    method: req.method,
    availableRoutes: ['/api/user/signup', '/api/user/signin', '/api/user/google', '/api/posts']
  });
});

// Export app for Vercel serverless functions
export default app;

// For local development - start server when run directly (not via Vercel)
// Vercel doesn't have VERCEL env var set during build, so we check if PORT is explicitly set for local dev
const PORT = process.env.PORT || 5000;

// Only start server if not running as serverless function
// Vercel serverless functions don't need app.listen()
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server Running on Port: ${PORT}`);
      });
    })
    .catch((error) => {
      console.log('⚠️ MongoDB connection failed, starting server without database');
      console.log('Error:', error.message);
      app.listen(PORT, () => {
        console.log(`🚀 Server Running on Port: ${PORT} (No DB)`);
      });
    });
}