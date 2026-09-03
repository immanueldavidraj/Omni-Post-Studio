import React from 'react';
import { Sparkles, Layers, History, RefreshCw, Share2 } from 'lucide-react';

interface HeaderProps {
  hasResults: boolean;
  onReset: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  hasResults,
  onReset,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-md text-white">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-800 font-['Outfit']">
                SocialCraft <span className="text-indigo-600">AI</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Omni-Post Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Simultaneous content & aspect-ratio image generation for LinkedIn, Twitter, and Instagram
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {historyCount > 0 && (
            <button
              id="history-toggle-btn"
              onClick={onOpenHistory}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="View past generations"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>History</span>
              <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-800 text-[10px] flex items-center justify-center font-bold">
                {historyCount}
              </span>
            </button>
          )}

          {hasResults && (
            <button
              id="header-new-draft-btn"
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 transition-colors border border-slate-200 hover:border-indigo-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Draft</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
