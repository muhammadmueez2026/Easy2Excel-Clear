import React, { useState } from 'react';
import { CleanedData, ColumnDefinition } from '../types/index.js';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

interface DataPreviewProps {
  data: CleanedData;
  onDataChange: (data: CleanedData) => void;
  isEditing?: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({
  data,
  onDataChange,
  isEditing = true,
}) => {
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: string;
  } | null>(null);

  const handleCellChange = (
    rowIndex: number,
    colName: string,
    value: unknown
  ) => {
    const newRows = [...data.rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [colName]: value,
    };
    onDataChange({
      ...data,
      rows: newRows,
      rowCount: newRows.length,
    });
    setEditingCell(null);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newRows = data.rows.filter((_, i) => i !== rowIndex);
    onDataChange({
      ...data,
      rows: newRows,
      rowCount: newRows.length,
    });
  };

  const handleAddRow = () => {
    const newRow: Record<string, unknown> = {};
    data.columns.forEach((col) => {
      newRow[col.name] = null;
    });
    onDataChange({
      ...data,
      rows: [...data.rows, newRow],
      rowCount: data.rows.length + 1,
    });
  };

  const handleRenameColumn = (oldName: string, newName: string) => {
    if (!newName.trim()) return;

    const newColumns = data.columns.map((col) =>
      col.name === oldName ? { ...col, name: newName } : col
    );

    const newRows = data.rows.map((row) => {
      const newRow = { ...row };
      if (oldName in newRow) {
        newRow[newName] = newRow[oldName];
        delete newRow[oldName];
      }
      return newRow;
    });

    onDataChange({
      ...data,
      columns: newColumns,
      rows: newRows,
    });
  };

  const confidenceColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800',
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Data Preview</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${confidenceColors[data.confidence]}`}
          >
            Confidence: {data.confidence}
          </span>
        </div>

        {/* Warnings */}
        {data.notes.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Extraction Notes:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  {data.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600 mt-3">
          {data.rowCount} rows × {data.columns.length} columns
        </p>
      </div>

      {/* Table */}
      {data.rows.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No data to display</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-12">
                  #
                </th>
                {data.columns.map((col) => (
                  <th
                    key={col.name}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[150px]"
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) =>
                          handleRenameColumn(col.name, e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span>{col.name}</span>
                    )}
                    <span className="text-xs text-gray-500 ml-1">
                      ({col.type})
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-center w-12">
                  <span className="text-sm font-semibold text-gray-900">
                    Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium">
                    {rowIdx + 1}
                  </td>
                  {data.columns.map((col) => (
                    <td
                      key={`${rowIdx}-${col.name}`}
                      className="px-4 py-3 text-sm text-gray-900"
                    >
                      {isEditing && editingCell?.row === rowIdx && editingCell?.col === col.name ? (
                        <input
                          type="text"
                          value={String(row[col.name] ?? '')}
                          onChange={(e) =>
                            handleCellChange(rowIdx, col.name, e.target.value)
                          }
                          onBlur={() => setEditingCell(null)}
                          autoFocus
                          className="w-full px-2 py-1 border border-brand-600 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div
                          onClick={() =>
                            isEditing && setEditingCell({ row: rowIdx, col: col.name })
                          }
                          className={`px-2 py-1 rounded ${
                            row[col.name] === null
                              ? 'bg-gray-100 text-gray-500 italic'
                              : ''
                          } ${isEditing ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                        >
                          {row[col.name] === null
                            ? '(empty)'
                            : String(row[col.name])}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteRow(rowIdx)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add row button */}
      {isEditing && (
        <button
          onClick={handleAddRow}
          className="mt-4 px-4 py-2 bg-brand-100 text-brand-700 rounded-lg hover:bg-brand-200 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Row
        </button>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{data.rowCount}</strong> rows ready for export
        </p>
      </div>
    </div>
  );
};

export default DataPreview;
