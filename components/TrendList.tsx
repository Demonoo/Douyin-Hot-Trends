
import React from 'react';
import { TrendItem } from '../types';
import { Flame, Search, RefreshCw, SignalHigh, WifiOff } from 'lucide-react';

interface TrendListProps {
  trends: TrendItem[];
  isMock: boolean;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: Date;
}

const TrendList: React.FC<TrendListProps> = ({ trends, isMock, onRefresh, isLoading, lastUpdated }) => {
  
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-[#FFD12E]'; // Gold/Yellow
      case 2: return 'text-[#99A2AA]'; // Silver
      case 3: return 'text-[#CD7F32]'; // Bronze
      default: return 'text-slate-600';
    }
  };

  const formatHotValue = (val: number) => {
    if (val > 100000000) return (val / 100000000).toFixed(1) + '亿';
    return (val / 10000).toFixed(1) + 'w';
  };

  // Douyin Native Tag Styles
  const getLabelConfig = (label: number) => {
    // 1: 新 (New) - Yellow
    // 2: 荐 (Rec) - Cyan
    // 3: 热 (Hot) - Red
    // 4: 爆 (Explosive) - Dark Red
    // 5: 首发 (Premiere) - Blue (Was '商')
    switch (label) {
      case 1: return { text: '新', className: 'bg-[#FFD12E] text-black ring-1 ring-[#FFD12E]/50' };
      case 2: return { text: '荐', className: 'bg-[#25F4EE] text-black ring-1 ring-[#25F4EE]/50' };
      case 3: return { text: '热', className: 'bg-[#FE2C55] text-white ring-1 ring-[#FE2C55]/50' };
      case 4: return { text: '爆', className: 'bg-[#D0021B] text-white ring-1 ring-[#D0021B]/50 shadow-[0_0_8px_rgba(208,2,27,0.4)]' };
      // Modified: Changed '商' to '首发'
      case 5: return { text: '首发', className: 'bg-[#3D8AF5] text-white ring-1 ring-[#3D8AF5]/50' };
      default: return null;
    }
  };

  const formattedTime = lastUpdated ? lastUpdated.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--';

  return (
    <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      
      {/* Header Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-douyin-cyan to-douyin-red">
              抖音热搜榜 Top 50
            </span>
            <Flame className="w-8 h-8 text-douyin-red animate-pulse-slow" />
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <p className="text-slate-400 text-sm">实时数据分析</p>
             {isMock ? (
               <span className="flex items-center px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-500 border border-slate-700">
                 <WifiOff className="w-3 h-3 mr-1" /> 演示模式
               </span>
             ) : (
               <span className="flex items-center px-2 py-0.5 rounded bg-green-900/30 text-xs text-green-400 border border-green-800/50 animate-pulse">
                 <SignalHigh className="w-3 h-3 mr-1" /> 实时数据
               </span>
             )}
             {!isLoading && <span className="text-xs text-slate-600">更新于 {formattedTime}</span>}
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center px-4 py-2 bg-douyin-card border border-white/10 hover:border-douyin-cyan/50 rounded-lg text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(37,244,238,0.15)] disabled:opacity-50 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '加载中...' : '刷新列表'}
        </button>
      </div>

      {/* List */}
      <div className="bg-douyin-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-douyin-card z-10">
          <div className="col-span-2 md:col-span-1 text-center">排名</div>
          <div className="col-span-7 md:col-span-8">话题</div>
          <div className="col-span-3 text-right">热度</div>
        </div>

        <div className="divide-y divide-white/5">
          {trends.map((item, index) => {
            const labelConfig = getLabelConfig(item.label || 0);
            return (
              <div 
                key={index} 
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group cursor-default relative overflow-hidden"
              >
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 text-center font-black text-xl md:text-2xl italic relative z-10 flex justify-center items-center">
                   <span className={getRankColor(item.position)}>{item.position}</span>
                   {/* Top 3 Fire Icon Effect */}
                   {item.position <= 3 && (
                     <div className="absolute -z-10 w-8 h-8 rounded-full bg-white/5 blur-md"></div>
                   )}
                </div>

                {/* Content */}
                <div className="col-span-7 md:col-span-8 z-10">
                  <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm md:text-lg text-white group-hover:text-douyin-cyan transition-colors">
                        {item.word}
                      </span>
                      {/* Labels */}
                      {labelConfig && (
                        <span className={`inline-flex items-center justify-center px-1 h-[16px] text-[10px] font-bold rounded-[3px] leading-none ${labelConfig.className}`}>
                          {labelConfig.text}
                        </span>
                      )}
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-3 text-right z-10">
                  <div className="font-mono font-bold text-white text-sm md:text-base">
                    {formatHotValue(item.hot_value)}
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     去搜索 <Search className="w-3 h-3" /> 
                  </div>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              </div>
            );
          })}
        </div>
        
        {trends.length === 0 && !isLoading && (
           <div className="p-12 text-center text-slate-500">
               暂无数据，请尝试刷新。
           </div>
        )}
      </div>
    </div>
  );
};

export default TrendList;
