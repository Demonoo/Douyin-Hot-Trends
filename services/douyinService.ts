
import { TrendItem } from '../types';

const DIRECT_API_URL = 'https://aweme-hl.snssdk.com/aweme/v1/hot/search/list/?detail_list=1';

// CORS Proxies to bypass browser restrictions
// We use a rotation strategy to ensure high availability
const PROXY_GATEWAYS = [
  (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
  (target: string) => `https://corsproxy.io/?${encodeURIComponent(target)}`
];

export const fetchDouyinTrends = async (): Promise<{ trends: TrendItem[], isMock: boolean }> => {
  const timestamp = Date.now();
  // Append timestamp to force fresh data from upstream API
  const targetUrl = `${DIRECT_API_URL}&_t=${timestamp}`;
  
  let lastError: any;

  // Try proxies sequentially
  for (const createProxyUrl of PROXY_GATEWAYS) {
    try {
      const proxyUrl = createProxyUrl(targetUrl);
      
      // Add disableCache param for AllOrigins specifically if used
      const finalUrl = proxyUrl.includes('allorigins') 
        ? `${proxyUrl}&disableCache=true` 
        : proxyUrl;

      const response = await fetch(finalUrl);
      
      if (!response.ok) {
        throw new Error(`Proxy response error: ${response.status}`);
      }

      const data = await response.json();

      // Validate Douyin API structure
      if (data && data.data && Array.isArray(data.data.word_list)) {
         const fullList = data.data.word_list;
         
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
    } catch (error) {
      console.warn(`Proxy attempt failed, trying next...`, error);
      lastError = error;
      continue; // Try next proxy
    }
  }

  // If we reach here, all proxies failed.
  // CRITICAL: Do NOT return mock data. Throw error to let UI handle it.
  throw new Error("无法连接到抖音热榜服务器，请检查网络或稍后重试。");
};
