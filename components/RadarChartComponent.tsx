
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CelebrityMatch } from '../types';

interface RadarChartComponentProps {
  data: CelebrityMatch[];
  language: 'en' | 'zh';
}

const translations = {
  en: {
    similarity: "Similarity"
  },
  zh: {
    similarity: "相似度"
  }
};

export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data, language }) => {
  const t = (key: keyof typeof translations.en) => translations[language][key] || key;

  const chartData = data.map(item => ({
    subject: item.angle,
    A: item.similarity,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
            </linearGradient>
        </defs>
        <PolarGrid stroke="#4A5568" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#E2E8F0', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#A0AEC0', fontSize: 10 }} />
        <Radar name={t('similarity')} dataKey="A" stroke="#d53f8c" fill="#d53f8c" fillOpacity={0.6} />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4A5568',
                borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#F7FAFC' }}
        />
        <Legend wrapperStyle={{ color: '#F7FAFC' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};