export interface ConversionResult {
  id: string;
  fileName: string;
  originalPath: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
  extractedData?: ExtractedData;
  cleanedData?: CleanedData;
  createdAt: string;
}

export interface ExtractedData {
  rawText: string;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
}

export interface CleanedData {
  columns: ColumnDefinition[];
  rows: Record<string, unknown>[];
  confidence: 'high' | 'medium' | 'low';
  notes: string[];
  rowCount: number;
}

export interface ColumnDefinition {
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean';
  sampleValues?: string[];
}

export interface AIExtractionResponse {
  columns: ColumnDefinition[];
  rows: Record<string, unknown>[];
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
}

export interface UploadRequest {
  uploadId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface ExportRequest {
  uploadId: string;
  data: CleanedData;
}

export type SupportedFileType = 'pdf' | 'jpg' | 'jpeg' | 'png' | 'image';
