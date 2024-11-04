import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Submit'
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div
          className={`inline-block align-bottom ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
        >
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className={`rounded-md ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>{children}</div>
          </div>
          {onSubmit && (
            <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Button onClick={onSubmit} className="w-full sm:w-auto sm:ml-3">
                {submitText}
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                className="mt-3 w-full sm:w-auto sm:mt-0"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};