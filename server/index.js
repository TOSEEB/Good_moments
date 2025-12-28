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
app.use(cors());

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

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const CONNECTION_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

if (!CONNECTION_URL) {
  console.error('❌ ERROR: MONGODB_URL is not defined in environment variables.');
  console.error('Please create a .env file in the server directory with MONGODB_URL');
  process.exit(1);
}

// Try to connect to MongoDB, but start server even if it fails
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server Running on Port: ${PORT}`));
  })
  .catch((error) => {
    console.log('⚠️ MongoDB connection failed, starting server without database');
    console.log('Error:', error.message);
    app.listen(PORT, () => console.log(`🚀 Server Running on Port: ${PORT} (No DB)`));
  });