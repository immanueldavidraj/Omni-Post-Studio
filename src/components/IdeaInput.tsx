import React, { useState } from 'react';
import { Tone, ImageResolution } from '../types';
import { Sparkles, Briefcase, Laugh, AlertCircle, Compass, BookOpen, Coffee, Sliders, Image as ImageIcon } from 'lucide-react';

interface IdeaInputProps {
  onGenerate: (idea: string, tone: Tone, imageResolution: ImageResolution, imageModel: string) => void;
  isLoading: boolean;
}

const TONES: { id: Tone; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  {
    id: 'professional',
    label: 'Professional',
    desc: 'Thoughtful, authoritative, value-driven',
    icon: Briefcase,
  },
  {
    id: 'witty',
    label: 'Witty',
    desc: 'Clever, humorous, personality-packed',
    icon: Laugh,
  },
  {
    id: 'urgent',
    label: 'Urgent',
    desc: 'High stakes, immediate action, FOMO',
    icon: AlertCircle,
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    desc: 'Uplifting, visionary, motivating',
    icon: Compass,
  },
  {
    id: 'educational',
    label: 'Educational',
    desc: 'Actionable frameworks, step-by-step',
    icon: BookOpen,
  },
  {
    id: 'casual',
    label: 'Casual',
    desc: 'Authentic, conversational, friendly',
    icon: Coffee,
  },
];

const SAMPLE_IDEAS = [
  'Launching an AI-driven async productivity dashboard for distributed teams',
  '3 counter-intuitive leadership lessons learned from scaling past $1M ARR',
  'Why most modern website redesigns fail to boost actual conversion rates',
  'Behind the scenes of how we built our entire backend in 48 hours',
];

export const IdeaInput: React.FC<IdeaInputProps> = ({ onGenerate, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('professional');
  const [imageResolution, setImageResolution] = useState<ImageResolution>('1K');
  const [imageModel, setImageModel] = useState<'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview'>('gemini-3-pro-image-preview');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;
    onGenerate(idea.trim(), selectedTone, imageResolution, imageModel);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Idea prompt text area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="idea-input-field" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Idea <span className="normal-case font-normal text-slate-400">(Concept, announcement, insight, or story)</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {idea.length} chars
            </span>
          </div>

          <div className="relative">
            <textarea
              id="idea-input-field"
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., We just launched an AI feature that turns meeting transcripts into automated Jira tasks in 10 seconds. Here are 3 big lessons we learned about LLM latency..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base leading-relaxed resize-y transition-all bg-white"
              required
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium mr-1">Quick ideas:</span>
            {SAMPLE_IDEAS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                id={`sample-idea-${idx}`}
                onClick={() => setIdea(sample)}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 truncate max-w-[260px] text-left"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Desired Tone
            </label>
            <span className="text-xs text-slate-500 font-medium">
              Adapts vocabulary, pacing, and hooks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {TONES.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  id={`tone-select-${t.id}`}
                  onClick={() => setSelectedTone(t.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <span className={`text-xs font-bold font-['Outfit'] mb-0.5 ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {t.label}
                  </span>
                  <span className={`text-[11px] leading-tight line-clamp-2 ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Generation Affordances (Resolution & Model) */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Image Resolution */}
            <div className="flex items-center space-x-2">
              <label htmlFor="resolution-select" className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Image Size:</span>
              </label>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5" id="resolution-select">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    id={`res-btn-${res}`}
                    onClick={() => setImageResolution(res)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      imageResolution === res
                        ? 'bg-white text-indigo-600 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced toggle */}
            <button
              type="button"
              id="toggle-advanced-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1 font-medium transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide advanced' : 'Advanced settings'}</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="generate-all-btn"
            disabled={isLoading || !idea.trim()}
            className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating 3 Posts & Visuals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Generate Cross-Platform Posts & Images</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Advanced Settings */}
        {showAdvanced && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="font-semibold text-slate-800">Advanced Engine Preferences:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Image Generation Model</label>
                <select
                  id="image-model-select"
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview (Studio Quality, 1K-4K)</option>
                  <option value="gemini-3.1-flash-image-preview">gemini-3.1-flash-image-preview (Fast Generation)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Default: studio-quality model with automated optimal aspect ratios for LinkedIn (16:9), Twitter (16:9), and Instagram (1:1).
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Copywriting & Intelligence Models</label>
                <div className="space-y-1 font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <div>• Multi-platform synthesis: <span className="font-semibold text-slate-900">gemini-3.5-flash</span></div>
                  <div>• Real-time quick edits: <span className="font-semibold text-slate-900">gemini-3.1-flash-lite</span></div>
                  <div>• Algorithmic audit & virality: <span className="font-semibold text-slate-900">gemini-3.1-pro-preview</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
