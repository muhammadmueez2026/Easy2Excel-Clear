import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (page: 'home' | 'converter' | 'history') => void;
  currentPage?: 'home' | 'converter' | 'history';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage = 'home' }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                Easy to Excel
              </h1>
              <p className="text-xs text-gray-500">Clear</p>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="hidden sm:flex gap-8">
            <button
              onClick={() => onNavigate?.('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-brand-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate?.('converter')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'converter'
                  ? 'text-brand-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Converter
            </button>
            <button
              onClick={() => onNavigate?.('history')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'history'
                  ? 'text-brand-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              History
            </button>
          </div>

          {/* Mobile menu indicator */}
          <div className="sm:hidden text-gray-600">
            <button className="p-2">☰</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
