import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import hpp from 'hpp';
import xss from 'xss-clean';

import connectDB from './config/db.js';
import { initSockets } from './sockets/socketManager.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import authRoutes from './features/auth/auth.routes.js';
import trustedRoutes from './features/trustedCircle/trustedCircle.routes.js';
import sosRoutes from './features/sos/sos.routes.js';



// Load configurations
dotenv.config();

// Connect Mongoose to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Bind Socket.io Server Manager
const io = initSockets(server);
app.set('io', io);

// Apply Security and Performance Enhancements
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(hpp());
app.use(xss());

// Logger Setup
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Config CORS Options
const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter to general api endpoints
app.use('/api', apiLimiter);

// Auth Feature Routes
app.use('/api/auth', authRoutes);

// Trusted Circle & SOS Feature Routes
app.use('/api/trusted', trustedRoutes);
app.use('/api/sos', sosRoutes);


// System Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    message: 'The Brotherhood Network core backend is fully operational.',
    timestamp: new Date()
  });
});

// Fallback Route Handler
app.use(notFound);

// Centralized Error Controller
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Server] Core running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export { app, server, io };
