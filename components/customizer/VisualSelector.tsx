import React from 'react';

interface Option {
  value: string;
  label: string;
  imageUrl: string;
}

interface VisualSelectorProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

const VisualSelector: React.FC<VisualSelectorProps> = ({ label, options, selectedValue, onSelect, disabled = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed group ${
              selectedValue === option.value ? 'border-white scale-105' : 'border-white/20 hover:border-white/60'
            }`}
            aria-pressed={selectedValue === option.value}
          >
            <img
              src={option.imageUrl}
              alt={option.label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute bottom-1.5 left-1.5 right-1.5 text-xs font-semibold text-white truncate text-center">
              {option.label}
            </span>
            {selectedValue === option.value && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VisualSelector;
