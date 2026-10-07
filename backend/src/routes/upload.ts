import { Router, Request, Response } from 'express';
import multer from 'multer';
import { validateUploadFile } from '../middleware/fileValidator.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  generateUploadId,
  saveUploadedFile,
  getFileType,
} from '../services/fileService.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

interface UploadedFileRequest extends Request {
  file?: Express.Multer.File;
}

router.post(
  '/upload',
  upload.single('file'),
  validateUploadFile,
  asyncHandler(async (req: UploadedFileRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const uploadId = generateUploadId();
    const fileType = getFileType(req.file.mimetype);

    if (!fileType) {
      res.status(415).json({
        error: 'Unsupported file type',
      });
      return;
    }

    // Save the file
    const filePath = saveUploadedFile(
      uploadId,
      req.file.buffer,
      req.file.originalname
    );

    res.status(200).json({
      uploadId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType,
      mimeType: req.file.mimetype,
      message: 'File uploaded successfully. Ready for extraction.',
    });
  })
);

export default router;
