import { useState } from 'react';
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
  const uploadResponse = await uploadFile(file);

  setState((prev) => ({
    ...prev,
    uploadId: uploadResponse.uploadId,
    fileName: uploadResponse.fileName,
    progress: 30,
  }));

  setState((prev) => ({
    ...prev,
    step: 'extracting',
    progress: 60,
  }));

  const extractResponse = await extractData(uploadResponse.uploadId);
  const cleanedData = extractResponse.data;

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
<div className="sticky top-16 z-40 border-b border-gray-200 bg-white py-6">
<div className="mx-auto max-w-4xl px-4">
<button
onClick={onBack}
className="mb-4 flex items-center gap-2 text-brand-600 hover:text-brand-700"
>
<ArrowLeft className="h-5 w-5" />
Back to Home
</button>

      <h1 className="text-3xl font-bold text-gray-900">
        Document Converter
      </h1>

      <p className="mt-2 text-gray-600">
        Upload, convert, and download your data as Excel
      </p>
    </div>
  </div>

  <div className="mx-auto max-w-4xl px-4 py-12">
    {state.step === 'idle' && (
      <div className="rounded-lg bg-white p-8 shadow-md">
        <UploadZone
          onFileSelect={handleFileSelect}
          isLoading={false}
          error={state.error || undefined}
        />
      </div>
    )}

    {state.step === 'uploading' && (
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />

          <p className="mb-2 text-lg font-semibold text-gray-900">
            Uploading file...
          </p>

          <p className="text-gray-600">{state.fileName}</p>

          <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-brand-600 transition-all duration-500"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      </div>
    )}

    {state.step === 'extracting' && (
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />

          <p className="mb-2 text-lg font-semibold text-gray-900">
            Extracting and cleaning data...
          </p>

          <p className="mb-4 text-gray-600">
            Our AI is analyzing your document and structuring the data.
          </p>

          <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-brand-600 transition-all duration-500"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>
      </div>
    )}

    {state.step === 'completed' && state.data && (
      <div className="space-y-8">
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <p className="text-green-800">
            ✓ Document successfully processed and data extracted!
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <DataPreview
            data={state.data}
            onDataChange={handleDataChange}
          />
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Ready to Export?
          </h2>

          <ExcelDownload
            data={state.data}
            filename={`${
              state.fileName?.replace(/\.[^/.]+$/, '') || 'export'
            }.xlsx`}
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleStartOver}
            className="rounded-lg bg-gray-200 px-6 py-2 text-gray-900 transition-colors hover:bg-gray-300"
          >
            Convert Another File
          </button>
        </div>
      </div>
    )}

    {state.step === 'error' && (
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="mb-2 font-semibold text-red-900">
            Processing Failed
          </h3>

          <p className="mb-4 text-red-800">{state.error}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleStartOver}
            className="w-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Try Again
          </button>

          <button
            onClick={onBack}
            className="w-full rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-300"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="mb-2 font-semibold">Tips for better results:</p>

          <ul className="list-inside list-disc space-y-1">
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
