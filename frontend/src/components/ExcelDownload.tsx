import React, { useState } from 'react';
import { Download, Check, AlertCircle } from 'lucide-react';
import { CleanedData } from '../types/index.js';
import { exportToExcel } from '../services/api.js';

interface ExcelDownloadProps {
  uploadId: string;
  data: CleanedData;
  fileName?: string;
}

const ExcelDownload: React.FC<ExcelDownloadProps> = ({
  uploadId,
  data,
  fileName = 'export',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await exportToExcel(uploadId, data);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to download file';
      setError(errorMessage);
      console.error('Download error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`
          w-full px-6 py-3 rounded-lg font-semibold
          transition-all duration-200 flex items-center justify-center gap-2
          ${
            isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : success
                ? 'bg-green-600 text-white'
                : 'bg-brand-600 text-white hover:bg-brand-700'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            Generating Excel...
          </>
        ) : success ? (
          <>
            <Check className="h-5 w-5" />
            Downloaded Successfully!
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Download Excel File
          </>
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
        <p>
          <strong>{data.rowCount}</strong> rows and{' '}
          <strong>{data.columns.length}</strong> columns will be exported.
        </p>
      </div>
    </div>
  );
};

export default ExcelDownload;
