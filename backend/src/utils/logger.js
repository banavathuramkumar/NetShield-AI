// backend/src/utils/logger.js
const winston = require('winston');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    )
  })
];

// Only add File transports if NOT in serverless/Vercel environment
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  try {
    transports.push(
      new winston.transports.File({
        filename: path.join(LOG_DIR, 'error.log'),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(LOG_DIR, 'combined.log')
      })
    );
  } catch (e) {
    // Ignore file transport errors in read-only environments
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'netshield-backend' },
  transports
});

module.exports = logger;
