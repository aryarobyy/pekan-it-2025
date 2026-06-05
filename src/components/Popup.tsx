import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type PopupProps = {
  /**
   * @default false
   */
  isOpen: boolean;
  onClose: () => void;
  /**
   * @default 'success'
   */
  variant: 'success' | 'error' | 'alert' | 'info';
  title: string;
  message: string;
  detailMessage?: string; 
  showIcon?: boolean;
}

const MyPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  variant,
  title,
  message,
  detailMessage,
  showIcon = true
}) => {
  const [showDetail, setShowDetail] = useState(false);
  
  if (!isOpen) return null;

  const variantStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      message: 'text-green-700',
      button: 'text-green-600 hover:text-green-800'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'text-red-600 hover:text-red-800'
    },
    alert: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      button: 'text-yellow-600 hover:text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      message: 'text-blue-700',
      button: 'text-blue-600 hover:text-blue-800'
    }
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    alert: AlertTriangle,
    info: Info
  };

  const currentStyle = variantStyles[variant];
  const IconComponent = icons[variant];

  return (
    <>
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`
          relative max-w-md w-full rounded-lg border-2 shadow-lg transform transition-all
          ${currentStyle.bg}
        `}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`
              absolute top-4 right-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors
              ${currentStyle.button}
            `}
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              {showIcon && (
                <div className={`flex-shrink-0 ${currentStyle.icon}`}>
                  <IconComponent size={24} />
                </div>
              )}
              
              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold mb-2 ${currentStyle.title}`}>
                  {title}
                </h3>
                <p className={`text-sm leading-relaxed ${currentStyle.message}`}>
                  {message}
                </p>
                
                {/* Info lebih lanjut untuk variant info dan alert */}
                {(variant === 'info' || variant === 'alert') && detailMessage && (
                  <div className="mt-3">
                    {!showDetail ? (
                      <button
                        onClick={() => setShowDetail(true)}
                        className={`text-sm underline hover:no-underline transition-all ${currentStyle.button}`}
                      >
                        Info lebih lanjut
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className={`text-sm leading-relaxed ${currentStyle.message}`}>
                          {detailMessage}
                        </p>
                        <button
                          onClick={() => setShowDetail(false)}
                          className={`text-sm underline hover:no-underline transition-all ${currentStyle.button}`}
                        >
                          Sembunyikan detail
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md border border-transparent 
                  hover:bg-white hover:bg-opacity-20 transition-colors
                  ${currentStyle.button}
                `}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPopup