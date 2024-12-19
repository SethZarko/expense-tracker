import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import connectDb from './database/database.js'

// Route Imports
import userRoutes from './routes/userRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import authRoutes from './routes/authRoutes.js'

// Middleware Imports
import { globalErrorHandler } from './middleware/errorHandler.js';

// Initialize App
const app = express()

// Initialize Database Connection
connectDb()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Routes
app.use('/api/transactions', transactionRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Error Handling Global Middleware
app.use(globalErrorHandler);

// Run Server
const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => { console.log(`Server Running on PORT: ${PORT}...`);})

// Graceful Server Shutdown
const shutdown = async (signal) => {
    console.info(`\nReceived ${signal}. Server is shutting down...`);
    try {
        console.info('MongoDB disconnected.');
        server.close(() => {
            console.info('Server closed.');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error during disconnection:', err);
        process.exit(1);
    }
};

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle SIGTERM (e.g., from process manager)
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle SIGQUIT (e.g., force quit)
process.on('SIGQUIT', () => shutdown('SIGQUIT'));

// Catch uncaught exceptions to avoid abrupt crashes
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown('uncaughtException');
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
});