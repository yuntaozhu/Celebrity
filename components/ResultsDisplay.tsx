import React from 'react';
import { CelebrityMatch, FacialAnalysis } from '../types';
import { RadarChartComponent } from './RadarChartComponent';

interface ResultsDisplayProps {
  celebrityMatches: CelebrityMatch[];
  facialAnalysis: FacialAnalysis;
  userImage: string;
  language: 'en' | 'zh';
}

const translations = {
  en: {
    resultsTitle: "Your Results Are In!",
    similarityAnalysis: "Your Similarity Analysis",
    sanTingWuYan: "三庭五眼 (San Ting Wu Yan) Analysis",
    fortune: "Fortune",
    health: "Health",
    makeup: "Makeup Suggestion",
    celebrityMatches: "Celebrity Matches",
    matchAngle: "Match Angle",
    similarity: "Similarity"
  },
  zh: {
    resultsTitle: "您的分析结果已出！",
    similarityAnalysis: "您的相似度分析",
    sanTingWuYan: "三庭五眼分析",
    fortune: "面相运势",
    health: "健康",
    makeup: "化妆建议",
    celebrityMatches: "明星匹配",
    matchAngle: "匹配角度",
    similarity: "相似度"
  }
};


// Fix: Changed icon type from JSX.Element to React.ReactNode to resolve TypeScript error.
const AnalysisCard: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-start text-left shadow-lg border border-gray-700 h-full">
        <div className="flex items-center mb-3">
            <div className="bg-purple-500/20 text-purple-300 rounded-full p-2 mr-3">
                {icon}
            </div>
            <h4 className="text-xl font-bold text-white">{title}</h4>
        </div>
        <p className="text-gray-300 text-sm">{content}</p>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ celebrityMatches, facialAnalysis, userImage, language }) => {
  const t = (key: keyof typeof translations.en) => translations[language][key] || key;
  
  return (
    <div className="mt-8 pt-8 border-t border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-8">{t('resultsTitle')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="w-full max-w-md mx-auto aspect-square p-4 bg-gray-900 rounded-lg shadow-inner">
          <RadarChartComponent data={celebrityMatches} language={language} />
        </div>
        <div className="flex flex-col items-center">
          <img src={userImage} alt="Your photo" className="w-48 h-48 rounded-full object-cover border-4 border-purple-500 shadow-lg mb-4" />
          <p className="text-xl font-semibold">{t('similarityAnalysis')}</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-700/50">
        <h3 className="text-2xl font-bold text-center mb-6">{t('sanTingWuYan')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalysisCard 
                title={t('fortune')}
                content={facialAnalysis.fortune}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 12l4.293 4.293a1 1 0 010 1.414L13 20m5-16l2.293 2.293a1 1 0 010 1.414L15 12l4.293 4.293a1 1 0 010 1.414L17 20" /></svg>}
            />
            <AnalysisCard 
                title={t('health')}
                content={facialAnalysis.health}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
            />
            <AnalysisCard 
                title={t('makeup')}
                content={facialAnalysis.makeup}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>}
            />
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-700/50">
        <h3 className="text-2xl font-bold text-center mb-6">{t('celebrityMatches')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {celebrityMatches.map((match, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 text-center transform hover:scale-105 hover:bg-gray-700/70 transition-all duration-300 shadow-lg border border-gray-700">
              <img
                src={match.imageUrl}
                alt={match.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-pink-500 bg-gray-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = `https://via.placeholder.com/200/2D3748/FFFFFF?text=${match.name.split(' ').map(n=>n[0]).join('')}`;
                }}
              />
              <h4 className="text-xl font-bold text-white">{match.name}</h4>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 my-1">{match.similarity}%</p>
              <p className="text-sm font-semibold text-gray-400 mb-2">{t('matchAngle')}: {match.angle}</p>
              <p className="text-sm text-gray-300 italic">"{match.reason}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};