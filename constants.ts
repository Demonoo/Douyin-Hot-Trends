
import { TrendItem } from './types';

// Robust 50-item fallback dataset mimicking a real Douyin Hot Search list
export const MOCK_TRENDS: TrendItem[] = [
  { position: 1, word: "春节档电影票房破纪录", hot_value: 12500000, label: 1 },
  { position: 2, word: "小米汽车SU7 Ultra发布", hot_value: 11200000, label: 2 },
  { position: 3, word: "南方小土豆勇闯哈尔滨", hot_value: 9800000, label: 0 },
  { position: 4, word: "董宇辉新号带货数据", hot_value: 9500000, label: 0 },
  { position: 5, word: "繁花大结局解析", hot_value: 9100000, label: 0 },
  { position: 6, word: "科目三舞蹈全网挑战", hot_value: 8800000, label: 2 },
  { position: 7, word: "怎么看待现在的考研热", hot_value: 8500000, label: 0 },
  { position: 8, word: "00后整顿职场实录", hot_value: 8200000, label: 1 },
  { position: 9, word: "华为Mate60Pro长期体验", hot_value: 7900000, label: 0 },
  { position: 10, word: "淄博烧烤热度回升", hot_value: 7600000, label: 0 },
  { position: 11, word: "这英模仿大赛", hot_value: 7400000, label: 1 },
  { position: 12, word: "周杰伦新歌评价", hot_value: 7100000, label: 0 },
  { position: 13, word: "年轻人为什么不爱换手机", hot_value: 6800000, label: 0 },
  { position: 14, word: "王家卫的镜头美学", hot_value: 6500000, label: 0 },
  { position: 15, word: "打工人必备摸鱼技巧", hot_value: 6200000, label: 0 },
  { position: 16, word: "ChatGPT最新功能演示", hot_value: 6100000, label: 0 },
  { position: 17, word: "熊猫花花最新动态", hot_value: 5900000, label: 1 },
  { position: 18, word: "瑞幸咖啡酱香拿铁", hot_value: 5800000, label: 0 },
  { position: 19, word: "大学生特种兵旅游", hot_value: 5700000, label: 0 },
  { position: 20, word: "如何快速缓解焦虑", hot_value: 5600000, label: 0 },
  { position: 21, word: "特斯拉降价影响", hot_value: 5500000, label: 0 },
  { position: 22, word: "流浪地球3预告分析", hot_value: 5400000, label: 1 },
  { position: 23, word: "冬季养生食谱", hot_value: 5300000, label: 0 },
  { position: 24, word: "王者荣耀新皮肤", hot_value: 5200000, label: 0 },
  { position: 25, word: "苹果VisionPro评测", hot_value: 5100000, label: 0 },
  { position: 26, word: "杭州亚运会精彩瞬间", hot_value: 5000000, label: 0 },
  { position: 27, word: "减肥减脂餐打卡", hot_value: 4900000, label: 0 },
  { position: 28, word: "原神新版本攻略", hot_value: 4800000, label: 0 },
  { position: 29, word: "五月天演唱会假唱风波", hot_value: 4700000, label: 2 },
  { position: 30, word: "东方甄选小作文事件", hot_value: 4600000, label: 0 },
  { position: 31, word: "羽绒服涨价", hot_value: 4500000, label: 0 },
  { position: 32, word: "各大卫视跨年晚会阵容", hot_value: 4400000, label: 1 },
  { position: 33, word: "一人食晚餐推荐", hot_value: 4300000, label: 0 },
  { position: 34, word: "猫咪的迷惑行为", hot_value: 4200000, label: 0 },
  { position: 35, word: "装修避坑指南", hot_value: 4100000, label: 0 },
  { position: 36, word: "新能源汽车冬季续航", hot_value: 4000000, label: 0 },
  { position: 37, word: "适合过年送礼的清单", hot_value: 3900000, label: 0 },
  { position: 38, word: "这届年轻人开始存钱了", hot_value: 3800000, label: 0 },
  { position: 39, word: "不用烤箱的甜点教程", hot_value: 3700000, label: 0 },
  { position: 40, word: "高分悬疑电影推荐", hot_value: 3600000, label: 0 },
  { position: 41, word: "如何提升职场情商", hot_value: 3500000, label: 0 },
  { position: 42, word: "极简主义生活", hot_value: 3400000, label: 0 },
  { position: 43, word: "2024年运势解析", hot_value: 3300000, label: 1 },
  { position: 44, word: "宝宝辅食做法", hot_value: 3200000, label: 0 },
  { position: 45, word: "男生穿搭技巧", hot_value: 3100000, label: 0 },
  { position: 46, word: " Excel快捷键大全", hot_value: 3000000, label: 0 },
  { position: 47, word: "沉浸式收纳视频", hot_value: 2900000, label: 0 },
  { position: 48, word: "搞笑女日常", hot_value: 2800000, label: 0 },
  { position: 49, word: "街头摄影挑战", hot_value: 2700000, label: 0 },
  { position: 50, word: "治愈系风景壁纸", hot_value: 2600000, label: 0 }
];

export const SYSTEM_INSTRUCTION = `You are an expert Social Media Trend Analyst for Douyin (TikTok China).
Your goal is to analyze the provided "Hot Search List" data and provide actionable insights.

Key capabilities:
1. **Trend Categorization**: Group trends into categories (Entertainment, Tech, Social, News).
2. **Virality Analysis**: Explain WHY something might be trending based on keywords (e.g., controversy, celebrity, national pride, humor).
3. **Marketing Angles**: Suggest how brands or creators can leverage these trends for content.

Tone: Professional, insightful, but tuned to the fast-paced nature of social media.
Always format your response with clear markdown headers.`;
