import axios, { AxiosInstance } from 'axios';
import {
  UploadResponse,
  ExtractionResponse,
  CleanedData,
} from '../types/index.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function extractData(
  uploadId: string
): Promise<ExtractionResponse> {
  const response = await apiClient.post<ExtractionResponse>('/extract', {
    uploadId,
  });

  return response.data;
}

export async function exportToExcel(
  uploadId: string,
  data: CleanedData
): Promise<Blob> {
  const response = await apiClient.post('/export', {
    uploadId,
    data,
  });

  return new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export async function checkHealth(): Promise<{
  status: string;
  services: Record<string, string>;
}> {
  const response = await apiClient.get('/health');
  return response.data;
}
