
import React from 'react';

interface LoadingSpinnerProps {
  language: 'en' | 'zh';
}

const translations = {
  en: {
    analyzing: "AI is analyzing your features...",
    wait: "This might take a moment."
  },
  zh: {
    analyzing: "AI 正在分析您的特征...",
    wait: "这可能需要一些时间。"
  }
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ language }) => {
  const t = (key: keyof typeof translations.en) => translations[language][key] || key;
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      <p className="mt-4 text-lg text-gray-300">{t('analyzing')}</p>
      <p className="text-sm text-gray-500">{t('wait')}</p>
    </div>
  );
};