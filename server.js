require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
connectDB();

// 1. Seal and harden dynamic response headers using Helmet
app.use(helmet());

// 2. Configure CORS whitelist to accept requests from localhost & Netlify frontend domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL // e.g. https://your-app.netlify.app
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or if origin is whitelisted
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || /\.netlify\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Origin not allowed by whitelist'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// 3. Map REST routing controllers API pipelines
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

// 4. Connect to Local/Cloud MongoDB Database server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log("Server running on port 5000")
})