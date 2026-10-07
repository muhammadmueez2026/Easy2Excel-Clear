import Tesseract from 'tesseract.js';

export async function extractTextFromImage(filePath: string): Promise<string> {
  try {
    // Perform OCR on the image
    const result = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => {
        // Log progress silently or to debug
        if (m.status === 'recognizing') {
          console.log(`OCR progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const text = result.data.text;

    if (!text || !text.trim()) {
      throw new Error('No text detected in image');
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract image text: ${error.message}`);
    }
    throw error;
  }
}
