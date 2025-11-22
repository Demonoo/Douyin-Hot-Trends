
import React from 'react';
import { TrendItem } from '../types';
import { Flame, Search, RefreshCw, Signal, SignalHigh, WifiOff } from 'lucide-react';

interface TrendListProps {
  trends: TrendItem[];
  isMock: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

const TrendList: React.FC<TrendListProps> = ({ trends, isMock, onRefresh, isLoading }) => {
  
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-slate-600';
    }
  };

  const formatHotValue = (val: number) => {
    if (val > 100000000) return (val / 100000000).toFixed(1) + '亿'; // 100M
    return (val / 10000).toFixed(1) + 'w';
  };

  return (
    <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      
      {/* Header Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-douyin-cyan to-douyin-red">
              Douyin Top 50
            </span>
            <Flame className="w-8 h-8 text-douyin-red animate-pulse-slow" />
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <p className="text-slate-400 text-sm">Real-time pulse of China</p>
             {isMock ? (
               <span className="flex items-center px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-500 border border-slate-700">
                 <WifiOff className="w-3 h-3 mr-1" /> Demo Mode
               </span>
             ) : (
               <span className="flex items-center px-2 py-0.5 rounded bg-green-900/30 text-xs text-green-400 border border-green-800/50 animate-pulse">
                 <SignalHigh className="w-3 h-3 mr-1" /> Live Data
               </span>
             )}
          </div>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center px-4 py-2 bg-douyin-card border border-white/10 hover:border-douyin-cyan/50 rounded-lg text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(37,244,238,0.15)] disabled:opacity-50 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Fetching API...' : 'Refresh List'}
        </button>
      </div>

      {/* List */}
      <div className="bg-douyin-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-douyin-card z-10">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-7 md:col-span-8">Topic</div>
          <div className="col-span-3 text-right">Heat</div>
        </div>

        <div className="divide-y divide-white/5">
          {trends.map((item, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group cursor-default relative overflow-hidden"
            >
              {/* Rank */}
              <div className="col-span-2 md:col-span-1 text-center font-black text-xl md:text-2xl italic relative z-10">
                <span className={getRankColor(item.position)}>{item.position}</span>
              </div>

              {/* Content */}
              <div className="col-span-7 md:col-span-8 z-10">
                <div className="font-medium text-sm md:text-lg text-white group-hover:text-douyin-cyan transition-colors flex flex-wrap items-center gap-2">
                    {item.word}
                    {/* Labels */}
                    {item.label === 1 && <span className="inline-block px-1.5 py-0.5 bg-douyin-red text-[10px] font-bold rounded text-white">NEW</span>}
                    {item.label === 2 && <span className="inline-block px-1.5 py-0.5 bg-amber-500 text-[10px] font-bold rounded text-black">HOT</span>}
                    {item.label === 3 && <span className="inline-block px-1.5 py-0.5 bg-purple-500 text-[10px] font-bold rounded text-white">爆</span>}
                </div>
              </div>

              {/* Score */}
              <div className="col-span-3 text-right z-10">
                <div className="font-mono font-bold text-douyin-red/90 text-sm md:text-base">
                  {formatHotValue(item.hot_value)}
                </div>
                <div className="text-[10px] text-slate-600 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   Search <Search className="w-3 h-3" /> 
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            </div>
          ))}
        </div>
        
        {trends.length === 0 && !isLoading && (
           <div className="p-12 text-center text-slate-500">
               No trends found. Try refreshing.
           </div>
        )}
      </div>
    </div>
  );
};

export default TrendList;
