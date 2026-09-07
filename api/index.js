const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

// Ensure MongoDB Atlas connection is initialized for Vercel Serverless Function
connectDB();

module.exports = app;
