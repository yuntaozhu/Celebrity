
export interface CelebrityMatch {
  name: string;
  similarity: number;
  reason: string;
  angle: string;
  imageUrl: string;
}

export interface FacialAnalysis {
  fortune: string;
  health: string;
  makeup: string;
}

export interface AnalysisResult {
  celebrityMatches: CelebrityMatch[];
  facialAnalysis: FacialAnalysis;
}
