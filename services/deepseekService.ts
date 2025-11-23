
import { TrendItem, ClusterCategory } from "../types";
import { SYSTEM_INSTRUCTION } from '../constants';

const LOCAL_STORAGE_KEY = 'deepseek_api_key';
const API_URL = 'https://api.deepseek.com/chat/completions';

export const getApiKey = (): string | null => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return localStorage.getItem(LOCAL_STORAGE_KEY);
};

export const saveApiKey = (key: string) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, key);
};

// Helper for DeepSeek API calls
const callDeepSeek = async (messages: any[], jsonMode: boolean = false) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("MISSING_KEY");

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages,
      stream: false,
      response_format: jsonMode ? { type: "json_object" } : { type: "text" },
      temperature: 1.1 // Slightly creative for trends
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("DeepSeek API Error:", errorData);
    throw new Error(errorData.error?.message || `API Request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const analyzeTrendsWithAI = async (trends: TrendItem[], userQuery: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "MISSING_KEY";

  try {
    const topTrends = trends.slice(0, 20).map(t => `${t.position}. ${t.word} (热度: ${t.hot_value})`).join('\n');
    
    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: `当前抖音 Top 20 热搜:\n${topTrends}\n\n用户问题: ${userQuery}` }
    ];

    return await callDeepSeek(messages);

  } catch (error) {
    console.error("Analysis Error:", error);
    return "错误: 无法分析趋势。请检查您的 DeepSeek API Key 或网络连接。";
  }
};

export const clusterTrendsWithAI = async (trends: TrendItem[]): Promise<ClusterCategory[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("MISSING_KEY");

  try {
    const trendList = trends.map(t => `${t.position}. ${t.word}`).join('\n');

    const prompt = `
请分析以下 50 个抖音热搜话题。
将它们归类为 5-8 个不同的语义类别（例如：娱乐明星、社会新闻、生活美食、科技数码、体育、幽默搞笑等）。

输入列表：
${trendList}

仅返回一个符合以下结构的有效 JSON 对象：
{
  "categories": [
    {
      "name": "类别名称 (中文)",
      "description": "3-5个字的简短中文描述",
      "trend_positions": [1, 4, 12]
    }
  ]
}
`;

    const messages = [
      { role: "system", content: "你是一个乐于助人的数据分类助手，你只输出 JSON 格式。" },
      { role: "user", content: prompt }
    ];

    const jsonString = await callDeepSeek(messages, true);
    
    if (!jsonString) throw new Error("Empty response from AI");

    const result = JSON.parse(jsonString);
    
    const clusters: ClusterCategory[] = result.categories.map((cat: any, index: number) => {
      const matchedTrends = cat.trend_positions
        .map((pos: number) => trends.find(t => t.position === pos))
        .filter((t: TrendItem | undefined): t is TrendItem => t !== undefined);

      const totalHeat = matchedTrends.reduce((sum: number, t: TrendItem) => sum + t.hot_value, 0);
      
      return {
        id: `cat-${index}`,
        name: cat.name,
        description: cat.description,
        trends: matchedTrends,
        totalHeat: totalHeat,
        percentage: 0
      };
    });

    const grandTotalHeat = clusters.reduce((sum, c) => sum + c.totalHeat, 0);
    clusters.forEach(c => {
      c.percentage = Math.round((c.totalHeat / grandTotalHeat) * 100);
    });

    return clusters.sort((a, b) => b.totalHeat - a.totalHeat);

  } catch (error) {
    console.error("Clustering Error:", error);
    throw error;
  }
};