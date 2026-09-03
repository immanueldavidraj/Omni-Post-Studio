import React, { useState } from 'react';
import { PlatformPostDraft, AspectRatio, ImageResolution, AnalysisResult } from '../types';
import { PlatformMockup } from './PlatformMockup';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  Maximize2,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Wand2,
  BarChart3,
  Edit3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface PlatformCardProps {
  post: PlatformPostDraft;
  onUpdatePost: (updated: PlatformPostDraft) => void;
  onOpenImageModal: (imageUrl: string, prompt: string) => void;
  onRegenerateImage: (platform: string, prompt: string, aspectRatio: AspectRatio, imageSize: ImageResolution) => Promise<void>;
  onQuickEdit: (platform: string, currentContent: string, instruction: string) => Promise<string>;
  onAnalyzePost: (platform: string, content: string) => Promise<AnalysisResult>;
}

const ALL_ASPECT_RATIOS: { id: AspectRatio; label: string; desc: string }[] = [
  { id: '1:1', label: '1:1', desc: 'Square (Instagram Post)' },
  { id: '16:9', label: '16:9', desc: 'Landscape (LinkedIn / Twitter Banner)' },
  { id: '4:3', label: '4:3', desc: 'Classic Feed Standard' },
  { id: '3:4', label: '3:4', desc: 'Vertical Portrait' },
  { id: '9:16', label: '9:16', desc: 'Full Story / Reel' },
  { id: '2:3', label: '2:3', desc: 'Tall Feed Portrait' },
  { id: '3:2', label: '3:2', desc: 'Horizontal Photography' },
  { id: '21:9', label: '21:9', desc: 'Ultra-wide Cinematic' },
];

