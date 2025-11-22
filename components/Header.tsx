import React from 'react';
import { Activity, BarChart2, Sparkles, TrendingUp } from 'lucide-react';
import { AppSection } from '../types';

interface HeaderProps {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setSection }) => {
  const navItems = [
    { id: AppSection.DASHBOARD, label: 'Hot List', icon: TrendingUp },
    { id: AppSection.ANALYSIS, label: 'Charts', icon: BarChart2 },
    { id: AppSection.AI_INSIGHTS, label: 'AI Analyst', icon: Sparkles },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-douyin-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setSection(AppSection.DASHBOARD)}>
             <div className="relative w-8 h-8 flex items-center justify-center">
                 {/* TikTok logo style glitch effect */}
                 <div className="absolute inset-0 bg-douyin-cyan rounded-full opacity-80 translate-x-[-2px] translate-y-[-2px]"></div>
                 <div className="absolute inset-0 bg-douyin-red rounded-full opacity-80 translate-x-[2px] translate-y-[2px]"></div>
                 <div className="relative z-10 bg-black w-full h-full rounded-full flex items-center justify-center border border-white/10">
                    <Activity className="w-5 h-5 text-white" />
                 </div>
             </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Douyin<span className="text-douyin-red">Pulse</span>
            </span>
          </div>
          
          {/* Nav */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-200
                  ${currentSection === item.id 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <item.icon className={`w-4 h-4 ${currentSection === item.id ? 'mr-2' : 'sm:mr-2'}`} />
                <span className={`${currentSection === item.id ? 'block' : 'hidden sm:block'}`}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;