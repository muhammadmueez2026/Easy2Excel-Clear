import { Request, Response, NextFunction } from 'express';
import { validateFileSize, validateFileType } from '../services/fileService.js';

export function validateUploadFile(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.file) {
    res.status(400).json({
      error: 'No file uploaded',
    });
    return;
  }

  // Validate file size
  if (!validateFileSize(req.file.size)) {
    res.status(413).json({
      error: 'File size exceeds maximum limit of 10 MB',
    });
    return;
  }

  // Validate file type
  if (!validateFileType(req.file.mimetype)) {
    res.status(415).json({
      error: 'Unsupported file type. Supported types: PDF, JPG, JPEG, PNG',
      supportedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    });
    return;
  }

  next();
}
