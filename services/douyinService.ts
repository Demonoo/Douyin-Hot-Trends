import { TrendItem } from '../types';

const DIRECT_API_URL = 'https://aweme-hl.snssdk.com/aweme/v1/hot/search/list/?detail_list=1';

// CORS Proxies optimized for global access including China
const PROXY_GATEWAYS = [
  // 1. CodeTabs - Very reliable for JSON data, often accessible in CN
  (target: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`,
  // 2. CorsProxy.io - Fast direct pipe
  (target: string) => `https://corsproxy.io/?${encodeURIComponent(target)}`,
  // 3. AllOrigins - Fallback
  (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`
];

export const fetchDouyinTrends = async (): Promise<{ trends: TrendItem[], isMock: boolean }> => {
  const timestamp = Date.now();
  // Append timestamp to force fresh data from upstream API
  const targetUrl = `${DIRECT_API_URL}&_t=${timestamp}`;
  
  // Try proxies sequentially
  for (const createProxyUrl of PROXY_GATEWAYS) {
    try {
      const proxyUrl = createProxyUrl(targetUrl);
      
      // Add disableCache param for AllOrigins specifically if used
      const finalUrl = proxyUrl.includes('allorigins') 
        ? `${proxyUrl}&disableCache=true` 
        : proxyUrl;

      // Set a strict timeout to fail fast and switch proxies
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(finalUrl, { 
        signal: controller.signal,
        headers: {
            'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        continue; 
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
      continue; // Try next proxy
    }
  }

  // If we reach here, all proxies failed.
  throw new Error("连接失败：无法从任何线路获取数据。请检查网络连接或尝试开启/关闭 VPN。");
};