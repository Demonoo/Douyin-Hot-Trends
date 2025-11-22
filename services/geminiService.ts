
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { TrendItem, ClusterCategory } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTrendsWithAI = async (trends: TrendItem[], userQuery: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Configuration Error: API Key missing.";

  try {
    const model = client.models;
    
    // Compress trend list for the prompt to save tokens, just top 20 for chat context
    const topTrends = trends.slice(0, 20).map(t => `${t.position}. ${t.word} (Heat: ${t.hot_value})`).join('\n');

    const prompt = `
Current Top 20 Douyin Trends:
${topTrends}

User Query: ${userQuery}

Please provide a concise analysis.
`;
    
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Analysis failed to generate.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to analyze trends at the moment. Please try again.";
  }
};

export const clusterTrendsWithAI = async (trends: TrendItem[]): Promise<ClusterCategory[]> => {
  const client = getClient();
  if (!client) throw new Error("API Key missing");

  try {
    const model = client.models;

    // We send all trends to get a full clustering
    const trendList = trends.map(t => `${t.position}. ${t.word}`).join('\n');

    const prompt = `
You are a data classification engine. 
Analyze the following list of 50 Douyin/TikTok trending topics.
Group them into 5-8 distinct semantic categories (e.g., Entertainment & Celebrities, Social News, Lifestyle & Food, Tech & Digital, Sports, Humor).

Input List:
${trendList}

Return ONLY a valid JSON object with this structure:
{
  "categories": [
    {
      "name": "Category Name",
      "description": "Short 3-5 word description of this group",
      "trend_positions": [1, 4, 12] // The rank numbers from the input list that belong here
    }
  ]
}
Do not return markdown code blocks. Just the JSON string.
`;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const result = JSON.parse(text);
    
    // Map the AI response back to the original TrendItems
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
        percentage: 0 // Will calculate below
      };
    });

    // Calculate percentages
    const grandTotalHeat = clusters.reduce((sum, c) => sum + c.totalHeat, 0);
    clusters.forEach(c => {
      c.percentage = Math.round((c.totalHeat / grandTotalHeat) * 100);
    });

    // Sort clusters by total heat (importance)
    return clusters.sort((a, b) => b.totalHeat - a.totalHeat);

  } catch (error) {
    console.error("Clustering Error:", error);
    throw error;
  }
};