export const PlatformCard: React.FC<PlatformCardProps> = ({
  post,
  onUpdatePost,
  onOpenImageModal,
  onRegenerateImage,
  onQuickEdit,
  onAnalyzePost,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'mockup' | 'audit'>('content');
  const [copied, setCopied] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [contentDraft, setContentDraft] = useState(post.content);
  const [showImageSettings, setShowImageSettings] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(post.aspectRatio || post.recommendedAspectRatio);
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>('1K');
  const [customImagePrompt, setCustomImagePrompt] = useState(post.imagePrompt);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [isQuickEditing, setIsQuickEditing] = useState(false);
  const [quickEditInstruction, setQuickEditInstruction] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync draft if prop changes
  React.useEffect(() => {
    setContentDraft(post.content);
    setCustomImagePrompt(post.imagePrompt);
  }, [post.content, post.imagePrompt]);

  const platformMeta = {
    linkedin: {
      name: 'LinkedIn',
      badge: 'Long-form Post',
      color: 'bg-[#0A66C2]',
      borderFocus: 'focus:border-[#0A66C2]',
      icon: 'in',
      charLimit: 3000,
      idealChars: '1,000 - 1,800',
      optimalAspect: '16:9',
    },
    twitter: {
      name: 'Twitter / X',
      badge: 'Short & Punchy',
      color: 'bg-black',
      borderFocus: 'focus:border-slate-900',
      icon: '𝕏',
      charLimit: 280,
      idealChars: '150 - 260',
      optimalAspect: '16:9',
    },
    instagram: {
      name: 'Instagram',
      badge: 'Visual-focused & Hashtags',
      color: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600',
      borderFocus: 'focus:border-rose-500',
      icon: 'IG',
      charLimit: 2200,
      idealChars: '400 - 900',
      optimalAspect: '1:1',
    },
  }[post.platform];

  const handleCopy = () => {
    const fullText = post.hashtags && post.hashtags.length > 0
      ? `${post.content}\n\n${post.hashtags.map(h => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
      : post.content;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveContent = () => {
    onUpdatePost({
      ...post,
      content: contentDraft,
      characterCount: contentDraft.length,
    });
    setIsEditingContent(false);
  };

  const handleTriggerQuickEdit = async (instruction: string) => {
    try {
      setIsQuickEditing(true);
      const revised = await onQuickEdit(post.platform, post.content, instruction);
      setContentDraft(revised);
      onUpdatePost({
        ...post,
        content: revised,
        characterCount: revised.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuickEditing(false);
      setQuickEditInstruction('');
    }
  };

  const handleTriggerAudit = async () => {
    try {
      setIsAnalyzing(true);
      setActiveTab('audit');
      const result = await onAnalyzePost(post.platform, post.content);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageRegen = async () => {
    try {
      setIsRegeneratingImage(true);
      await onRegenerateImage(post.platform, customImagePrompt, selectedAspectRatio, selectedResolution);
      onUpdatePost({
        ...post,
        aspectRatio: selectedAspectRatio,
        imagePrompt: customImagePrompt,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  // Character status for Twitter
  const isOverTwitterLimit = post.platform === 'twitter' && post.content.length > 280;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      {/* Platform Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-7 h-7 rounded-lg ${platformMeta.color} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
            {platformMeta.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-['Outfit']">
                {platformMeta.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/80 text-slate-700">
                {platformMeta.badge}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span className={isOverTwitterLimit ? 'text-rose-600 font-bold' : ''}>
                {post.content.length} / {platformMeta.charLimit} chars
              </span>
              <span>•</span>
              <span>Optimal Ratio: {platformMeta.optimalAspect}</span>
            </div>
          </div>
        </div>

        {/* View mode toggle tabs */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'content'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Edit draft content"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mockup')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'mockup'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Preview in social feed mockup"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Feed Preview</span>
          </button>
          <button
            type="button"
            onClick={handleTriggerAudit}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              activeTab === 'audit'
                ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Analyze post virality and engagement (gemini-3.1-pro-preview)"
          >
            <BarChart3 className="w-3 h-3" />
            <span className="hidden sm:inline">AI Audit</span>
          </button>
        </div>
      </div>

      {/* Main Body Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-4">
        {/* TAB 1: Editor */}
        {activeTab === 'content' && (
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Hook highlight */}
            {post.hook && (
              <div className="bg-indigo-50/70 p-3 rounded-lg border-l-4 border-indigo-500 text-xs">
                <span className="font-semibold text-indigo-900 block mb-0.5">Opening Hook:</span>
                <span className="text-indigo-800 font-medium">"{post.hook}"</span>
              </div>
            )}

            {/* Editable Content */}
            <div className="flex-1 min-h-[140px] flex flex-col">
              {isEditingContent ? (
                <div className="space-y-2 flex-1 flex flex-col">
                  <textarea
                    rows={8}
                    value={contentDraft}
                    onChange={(e) => setContentDraft(e.target.value)}
                    className="w-full flex-1 p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setContentDraft(post.content);
                        setIsEditingContent(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveContent}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingContent(true)}
                  className="group relative flex-1 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/30 hover:bg-white transition-all cursor-text text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line overflow-y-auto max-h-[260px]"
                  title="Click to edit text directly"
                >
                  {post.content}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    Click to edit
                  </div>
                </div>
              )}
            </div>

            {/* Hashtags display */}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-indigo-600 border border-slate-200"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}

            {/* Quick AI Polish Pill Bar (Powered by gemini-3.1-flash-lite) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5">
                <span className="flex items-center gap-1">
                  <Wand2 className="w-3 h-3 text-indigo-500" />
                  <span>AI Fast Polish (gemini-3.1-flash-lite):</span>
                </span>
                {isQuickEditing && <span className="animate-pulse text-indigo-600">Refining text...</span>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={isQuickEditing}
                  onClick={() => handleTriggerQuickEdit('Make this post significantly punchier with high-energy wording')}
                  className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/60 text-slate-600 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                  ⚡ Make punchier
                </button>
                {post.platform === 'twitter' ? (
                  <button
                    type="button"
                    disabled={isQuickEditing}
                    onClick={() => handleTriggerQuickEdit('Strictly condense this tweet so it is under 250 characters while retaining punch')}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/60 text-slate-600 hover:text-indigo-600 transition-colors disabled:opacity-50"
                  >
                    ✂️ Trim to &lt;280 chars
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isQuickEditing}
                    onClick={() => handleTriggerQuickEdit('Add a compelling question or call-to-action to spark discussion')}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/60 text-slate-600 hover:text-indigo-600 transition-colors disabled:opacity-50"
                  >
                    🎯 Add strong CTA
                  </button>
                )}
                <button
                  type="button"
                  disabled={isQuickEditing}
                  onClick={() => handleTriggerQuickEdit('Rephrase opening line into a viral curiosity-inducing hook')}
                  className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/60 text-slate-600 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                  🪝 Sharpen hook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Mockup Feed Preview */}
        {activeTab === 'mockup' && (
          <div className="space-y-2 flex-1">
            <PlatformMockup post={post} onOpenImageModal={onOpenImageModal} />
          </div>
        )}

        {/* TAB 3: AI Strategic Audit */}
        {activeTab === 'audit' && (
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] p-1">
            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-500">
                <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs font-medium text-slate-600">Auditing virality with gemini-3.1-pro-preview...</span>
              </div>
            ) : analysisResult ? (
              <div className="space-y-3">
                {/* Score bar */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">Algorithm Score</span>
                    <span className="text-2xl font-black text-slate-800 font-['Outfit']">
                      {analysisResult.overallScore}<span className="text-xs font-normal text-slate-400">/100</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">Hook Rating</span>
                    <span className="text-2xl font-black text-indigo-600 font-['Outfit']">
                      {analysisResult.hookRating}<span className="text-xs font-normal text-slate-400">/10</span>
                    </span>
                  </div>
                </div>

                {/* Readability & Engagement */}
                <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Readability:</span>
                    <span className="font-semibold text-slate-800">{analysisResult.readability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Predicted Reach:</span>
                    <span className="font-semibold text-emerald-600">{analysisResult.estimatedEngagement}</span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-500 space-y-1">
                  <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Key Strengths:
                  </span>
                  <ul className="text-xs text-emerald-800 space-y-1 pl-4 list-disc">
                    {analysisResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500 space-y-1">
                  <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                    Actionable Improvements:
                  </span>
                  <ul className="text-xs text-indigo-800 space-y-1 pl-4 list-disc">
                    {analysisResult.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <button
                  type="button"
                  onClick={handleTriggerAudit}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100"
                >
                  Run Gemini 3.1 Pro Strategic Audit
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tailored Image & Aspect Ratio Section */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-700 font-['Outfit']">
                Tailored Visual Asset
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                {selectedAspectRatio}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                {selectedResolution}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowImageSettings(!showImageSettings)}
              className="text-xs text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3 h-3" />
              <span>{showImageSettings ? 'Hide controls' : 'Ratio & Size'}</span>
              {showImageSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Aspect Ratio & Resolution Affordances (Mandated in Feature 1 & Feature 3) */}
          {showImageSettings && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              {/* Aspect Ratio selector: (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Aspect Ratio ({ALL_ASPECT_RATIOS.length} supported):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                  {ALL_ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.id}
                      type="button"
                      id={`aspect-btn-${post.platform}-${ar.id.replace(':', '-')}`}
                      onClick={() => setSelectedAspectRatio(ar.id)}
                      className={`px-2 py-1.5 rounded-lg border text-center font-mono text-[11px] transition-all ${
                        selectedAspectRatio === ar.id
                          ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                      title={ar.desc}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Size selector: (1K, 2K, 4K) */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">Image Resolution:</span>
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                  {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                    <button
                      key={res}
                      type="button"
                      id={`res-btn-${post.platform}-${res}`}
                      onClick={() => setSelectedResolution(res)}
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                        selectedResolution === res
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Prompt editor */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom Image Prompt:</label>
                <textarea
                  rows={2}
                  value={customImagePrompt}
                  onChange={(e) => setCustomImagePrompt(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Image Display Container */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
            {post.imageUrl ? (
              <div className="relative cursor-pointer" onClick={() => onOpenImageModal(post.imageUrl!, customImagePrompt)}>
                <img
                  src={post.imageUrl}
                  alt={`${post.platform} generated asset`}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-48 object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-semibold">
                  <Maximize2 className="w-4 h-4" />
                  <span>Click to expand</span>
                </div>
              </div>
            ) : (
              <div className="h-36 flex flex-col items-center justify-center text-slate-400 space-y-1 p-4 text-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-medium">No visual generated yet</span>
              </div>
            )}

            {/* Quick overlay buttons */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-1.5">
              <button
                type="button"
                id={`regen-image-${post.platform}`}
                disabled={isRegeneratingImage}
                onClick={handleImageRegen}
                className="px-2.5 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold backdrop-blur-sm shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                title="Regenerate with current aspect ratio & size"
              >
                <RefreshCw className={`w-3 h-3 ${isRegeneratingImage ? 'animate-spin' : ''}`} />
                <span>{isRegeneratingImage ? 'Generating...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="text-[11px] text-slate-500">
          {post.platformTips && post.platformTips[0] && (
            <span className="truncate max-w-[200px] sm:max-w-xs block" title={post.platformTips[0]}>
              💡 {post.platformTips[0]}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {post.imageUrl && (
            <a
              href={post.imageUrl}
              download={`${post.platform}-image-${selectedAspectRatio.replace(':', 'x')}.png`}
              className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <button
            type="button"
            id={`copy-post-${post.platform}`}
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm shadow-indigo-100"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
