
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TrendList from './components/TrendList';
import TrendChart from './components/TrendChart';
import AIAnalyst from './components/AIAnalyst';
import ApiKeyModal from './components/ApiKeyModal';
import { AppSection, TrendItem } from './types';
import { fetchDouyinTrends } from './services/douyinService';
import { getApiKey } from './services/deepseekService';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  
  // API Key State
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check for key on mount
    setHasKey(!!getApiKey());
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchDouyinTrends();
      setTrends(result.trends);
      setIsMock(result.isMock);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("无法获取最新热搜数据，可能是由于网络限制或接口繁忙。");
      setTrends([]); // Clear stale data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleKeySuccess = () => {
    setHasKey(true);
  };

  const requestKey = () => {
    setIsKeyModalOpen(true);
  };

  const renderContent = () => {
    // Error State
    if (error && trends.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
          <AlertCircle className="w-16 h-16 text-douyin-red mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">数据获取失败</h3>
          <p className="mb-6 max-w-md text-center">{error}</p>
          <button 
            onClick={loadData}
            className="flex items-center px-6 py-2 bg-douyin-cyan text-black font-bold rounded-full hover:bg-white transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重试连接
          </button>
        </div>
      );
    }

    switch (currentSection) {
      case AppSection.DASHBOARD:
        return <TrendList trends={trends} isMock={isMock} onRefresh={loadData} isLoading={isLoading} lastUpdated={lastUpdated} />;
      case AppSection.ANALYSIS:
        return <TrendChart trends={trends} onRequestKey={requestKey} />;
      case AppSection.AI_INSIGHTS:
        return <AIAnalyst trends={trends} onRequestKey={requestKey} />;
      default:
        return <TrendList trends={trends} isMock={isMock} onRefresh={loadData} isLoading={isLoading} lastUpdated={lastUpdated} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header 
        currentSection={currentSection} 
        setSection={setCurrentSection} 
        onOpenSettings={() => setIsKeyModalOpen(true)}
      />
      <main className="w-full">
        {renderContent()}
      </main>

      <ApiKeyModal 
        isOpen={isKeyModalOpen} 
        onClose={() => setIsKeyModalOpen(false)}
        onSuccess={handleKeySuccess}
      />
    </div>
  );
};

export default App;
