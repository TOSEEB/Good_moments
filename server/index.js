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

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const CONNECTION_URL = 'mongodb://localhost:27017/memories'; // Local MongoDB
const PORT = process.env.PORT || 5000;

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