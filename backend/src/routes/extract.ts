import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { extractTextFromImage } from '../services/ocrService.js';
import { extractDataWithAI } from '../services/extractionService.js';
import {
  getUploadDir,
  readFileAsBuffer,
  saveJsonData,
  getFileType,
} from '../services/fileService.js';

const router = Router();

interface ExtractRequest {
  uploadId: string;
}

router.post(
  '/extract',
  asyncHandler(async (req: Request, res: Response) => {
    const { uploadId } = req.body as ExtractRequest;

    if (!uploadId) {
      res.status(400).json({
        error: 'Missing uploadId in request body',
      });
      return;
    }

    try {
      const uploadDir = getUploadDir(uploadId);
      const originalFilePath = `${uploadDir}/original`;

      // Read the uploaded file
      const fileBuffer = readFileAsBuffer(originalFilePath);

      // Determine file type from buffer or fallback to mime type
      // For now, we'll try PDF first, then image
      let extractedText: string;

      try {
        // Try PDF extraction
        extractedText = await extractTextFromPDF(originalFilePath);
      } catch {
        try {
          // Fallback to OCR
          extractedText = await extractTextFromImage(originalFilePath);
        } catch (ocrError) {
          throw new Error(
            `Failed to extract text from file: ${ocrError instanceof Error ? ocrError.message : 'Unknown error'}`
          );
        }
      }

      // Save extracted text
      saveJsonData(uploadId, { text: extractedText }, 'extracted.json');

      // Send extracted text to Claude for cleaning and structuring
      if (!process.env.CLAUDE_API_KEY) {
        res.status(503).json({
          error: 'AI extraction service is not configured',
          details:
            'CLAUDE_API_KEY environment variable is not set. Please configure your API key.',
          extractedText,
          message:
            'Document text was extracted but AI cleaning is unavailable. You can manually organize this data.',
        });
        return;
      }

      const cleanedData = await extractDataWithAI(extractedText);

      // Save cleaned data
      saveJsonData(uploadId, cleanedData, 'cleaned.json');

      res.status(200).json({
        uploadId,
        data: cleanedData,
        message: 'Document extracted and data structured successfully',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Extraction error:', errorMessage);

      res.status(500).json({
        error: 'Extraction failed',
        message: errorMessage,
        uploadId,
        suggestion:
          'This may indicate the document format is not recognized or the file is corrupted. Please try with a different document.',
      });
    }
  })
);

export default router;
