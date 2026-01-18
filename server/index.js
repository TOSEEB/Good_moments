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

// Routes MUST be mounted before database middleware for proper path matching
// Mount routes at multiple paths to handle both local dev and Vercel rewrites
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

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