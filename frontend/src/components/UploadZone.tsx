import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  isLoading,
  error,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    disabled: isLoading,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragActive
              ? 'border-brand-600 bg-brand-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-semibold text-gray-700 mb-2">
          {isDragActive
            ? 'Drop your file here'
            : 'Drag and drop your file, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supported: PDF, JPG, JPEG, PNG (max 10 MB)
        </p>
        <button
          className={`
            inline-block px-6 py-2 bg-brand-600 text-white rounded-lg
            font-medium hover:bg-brand-700 transition-colors
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={(e) => e.stopPropagation()}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Select File'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
