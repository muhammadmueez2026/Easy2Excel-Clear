import axios, { AxiosInstance } from 'axios';
import {
  UploadResponse,
  ExtractionResponse,
  CleanedData
} from '../types/index.js';

const API_URL = '';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const uploadFile = async (
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadResponse>(
    '/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

export const extractData = async (
  fileId: string
): Promise<ExtractionResponse> => {
  const response = await apiClient.post<ExtractionResponse>(
    '/extract',
    {
      fileId
    }
  );

  return response.data;
};

export const exportToExcel = async (
  data: CleanedData
): Promise<Blob> => {
  const response = await apiClient.post(
    '/export',
    data,
    {
      responseType: 'blob'
    }
  );

  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
