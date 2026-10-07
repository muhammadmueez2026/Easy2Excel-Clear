import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (req: Request, res: Response) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        claude_api: process.env.CLAUDE_API_KEY ? 'configured' : 'not_configured',
        file_storage: 'ready',
      },
      uptime: process.uptime(),
    };

    res.status(200).json(health);
  })
);

export default router;
