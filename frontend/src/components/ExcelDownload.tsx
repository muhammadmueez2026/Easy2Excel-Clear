import React from 'react';
import { Download } from 'lucide-react';
import { exportToExcel } from '../services/api';
import { CleanedData } from '../types';

interface ExcelDownloadProps {
  data: CleanedData;
  filename?: string;
}

const ExcelDownload: React.FC<ExcelDownloadProps> = ({
  data,
  filename = 'easy2excel-result.xlsx'
}) => {
  const handleDownload = async () => {
    try {
      const blob = await exportToExcel(data);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel download failed:', error);
      alert('Failed to download Excel file. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
    >
      <Download size={18} />
      Download Excel
    </button>
  );
};

export default ExcelDownload;
