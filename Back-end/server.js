const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');  // Import post routes
const userRoutes = require('./routes/userRoutes');  // Import user routes

console.log("Testing");

dotenv.config();  // Load environment variables from .env

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);   // Authentication routes
app.use('/api/posts', postRoutes);  // Post-related routes
app.use('/api/users', userRoutes);  // User-related routes (for fetching user profile, etc.)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
