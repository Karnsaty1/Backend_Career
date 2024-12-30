const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Middleware: Helmet CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://vercel.live',
          'https://vercel.live/_next-live/feedback/feedback.js',
        ],
        scriptSrcElem: [
          "'self'",
          'https://vercel.live',
          'https://vercel.live/_next-live/feedback/feedback.js',
        ],
        connectSrc: ["'self'", 'https://vercel.live'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
  })
);

// Middleware: CORS configuration to allow all origins
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight requests

// Middleware: Body parser and cookies
app.use(express.json());
app.use(cookieParser());

// Database connection
const { connectDB } = require('./db');
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

// Routes
app.use('/user/auth', require('./Routes/Auth'));
app.use('/user/data', require('./Routes/Data'));

// Root route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).send('Something went wrong!');
});

// Export app for Vercel
module.exports = app;
