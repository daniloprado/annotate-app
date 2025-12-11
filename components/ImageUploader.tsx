
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (file: File) => void;
  onImageClear: () => void;
  previewUrl: string | null;
  accentColor: string;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  title, 
  onImageUpload, 
  onImageClear, 
  previewUrl, 
  accentColor,
  isLoading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    if (isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, [isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    if (isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, [isLoading]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    if (isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, isLoading]);

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-xl border border-slate-100 h-full flex flex-col transition-all duration-300 ${isLoading ? 'opacity-90' : 'opacity-100'}`}>
      <h2 className="text-xl font-bold text-slate-800 text-center mb-4 flex items-center justify-center gap-2">
        {title}
        {previewUrl && isLoading && (
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${title.includes('Design') ? 'bg-violet-400' : 'bg-cyan-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${title.includes('Design') ? 'bg-violet-500' : 'bg-cyan-500'}`}></span>
            </span>
        )}
      </h2>
      <div className="flex-grow relative">
        {previewUrl ? (
          <div className="relative group w-full h-full min-h-[300px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img src={previewUrl} alt={`${title} preview`} className="w-full h-full object-contain absolute inset-0" />
            
            {/* Scanning Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <div className={`w-full h-[2px] shadow-[0_0_20px_2px_rgba(0,0,0,0)] ${title.includes('Design') ? 'bg-violet-400 shadow-violet-500/50' : 'bg-cyan-400 shadow-cyan-500/50'} animate-scan absolute top-0 left-0`}></div>
                <div className={`absolute inset-0 bg-gradient-to-b ${title.includes('Design') ? 'from-violet-500/10' : 'from-cyan-500/10'} to-transparent opacity-20 animate-scan`} style={{ animationDuration: '2s' }}></div>
              </div>
            )}

            {!isLoading && (
              <button
                onClick={onImageClear}
                className="absolute top-2 right-2 bg-white/90 text-slate-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-600 shadow-sm z-20 backdrop-blur-sm border border-slate-200"
                aria-label={`Remove ${title}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <label
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex flex-col items-center justify-center w-full h-full min-h-[300px] rounded-xl cursor-pointer
              border-2 border-dashed transition-all duration-300 relative overflow-hidden
              ${isDragging 
                ? `${accentColor} bg-slate-50 scale-[0.99]` 
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
              ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            {!isLoading && <input type="file" accept="image/png, image/jpeg, image/gif, image/webp" className="hidden" onChange={handleFileChange} />}
            
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-4 z-10">
              <UploadIcon className={`w-12 h-12 mb-4 transition-colors duration-300 ${isDragging ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className="mb-2 text-lg text-slate-700 font-medium">
                {isDragging ? "Drop to upload" : "Upload Image"}
              </p>
              <p className="text-sm text-slate-500">PNG, JPG, GIF, WebP</p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};
