import { ConversionHistory } from '../types/index.js';

const STORAGE_KEY = 'easyToExcelHistory';

export function getConversionHistory(): ConversionHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToHistory(conversion: ConversionHistory): void {
  try {
    const history = getConversionHistory();
    history.unshift(conversion);
    // Keep only last 20 conversions
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
