import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  options
}) => {
  const { theme } = useTheme();

  const baseClasses = `w-full rounded-md ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

  if (type === 'select' && options) {
    return (
      <div className="mb-4">
        <label className={`block text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        } mb-1`}>
          {label}{required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClasses} h-10 px-3`}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      } mb-1`}>
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClasses} h-10 px-3`}
        required={required}
      />
    </div>
  );
};