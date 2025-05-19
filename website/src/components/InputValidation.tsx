import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { CaptchaImage } from '../types';

interface InputValidationProps {
  captchaImage: CaptchaImage | null;
  onSuccess: () => void;
}

const InputValidation: React.FC<InputValidationProps> = ({ captchaImage, onSuccess }) => {
  const [inputValue, setInputValue] = useState('');
  const [validationState, setValidationState] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (validationState !== 'idle') {
      setValidationState('idle');
    }
  };

  const handleValidate = () => {
    if (!captchaImage) return;
    
    const isCorrect = inputValue.trim() === captchaImage.text;
    
    setValidationState(isCorrect ? 'success' : 'error');
    
    if (isCorrect) {
      onSuccess();
      setInputValue('');
      
      // Reset validation state after 2 seconds
      setTimeout(() => {
        setValidationState('idle');
      }, 2000);
    }
  };

  return (
    <div className="mt-4 w-full max-w-xs">
      <div className="flex flex-col space-y-3">
        <label htmlFor="captcha-input" className="block text-sm font-medium text-gray-700">
          Enter the text from the image
        </label>
        
        <div className="relative">
          <input
            id="captcha-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={!captchaImage}
            placeholder="Type the text shown above"
            className={`w-full px-3 py-2 border ${
              validationState === 'success' ? 'border-green-500' : 
              validationState === 'error' ? 'border-red-500' : 
              'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 
            focus:outline-none focus:ring-2 ${
              validationState === 'success' ? 'focus:ring-green-500' : 
              validationState === 'error' ? 'focus:ring-red-500' : 
              'focus:ring-blue-500'
            } focus:border-transparent
            transition-colors duration-200`}
          />
          
          {validationState === 'success' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
              <Check size={16} />
            </div>
          )}
          
          {validationState === 'error' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
              <X size={16} />
            </div>
          )}
        </div>
        
        <button
          onClick={handleValidate}
          disabled={!captchaImage || !inputValue.trim()}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm shadow-sm 
          ${(!captchaImage || !inputValue.trim()) ? 
            'bg-gray-300 cursor-not-allowed text-gray-500' : 
            'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors duration-200`}
        >
          Validate
        </button>
        
        {validationState === 'success' && (
          <p className="text-sm text-green-600 animate-pulse">Correct! Verification successful.</p>
        )}
        
        {validationState === 'error' && (
          <p className="text-sm text-red-600">Incorrect. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default InputValidation;