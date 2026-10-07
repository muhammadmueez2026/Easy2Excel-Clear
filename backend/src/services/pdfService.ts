import * as pdfjsLib from 'pdfjs-dist';

// Set up the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const pdf = await pdfjsLib.getDocument(filePath).promise;
    let fullText = '';

    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Extract text from items
        const pageText = textContent.items
          .map((item: any) => {
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');

        fullText += `\n--- Page ${i} ---\n${pageText}`;
      } catch (pageError) {
        console.warn(`Warning: Failed to extract text from page ${i}`, pageError);
        // Continue processing other pages
      }
    }

    if (!fullText.trim()) {
      throw new Error('No text could be extracted from PDF');
    }

    return fullText;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract PDF text: ${error.message}`);
    }
    throw error;
  }
}
