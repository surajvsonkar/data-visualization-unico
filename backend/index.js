import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dataRoutes from './routes/data.js';
import tagRoutes from './routes/tags.js';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://sparkling-kitten-1ba53f.netlify.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/data', dataRoutes);
app.use('/api/tags', tagRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));