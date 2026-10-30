require('dotenv').config(); // Must be at the very top of the file

const mongoose = require('mongoose');

// Example connection function
const connectDB = async () => {
  try {
    // Double check that the variable name matches your .env file exactly
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB