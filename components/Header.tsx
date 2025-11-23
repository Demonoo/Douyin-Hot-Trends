
import React from 'react';
import { BarChart2, Sparkles, TrendingUp, Settings } from 'lucide-react';
import { AppSection } from '../types';

interface HeaderProps {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setSection, onOpenSettings }) => {
  const navItems = [
    { id: AppSection.DASHBOARD, label: 'Hot List', icon: TrendingUp },
    { id: AppSection.ANALYSIS, label: 'Charts', icon: BarChart2 },
    { id: AppSection.AI_INSIGHTS, label: 'AI Analyst', icon: Sparkles },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-douyin-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - DMEDIA Redesign */}
          <div className="flex flex-col justify-center cursor-pointer group" onClick={() => setSection(AppSection.DASHBOARD)}>
            {/* First Line: DMEDIA */}
            <span className="text-2xl font-black tracking-[0.15em] text-white leading-none group-hover:text-douyin-cyan transition-colors duration-300">
              DMEDIA
            </span>
            
            {/* Second Line: AI + Bars */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 group-hover:text-white transition-colors">AI</span>
              {/* Gradient Bars Icon */}
              <div className="flex flex-col gap-[3px]">
                <div className="w-3 h-[2px] bg-slate-700 rounded-full group-hover:bg-douyin-cyan/50 transition-colors delay-75"></div>
                <div className="w-6 h-[2px] bg-gradient-to-r from-douyin-cyan to-douyin-red rounded-full shadow-[0_0_5px_rgba(37,244,238,0.5)]"></div>
                <div className="w-4 h-[2px] bg-slate-700 rounded-full group-hover:bg-douyin-red/50 transition-colors delay-100"></div>
              </div>
            </div>
          </div>
          
          {/* Nav */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200
                  ${currentSection === item.id 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <item.icon className={`w-4 h-4 ${currentSection === item.id ? 'mr-1 sm:mr-2' : 'sm:mr-2'}`} />
                <span className={`${currentSection === item.id ? 'block' : 'hidden sm:block'}`}>{item.label}</span>
              </button>
            ))}
            
            {/* Settings/Key Button */}
            <button
               onClick={onOpenSettings}
               className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5 ml-2"
               title="Set API Key"
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
