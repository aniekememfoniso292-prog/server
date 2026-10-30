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
// 2. Configure CORS whitelist to accept requests from localhost, Netlify & Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://frontend-chi-ten-75.vercel.app', // 🔴 FIXED: Removed trailing slash '/'
  process.env.CLIENT_URL 
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin || 
      allowedOrigins.indexOf(origin) !== -1 || 
      /\.netlify\.app$/.test(origin) ||
      /\.vercel\.app$/.test(origin) // 🔴 ADDED: Support for all Vercel domains and deployment branches
    ) {
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
app.use('/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

// 4. Connect to Local/Cloud MongoDB Database server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log("Server running on port 5000")
})