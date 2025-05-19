import React from 'react';
import { RefreshCw } from 'lucide-react';
import { CaptchaImage } from '../types';

interface CaptchaDisplayProps {
  captchaImage: CaptchaImage | null;
  onRefreshCaptcha: () => void;
}

const CaptchaDisplay: React.FC<CaptchaDisplayProps> = ({ 
  captchaImage, 
  onRefreshCaptcha 
}) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-md p-4 w-full max-w-xs">
        <div className="absolute right-2 top-2">
          <button 
            onClick={onRefreshCaptcha}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
            aria-label="Refresh CAPTCHA"
            title="Refresh CAPTCHA"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">CAPTCHA Verification</h3>
        
        {captchaImage ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="relative overflow-hidden rounded-md border border-gray-300">
              <img 
                src={captchaImage.imageUrl} 
                alt="CAPTCHA" 
                className="w-full h-20 object-contain"
                style={{ 
                  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 8px 8px'
                }}
              />
            </div>
            <p className="text-xs text-gray-500">Image ID: {captchaImage.id}</p>
          </div>
        ) : (
          <div className="flex justify-center items-center h-20 bg-gray-100 rounded-md">
            <p className="text-gray-400">No CAPTCHA available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptchaDisplay;