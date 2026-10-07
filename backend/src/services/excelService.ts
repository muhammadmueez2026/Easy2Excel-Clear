import XLSX from 'xlsx';
import path from 'path';
import { CleanedData } from '../types/index.js';

export function generateExcelFile(
  data: CleanedData,
  uploadDir: string
): string {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert rows to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data.rows, {
      header: data.columns.map((col) => col.name),
    });

    // Auto-adjust column widths based on content
    const colWidths: XLSX.ColInfo[] = data.columns.map((col) => {
      const maxLength = Math.max(
        col.name.length,
        ...data.rows.map((row) => {
          const value = row[col.name];
          return String(value || '').length;
        })
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });

    worksheet['!cols'] = colWidths;

    // Add formatting for headers
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '366092' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    // Apply header styling
    for (let i = 0; i < data.columns.length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = headerStyle;
      }
    }

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Converted Data'
    );

    // If there are warnings or notes, add them to a separate sheet
    if (data.notes && data.notes.length > 0) {
      const notesSheet = XLSX.utils.json_to_sheet([
        { Notes: `Extraction completed with confidence: ${data.confidence}` },
        { Notes: '' },
        ...data.notes.map((note) => ({ Notes: note })),
      ]);
      XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes');
    }

    // Save the file
    const fileName = `conversion_${Date.now()}.xlsx`;
    const filePath = path.join(uploadDir, fileName);

    XLSX.writeFile(workbook, filePath);

    return filePath;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate Excel file: ${error.message}`);
    }
    throw error;
  }
}
