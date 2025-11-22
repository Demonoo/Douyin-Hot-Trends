import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TrendList from './components/TrendList';
import TrendChart from './components/TrendChart';
import AIAnalyst from './components/AIAnalyst';
import { AppSection, TrendItem } from './types';
import { fetchDouyinTrends } from './services/douyinService';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchDouyinTrends();
    setTrends(result.trends);
    setIsMock(result.isMock);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case AppSection.DASHBOARD:
        return <TrendList trends={trends} isMock={isMock} onRefresh={loadData} isLoading={isLoading} />;
      case AppSection.ANALYSIS:
        return <TrendChart trends={trends} />;
      case AppSection.AI_INSIGHTS:
        return <AIAnalyst trends={trends} />;
      default:
        return <TrendList trends={trends} isMock={isMock} onRefresh={loadData} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header currentSection={currentSection} setSection={setCurrentSection} />
      <main className="w-full">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;