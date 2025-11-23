
import React, { useState } from 'react';
import { Key, Lock, Save, X, ExternalLink, Bot } from 'lucide-react';
import { saveApiKey } from '../services/deepseekService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (key.trim().length > 5) {
      saveApiKey(key.trim());
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-douyin-card border border-white/10 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(37,244,238,0.15)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-douyin-cyan" />
            配置 DeepSeek API
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            要使用 AI 趋势分析和智能聚类功能，请输入有效的 <strong>DeepSeek API Key</strong>。
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
             <Lock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
             <p className="text-xs text-blue-200/80">
               您的 Key 仅存储在浏览器的本地存储 (LocalStorage) 中，并直接与 DeepSeek API 通信，不会经过我们的服务器。
             </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">DeepSeek API Key</label>
            <input 
              type="password" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-douyin-cyan focus:ring-1 focus:ring-douyin-cyan focus:outline-none transition-all font-mono"
            />
          </div>
          
          <a 
            href="https://platform.deepseek.com/api_keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-xs text-douyin-cyan hover:underline"
          >
            去 DeepSeek 官网获取 Key <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 border-t border-white/5 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={key.length < 5}
            className="flex items-center px-6 py-2 bg-douyin-red text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-4 h-4 mr-2" />
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;