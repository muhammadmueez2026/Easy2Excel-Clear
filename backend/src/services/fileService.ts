import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SupportedFileType } from '../types/index.js';

const UPLOADS_DIR = './uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function getUploadDir(uploadId: string): string {
  return path.join(UPLOADS_DIR, uploadId);
}

export function ensureUploadDir(uploadId: string): void {
  const dir = getUploadDir(uploadId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function saveUploadedFile(
  uploadId: string,
  buffer: Buffer,
  fileName: string
): string {
  ensureUploadDir(uploadId);
  const filePath = path.join(getUploadDir(uploadId), 'original');
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function getFileType(
  mimeType: string
): SupportedFileType | null {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/jpg') return 'jpg';
  return null;
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function validateFileType(mimeType: string): boolean {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  return allowedTypes.includes(mimeType);
}

export function deleteUploadDirectory(uploadId: string): void {
  const dir = getUploadDir(uploadId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function readFileAsBuffer(filePath: string): Buffer {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath);
}

export function saveJsonData(uploadId: string, data: unknown, fileName: string): string {
  ensureUploadDir(uploadId);
  const filePath = path.join(getUploadDir(uploadId), fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

export function loadJsonData(filePath: string): unknown {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function generateUploadId(): string {
  return uuidv4();
}

// Clean up old uploads (older than 24 hours)
export function cleanupOldUploads(maxAgeHours: number = 24): void {
  if (!fs.existsSync(UPLOADS_DIR)) return;

  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;

  const entries = fs.readdirSync(UPLOADS_DIR);
  for (const entry of entries) {
    const fullPath = path.join(UPLOADS_DIR, entry);
    const stat = fs.statSync(fullPath);

    if (now - stat.mtimeMs > maxAge) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Cleaned up old upload: ${entry}`);
      } catch (error) {
        console.error(`Failed to cleanup ${entry}:`, error);
      }
    }
  }
}
