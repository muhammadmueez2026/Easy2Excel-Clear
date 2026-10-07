import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateExcelFile } from '../services/excelService.js';
import { getUploadDir, deleteUploadDirectory } from '../services/fileService.js';
import { CleanedData } from '../types/index.js';
import fs from 'fs';

const router = Router();

interface ExportRequest {
  uploadId: string;
  data: CleanedData;
}

router.post(
  '/export',
  asyncHandler(async (req: Request, res: Response) => {
    const { uploadId, data } = req.body as ExportRequest;

    if (!uploadId || !data) {
      res.status(400).json({
        error: 'Missing uploadId or data in request body',
      });
      return;
    }

    try {
      const uploadDir = getUploadDir(uploadId);

      // Generate Excel file
      const excelFilePath = generateExcelFile(data, uploadDir);

      // Read the file
      const fileBuffer = fs.readFileSync(excelFilePath);

      // Send the file to client
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="easy-to-excel-${Date.now()}.xlsx"`
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Length', fileBuffer.length);

      res.send(fileBuffer);

      // Schedule cleanup (don't await, do it in background)
      setTimeout(() => {
        try {
          deleteUploadDirectory(uploadId);
          console.log(`Cleaned up upload directory: ${uploadId}`);
        } catch (error) {
          console.error(`Failed to cleanup ${uploadId}:`, error);
        }
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Export error:', errorMessage);

      res.status(500).json({
        error: 'Export failed',
        message: errorMessage,
        uploadId,
      });
    }
  })
);

export default router;
