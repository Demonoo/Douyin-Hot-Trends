
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendItem, ClusterCategory } from '../types';
import { Bot, LayoutGrid, BarChart2, Loader2, RefreshCw, Layers } from 'lucide-react';
import { clusterTrendsWithAI } from '../services/geminiService';

interface TrendChartProps {
  trends: TrendItem[];
}

const TrendChart: React.FC<TrendChartProps> = ({ trends }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'cluster'>('chart');
  const [clusters, setClusters] = useState<ClusterCategory[]>([]);
  const [isClustering, setIsClustering] = useState(false);
  const [hasClustered, setHasClustered] = useState(false);

  // Data for Bar Chart (Heat Map)
  const chartData = trends.slice(0, 10).map(t => ({
    name: t.word.length > 8 ? t.word.substring(0, 8) + '...' : t.word,
    fullName: t.word,
    value: t.hot_value,
    color: t.position <= 3 ? '#FE2C55' : '#25F4EE'
  }));

  const handleClusterAnalysis = async () => {
    if (hasClustered && clusters.length > 0) {
        setViewMode('cluster');
        return;
    }
    
    setIsClustering(true);
    setViewMode('cluster');
    try {
      const result = await clusterTrendsWithAI(trends);
      setClusters(result);
      setHasClustered(true);
    } catch (error) {
      console.error("Failed to cluster", error);
    } finally {
      setIsClustering(false);
    }
  };

  const formatNumber = (num: number) => {
      return (num / 10000).toFixed(1) + 'w';
  };

  return (
    <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto min-h-screen flex flex-col">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    Deep Analysis
                    {viewMode === 'cluster' && <span className="text-xs bg-douyin-red px-2 py-1 rounded text-white">AI Powered</span>}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    {viewMode === 'chart' 
                        ? "Comparing heat values of the top 10 viral topics." 
                        : "Semantic grouping of all 50 topics using Gemini AI."}
                </p>
            </div>

            <div className="flex bg-douyin-card border border-white/10 p-1 rounded-lg">
                <button
                    onClick={() => setViewMode('chart')}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'chart' 
                        ? 'bg-white/10 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Heat Map
                </button>
                <button
                    onClick={handleClusterAnalysis}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'cluster' 
                        ? 'bg-douyin-cyan/20 text-douyin-cyan border border-douyin-cyan/30' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                >
                    {isClustering ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Layers className="w-4 h-4 mr-2" />}
                    Topic Clusters
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
            {viewMode === 'chart' && (
                <>
                    <div className="bg-douyin-card border border-white/10 rounded-2xl p-6 shadow-xl h-[60vh] w-full animate-fade-in">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={100} 
                                    tick={{fill: '#9ca3af', fontSize: 12}} 
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                                    formatter={(value: number) => [`${(value/10000).toFixed(1)}w`, 'Hot Value']}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-douyin-card p-6 rounded-xl border border-white/5">
                            <h3 className="text-slate-400 text-sm uppercase font-bold">Top Heat Score</h3>
                            <div className="text-3xl font-mono text-douyin-red mt-2">
                                {(chartData[0]?.value / 10000).toFixed(1)}w
                            </div>
                        </div>
                        <div className="bg-douyin-card p-6 rounded-xl border border-white/5">
                            <h3 className="text-slate-400 text-sm uppercase font-bold">Average Heat (Top 10)</h3>
                            <div className="text-3xl font-mono text-white mt-2">
                                {(chartData.reduce((acc, cur) => acc + cur.value, 0) / 10 / 10000).toFixed(1)}w
                            </div>
                        </div>
                        <div className="bg-douyin-card p-6 rounded-xl border border-white/5">
                            <h3 className="text-slate-400 text-sm uppercase font-bold">Viral Factor</h3>
                            <div className="text-3xl font-mono text-douyin-cyan mt-2">High</div>
                        </div>
                    </div>
                </>
            )}

            {viewMode === 'cluster' && (
                <div className="w-full min-h-[60vh]">
                    {isClustering ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                            <Bot className="w-16 h-16 text-douyin-cyan animate-bounce mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-2">AI is Analyzing Trends...</h3>
                            <p className="text-slate-400 max-w-md">Gemini is reading the top 50 topics and grouping them into semantic categories.</p>
                        </div>
                    ) : clusters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                            {clusters.map((cluster, idx) => (
                                <div key={cluster.id} className="bg-douyin-card border border-white/10 rounded-2xl overflow-hidden hover:border-douyin-cyan/30 transition-colors group flex flex-col h-[400px]">
                                    {/* Card Header */}
                                    <div className="p-4 border-b border-white/5 bg-white/5">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-douyin-cyan transition-colors">{cluster.name}</h3>
                                            <span className="text-xs font-mono bg-black/50 px-2 py-1 rounded text-douyin-red">
                                                {cluster.percentage}% Vol
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-1">{cluster.description}</p>
                                    </div>
                                    
                                    {/* Trends List */}
                                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                        {cluster.trends.map((trend) => (
                                            <div key={trend.position} className="flex items-start gap-3 group/item">
                                                <span className={`text-xs font-bold mt-0.5 min-w-[20px] ${trend.position <= 3 ? 'text-douyin-red' : 'text-slate-600'}`}>
                                                    {trend.position}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-300 group-hover/item:text-white transition-colors leading-tight">
                                                        {trend.word}
                                                    </p>
                                                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                                                        Heat: {formatNumber(trend.hot_value)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="p-3 bg-black/20 text-center text-[10px] text-slate-500 uppercase tracking-widest border-t border-white/5">
                                        {cluster.trends.length} Topics
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         // Fallback / Empty state if something fails but isn't loading
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                           <Bot className="w-12 h-12 mb-4 opacity-20" />
                           <p>Analysis ready to start.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default TrendChart;
