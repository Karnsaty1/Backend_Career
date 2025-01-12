const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');




// Middleware: Body parser and cookies
app.use(express.json());
app.use(cookieParser());


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
