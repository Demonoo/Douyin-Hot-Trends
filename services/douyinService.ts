
import { TrendItem } from '../types';
import { MOCK_TRENDS } from '../constants';

const DIRECT_API_URL = 'https://aweme-hl.snssdk.com/aweme/v1/hot/search/list/?detail_list=1';
// We use a public CORS proxy to bypass browser restrictions when accessing the ByteDance API directly
// This enables the "Real-time" functionality in a pure frontend environment
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(DIRECT_API_URL)}`;

export const fetchDouyinTrends = async (): Promise<{ trends: TrendItem[], isMock: boolean }> => {
  try {
    // 1. Attempt to fetch via Proxy (Likely to succeed in browser)
    const response = await fetch(PROXY_URL);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate data structure
    if (data && data.data && Array.isArray(data.data.word_list)) {
       const fullList = data.data.word_list;
       // User requested Top 50 specifically
       const top50 = fullList.slice(0, 50).map((item: any, index: number) => ({
         position: index + 1,
         word: item.word,
         hot_value: item.hot_value,
         label: item.label || 0,
         video_count: item.video_count,
         discussion_hot: item.discussion_hot
       }));

       return { trends: top50, isMock: false };
    }
    
    throw new Error('Invalid API data format');
  } catch (error) {
    console.warn("Failed to fetch live Douyin data. Falling back to Mock Data.", error);
    // Return Mock data if live fetch fails, ensuring the app remains usable
    return { trends: MOCK_TRENDS, isMock: true };
  }
};
