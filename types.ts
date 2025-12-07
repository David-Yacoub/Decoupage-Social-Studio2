export enum SocialPlatform {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  Pinterest = 'Pinterest',
  Twitter = 'Twitter/X',
  TikTok = 'TikTok'
}

export enum ToneStyle {
  Artistic = 'Artistic & Dreamy',
  Professional = 'Professional & Clean',
  Enthusiastic = 'Enthusiastic & Fun',
  Minimalist = 'Minimalist & Chic',
  Storyteller = 'Storyteller & Detailed'
}

export interface GeneratedPost {
  platform: string;
  content: string;
  hashtags: string[];
}

export interface AnalysisResult {
  visualDescription: string;
  craftsmanshipDetails: string;
  posts: GeneratedPost[];
}

export interface GenerationConfig {
  platforms: SocialPlatform[];
  tone: ToneStyle;
}
