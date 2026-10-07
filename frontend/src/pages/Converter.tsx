import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import UploadZone from '../components/UploadZone.js';
import DataPreview from '../components/DataPreview.js';
import ExcelDownload from '../components/ExcelDownload.js';
import { CleanedData, ProcessingState } from '../types/index.js';
import { uploadFile, extractData } from '../services/api.js';
import { addToHistory } from '../services/storage.js';
import { ArrowLeft } from 'lucide-react';

interface ConverterProps {
  onBack?: () => void;
}

const Converter: React.FC<ConverterProps> = ({ onBack }) => {
  const [state, setState] = useState<ProcessingState>({
    uploadId: null,
    fileName: null,
    step: 'idle',
    data: null,
    error: null,
    progress: 0,
  });

  const handleFileSelect = async (file: File) => {
    setState((prev) => ({
      ...prev,
      step: 'uploading',
      error: null,
      progress: 0,
    }));

    try {
      // Upload file
      const uploadResponse = await uploadFile(file);
      setState((prev) => ({
        ...prev,
        uploadId: uploadResponse.uploadId,
        fileName: uploadResponse.fileName,
        progress: 30,
      }));

      // Extract data
      setState((prev) => ({
        ...prev,
        step: 'extracting',
        progress: 60,
      }));

      const extractResponse = await extractData(uploadResponse.uploadId);

      const cleanedData = extractResponse.data;

      // Add to history
      addToHistory({
        uploadId: uploadResponse.uploadId,
        fileName: uploadResponse.fileName,
        date: new Date().toISOString(),
        rowCount: cleanedData.rowCount,
        confidence: cleanedData.confidence,
      });

      setState((prev) => ({
        ...prev,
        step: 'completed',
        data: cleanedData,
        progress: 100,
      }));

      toast.success('Document processed successfully!');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      setState((prev) => ({
        ...prev,
        step: 'error',
        error: errorMessage,
        progress: 0,
      }));
      toast.error(errorMessage);
      console.error('Processing error:', error);
    }
  };

  const handleStartOver = () => {
    setState({
      uploadId: null,
      fileName: null,
      step: 'idle',
      data: null,
      error: null,
      progress: 0,
    });
  };

  const handleDataChange = (newData: CleanedData) => {
    setState((prev) => ({
      ...prev,
      data: newData,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Document Converter</h1>
          <p className="text-gray-600 mt-2">
            Upload, convert, and download your data as Excel
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {state.step === 'idle' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <UploadZone
              onFileSelect={handleFileSelect}
              isLoading={false}
              error={state.error || undefined}
            />
          </div>
        )}

        {state.step === 'uploading' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Uploading file...
              </p>
              <p className="text-gray-600">
                {state.fileName}
              </p>
              <div className="mt-6 bg-gray-100 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                <div
                  className="bg-brand-600 h-full transition-all duration-500"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {state.step === 'extracting' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Extracting and cleaning data...
              </p>
              <p className="text-gray-600 mb-4">
                Our AI is analyzing your document and structuring the data.
              </p>
              <div className="mt-6 bg-gray-100 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                <div
                  className="bg-brand-600 h-full transition-all duration-500"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {state.step === 'completed' && state.data && (
          <div className="space-y-8">
            {/* Success message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800">
                ✓ Document successfully processed and data extracted!
              </p>
            </div>

            {/* Data preview */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <DataPreview data={state.data} onDataChange={handleDataChange} />
            </div>

            {/* Export section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to Export?
              </h2>
              {state.uploadId && (
                <ExcelDownload
                  uploadId={state.uploadId}
                  data={state.data}
                  fileName={state.fileName?.replace(/\.[^/.]+$/, '') || 'export'}
                />
              )}
            </div>

            {/* Start over */}
            <div className="text-center">
              <button
                onClick={handleStartOver}
                className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Convert Another File
              </button>
            </div>
          </div>
        )}

        {state.step === 'error' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">
                Processing Failed
              </h3>
              <p className="text-red-800 mb-4">{state.error}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleStartOver}
                className="w-full px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="w-full px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Back to Home
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <p className="font-semibold mb-2">Tips for better results:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure the document is clear and readable</li>
                <li>PDF files typically work best for tables</li>
                <li>Scanned documents may need better lighting in photos</li>
                <li>Try a different file or format if this one fails</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Converter;
