const app = require('../backend/src/app');
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/netshield_ai', {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
  } catch (err) {
    console.error('Vercel Serverless MongoDB Error:', err.message);
  }
};

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
