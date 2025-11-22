
export interface TrendItem {
  position: number;
  word: string; // The search term
  hot_value: number; // The heat score
  label?: number; // 0: none, 1: new, 2: hot, etc.
  video_count?: number;
  discussion_hot?: number;
}

export interface TrendResponse {
  data: {
    word_list: TrendItem[];
    active_time: string;
  }
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}

export interface ClusterCategory {
  id: string;
  name: string;
  description: string;
  trends: TrendItem[];
  totalHeat: number;
  percentage: number;
}

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  AI_INSIGHTS = 'AI_INSIGHTS'
}
