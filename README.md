# DMEDIA | 抖音热榜 AI 分析平台

![DMEDIA Badge](https://img.shields.io/badge/DMEDIA-Trend%20Analysis-FE2C55?style=for-the-badge&logo=tiktok&logoColor=white)
![DeepSeek Badge](https://img.shields.io/badge/AI-DeepSeek%20V3-blue?style=for-the-badge)
![React Badge](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

**DMEDIA** 是一个现代化的数据可视化 Web 应用，专注于**抖音（Douyin）热搜榜**的实时监控与深度 AI 分析。项目集成了 **DeepSeek V3** 大模型，能够对热点话题进行自动化的语义聚类、归因分析及营销价值评估。

## 🇨🇳 中国大陆部署指南 (方案 A)

**推荐使用 Cloudflare Pages**，其默认域名 (`*.pages.dev`) 在中国大陆访问较为稳定，且部署完全免费。

### 1. 准备代码
确保已将本项目代码（包含新生成的 `package.json` 和 `vite.config.ts`）上传至您的 **GitHub** 仓库。

### 2. 部署步骤
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 在左侧菜单选择 **Workers & Pages**。
3. 点击 **Create Application** -> **Pages** -> **Connect to Git**。
4. 选择您的 GitHub 仓库。
5. **配置构建设置 (Build Settings)**：
   - **Framework preset**: 选择 `Vite` (或者 `Create React App`)，或者保持 None。
   - **Build command**: 输入 `npm run build`
   - **Build output directory**: 输入 `dist`
6. 点击 **Save and Deploy**。

### 3. 完成
部署完成后，Cloudflare 会提供一个 `https://your-project.pages.dev` 的访问链接，该链接在国内通常可以直接访问。

---

## ✨ 核心功能 (Features)

### 1. 🔥 实时热榜监控
- **秒级同步**：直连抖音官方热榜接口，支持 Top 50 话题实时刷新。
- **抗干扰采集**：内置多重 CORS 代理策略（CodeTabs + CorsProxy + AllOrigins），确保在浏览器端也能稳定获取数据。
- **原生体验**：完美复刻抖音视觉规范，精准还原“热”、“爆”、“新”、“荐”、“首发”等状态标签。

### 2. 🧠 AI 智能聚类 (DeepSeek V3)
- **语义归类**：利用 DeepSeek 强大的语义理解能力，自动将 50 个杂乱的词条归类为“娱乐明星”、“社会民生”、“科技数码”等板块。
- **热度透视**：可视化展示各内容板块的热度占比，一眼洞察当前舆论风向。

### 3. 💡 AI 趋势分析师
- **对话式交互**：内置 AI 智能助手，用户可直接提问（如：“分析下Top3话题的爆火逻辑”）。
- **营销洞察**：为创作者和品牌方提供基于实时数据的选题建议和借势营销策略。

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**: React 18, TypeScript, Vite
- **样式引擎**: Tailwind CSS (Custom Cyberpunk/Dark Theme)
- **AI 模型**: DeepSeek-V3 (via OpenAI-compatible API)
- **图表库**: Recharts
- **图标库**: Lucide React

## 🔑 配置指南

为了使用 AI 分析功能，您需要配置 DeepSeek API Key：

1. 启动应用，点击右上角的 **设置 (Settings)** 按钮。
2. 在弹窗中输入您的 DeepSeek API Key (`sk-xxxxxxxx`)。
3. **隐私安全**：Key 仅存储在您浏览器的 `localStorage` 中，请求直接发送至 DeepSeek 官方接口，不经过任何中间服务器。

## 📄 许可证

本项目采用 MIT 许可证。