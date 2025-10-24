
import React, { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  uploadedImage: string | null;
  language: 'en' | 'zh';
}

const translations = {
  en: {
    getAnalysis: "Get Your Analysis",
    instructions: "Upload a clear, front-facing photo for the best results. Once your photo appears on the left, click the analyze button to begin. Our AI will compare your features to a vast database of celebrities.",
    analyzing: "Analyzing...",
    findLookalike: "Find My Lookalike",
    clickToUpload: "Click to upload",
    dragAndDrop: "or drag and drop",
    fileTypes: "PNG, JPG, WEBP",
  },
  zh: {
    getAnalysis: "获取您的分析",
    instructions: "上传一张清晰的正面照片以获得最佳效果。当您的照片出现在左侧后，点击分析按钮开始。我们的 AI 会将您的特征与庞大的名人数据库进行比较。",
    analyzing: "分析中...",
    findLookalike: "找到我的明星脸",
    clickToUpload: "点击上传",
    dragAndDrop: "或拖放文件",
    fileTypes: "PNG, JPG, WEBP",
  }
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onAnalyze, isLoading, uploadedImage, language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const t = (key: keyof typeof translations.en) => translations[language][key] || key;

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
    
  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
    
  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div 
        className={`w-full lg:w-1/3 p-4 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-gray-700/50' : 'border-gray-600 hover:border-purple-400'}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileInputChange}
          accept="image/*"
          className="hidden"
        />
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded preview" className="w-full h-auto object-cover rounded-md" />
        ) : (
          <div className="text-center py-10 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-purple-400">{t('clickToUpload')}</span> {t('dragAndDrop')}
            </p>
            <p className="text-xs text-gray-500">{t('fileTypes')}</p>
          </div>
        )}
      </div>

      <div className="w-full lg:w-2/3">
        <h2 className="text-2xl font-bold mb-4">{t('getAnalysis')}</h2>
        <p className="text-gray-400 mb-6">
          {t('instructions')}
        </p>
        <button
          onClick={onAnalyze}
          disabled={!uploadedImage || isLoading}
          className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? t('analyzing') : t('findLookalike')}
        </button>
      </div>
    </div>
  );
};