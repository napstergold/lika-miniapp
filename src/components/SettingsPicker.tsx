import { X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SettingsPickerProps {
  title: string;
  options: Option[];
  currentValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function SettingsPicker({ title, options, currentValue, onSelect, onClose }: SettingsPickerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} className="dark:text-white" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                currentValue === option.value
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-semibold dark:text-white">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {option.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
