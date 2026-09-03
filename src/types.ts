export type SocialPlatform = 'linkedin' | 'twitter' | 'instagram';

export type Tone = 'professional' | 'witty' | 'urgent' | 'inspirational' | 'educational' | 'casual';

export type ImageResolution = '1K' | '2K' | '4K';

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export interface PlatformPostDraft {
  platform: SocialPlatform;
  hook: string;
  content: string;
  hashtags: string[];
  characterCount: number;
  imagePrompt: string;
  recommendedAspectRatio: AspectRatio;
  aspectRatio: AspectRatio;
  platformTips: string[];
  imageUrl?: string;
  imageLoading?: boolean;
  imageError?: string;
}

export interface GenerationResponse {
  idea: string;
  tone: Tone;
  posts: {
    linkedin: PlatformPostDraft;
    twitter: PlatformPostDraft;
    instagram: PlatformPostDraft;
  };
}

export interface AnalysisResult {
  overallScore: number;
  hookRating: number;
  readability: string;
  strengths: string[];
  suggestions: string[];
  estimatedEngagement: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  idea: string;
  tone: Tone;
  posts: {
    linkedin: PlatformPostDraft;
    twitter: PlatformPostDraft;
    instagram: PlatformPostDraft;
  };
}
