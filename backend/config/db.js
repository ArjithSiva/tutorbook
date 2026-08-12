const mongoose = require('mongoose');

// Connects to MongoDB using the URI from your .env file.
// If this fails, double check MONGO_URI is correct and your Atlas
// cluster's Network Access list allows your IP (or 0.0.0.0/0 for dev).
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
