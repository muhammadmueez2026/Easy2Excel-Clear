import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import extractRoutes from './routes/extract.js';
import exportRoutes from './routes/export.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middleware/errorHandler.js';
import { cleanupOldUploads } from './services/fileService.js';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, express, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', healthRoutes);
app.use('/api', uploadRoutes);
app.use('/api', extractRoutes);
app.use('/api', exportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Easy to Excel Clear API',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      upload: 'POST /api/upload',
      extract: 'POST /api/extract',
      export: 'POST /api/export',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Cleanup old uploads on startup and periodically
cleanupOldUploads(24);
setInterval(() => {
  cleanupOldUploads(24);
}, 6 * 60 * 60 * 1000); // Every 6 hours

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Easy to Excel Clear - Backend        ║
║          API Running                   ║
╠════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(28)}║
║ Port: ${String(PORT).padEnd(36)}║
║ URL: http://localhost:${String(PORT).padEnd(22)}║
║                                        ║
║ Health: http://localhost:${String(PORT).padEnd(18)}/api/health  ║
╚════════════════════════════════════════╝
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
