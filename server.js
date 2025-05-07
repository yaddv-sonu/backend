import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB Connected successfully`);
    return true;
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    return false;
  }
};


// Start server function
const startServer = async () => {
  try {
    // Try to connect to database
    const isConnected = await connectDB();
    
    if (!isConnected) {
      console.error(' Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Start the server
    const PORT = process.env.PORT ;
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(` Server Error: ${error.message}`);
    process.exit(1);
  }
};

// Start the application
startServer();
