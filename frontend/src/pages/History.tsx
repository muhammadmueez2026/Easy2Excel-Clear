import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { ConversionHistory } from '../types/index.js';
import { getConversionHistory, clearHistory } from '../services/storage.js';
import { formatDistanceToNow } from 'date-fns';

interface HistoryProps {
  onBack?: () => void;
}

const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<ConversionHistory[]>([]);

  useEffect(() => {
    setHistory(getConversionHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all conversion history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const confidenceColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Conversion History
              </h1>
              <p className="text-gray-600 mt-2">
                Your recent document conversions
              </p>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4 text-5xl">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No conversions yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't converted any documents yet. Start by uploading a file
              to begin.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Go to Converter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.uploadId}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.fileName}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        {formatDistanceToNow(new Date(item.date), {
                          addSuffix: true,
                        })}
                      </span>
                      <span>•</span>
                      <span>{item.rowCount} rows</span>
                      <span>•</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          confidenceColors[
                            item.confidence as keyof typeof confidenceColors
                          ] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.confidence} confidence
                      </span>
                    </div>
                  </div>
                  <button className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
