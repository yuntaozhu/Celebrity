
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeImageForLookalike } from './services/geminiService';
import { AnalysisResult } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';

const translations = {
  en: {
    title: "Celebrity Lookalike Finder",
    subtitle: "Discover your famous doppelgänger and get a personalized facial analysis!",
    uploadTitle: "Upload Your Photo",
    uploadSubtitle: "Let's see which stars you look like.",
    errorPrefix: "Analysis failed:",
    unknownError: "An unknown error occurred.",
    uploadFirst: "Please upload an image first.",
  },
  zh: {
    title: "明星脸查找器",
    subtitle: "发现与您相貌相似的名人，并获得个性化的面部分析！",
    uploadTitle: "上传您的照片",
    uploadSubtitle: "看看你长得像哪些明星。",
    errorPrefix: "分析失败：",
    unknownError: "发生了未知错误。",
    uploadFirst: "请先上传一张图片。",
  }
};

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  const t = (key: keyof typeof translations.en) => translations[language][key] || key;

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!uploadedImage) {
      setError(t('uploadFirst'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const base64Data = uploadedImage.split(',')[1];
      const result = await analyzeImageForLookalike(base64Data, language);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? `${t('errorPrefix')} ${err.message}` : t('unknownError'));
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, language, t]);
  
  const getButtonClass = (lang: 'en' | 'zh') => {
    return language === lang
      ? 'px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md shadow-md'
      : 'px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600';
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-4">
              <button onClick={() => setLanguage('en')} className={getButtonClass('en')}>English</button>
              <button onClick={() => setLanguage('zh')} className={getButtonClass('zh')}>中文</button>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {t('title')}
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            {t('subtitle')}
          </p>
        </header>

        <main className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
          <ImageUploader
            onImageUpload={handleImageUpload}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            uploadedImage={uploadedImage}
            language={language}
          />

          {isLoading && <LoadingSpinner language={language} />}
          
          {error && (
            <div className="mt-6 text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {analysisResult && uploadedImage && (
            <ResultsDisplay 
              celebrityMatches={analysisResult.celebrityMatches}
              facialAnalysis={analysisResult.facialAnalysis}
              userImage={uploadedImage}
              language={language}
            />
          )}

          {!uploadedImage && !isLoading && !analysisResult && (
             <div className="text-center py-20">
                <div className="text-6xl mb-4">📸</div>
                <h2 className="text-2xl font-bold text-gray-300">{t('uploadTitle')}</h2>
                <p className="text-gray-500">{t('uploadSubtitle')}</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;