export interface ColumnDefinition {
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean';
  sampleValues?: string[];
}

export interface CleanedData {
  columns: ColumnDefinition[];
  rows: Record<string, unknown>[];
  confidence: 'high' | 'medium' | 'low';
  notes: string[];
  rowCount: number;
}

export interface UploadResponse {
  uploadId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  message: string;
}

export interface ExtractionResponse {
  uploadId: string;
  data: CleanedData;
  message: string;
  extractedText?: string;
  error?: string;
  details?: string;
  suggestion?: string;
}

export interface ProcessingState {
  uploadId: string | null;
  fileName: string | null;
  step: 'idle' | 'uploading' | 'extracting' | 'completed' | 'error';
  data: CleanedData | null;
  error: string | null;
  progress: number;
}

export interface ConversionHistory {
  uploadId: string;
  fileName: string;
  date: string;
  rowCount: number;
  confidence: string;
}
