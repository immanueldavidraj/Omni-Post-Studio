/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SocialPlatform,
  Tone,
  ImageResolution,
  AspectRatio,
  PlatformPostDraft,
  GenerationResponse,
  GenerationHistoryItem,
  AnalysisResult,
} from './types';
import { Header } from './components/Header';
import { IdeaInput } from './components/IdeaInput';
import { PlatformCard } from './components/PlatformCard';
import { ImageModal } from './components/ImageModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  Sparkles,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Eye,
  LayoutGrid,
  AlertCircle,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'socialcraft_history_v1';

export default function App() {
  const [currentGeneration, setCurrentGeneration] = useState<GenerationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<SocialPlatform>('linkedin');
  const [batchProgress, setBatchProgress] = useState<string>('');

  // Image modal state
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    prompt: string;
    platform: string;
    aspectRatio: string;
  }>({
    isOpen: false,
    imageUrl: '',
    prompt: '',
    platform: '',
    aspectRatio: '16:9',
  });

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read history from localStorage:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (gen: GenerationResponse) => {
    try {
      const newItem: GenerationHistoryItem = {
        id: `gen-${Date.now()}`,
        timestamp: Date.now(),
        idea: gen.idea,
        tone: gen.tone,
        posts: gen.posts,
      };
      const updated = [newItem, ...history.filter(h => h.idea !== gen.idea)].slice(0, 20);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist history:', e);
    }
  };

  // Main Generation Orchestrator
  const handleGenerate = async (
    idea: string,
    tone: Tone,
    resolution: ImageResolution,
    model: string
  ) => {
    setIsGenerating(true);
    setError(null);
    setBatchProgress('Synthesizing platform-optimized copy for LinkedIn, Twitter, and Instagram...');

    try {
      // 1. Generate text posts for all 3 platforms simultaneously
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, tone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate posts.');
      }

      const generatedData: GenerationResponse = await res.json();
      setCurrentGeneration(generatedData);

      // 2. Simultaneously generate unique tailored images for each platform
      setBatchProgress('Drafts ready! Now generating 3 unique aspect-ratio images in parallel...');

      const platforms: SocialPlatform[] = ['linkedin', 'twitter', 'instagram'];

      // Generate all 3 images in parallel
      const imagePromises = platforms.map(async (platform) => {
        const post = generatedData.posts[platform];
        try {
          const imgRes = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: post.imagePrompt,
              platform,
              aspectRatio: post.aspectRatio || post.recommendedAspectRatio,
              imageSize: resolution,
              model,
            }),
          });
          const imgData = await imgRes.json();
          return { platform, imageUrl: imgData.imageUrl };
        } catch (imgErr) {
          console.error(`Error generating image for ${platform}:`, imgErr);
          return { platform, imageUrl: null };
        }
      });

      const imageResults = await Promise.all(imagePromises);

      // Update state with generated images
      setCurrentGeneration((prev) => {
        if (!prev) return prev;
        const updatedPosts = { ...prev.posts };
        imageResults.forEach(({ platform, imageUrl }) => {
          if (imageUrl && updatedPosts[platform]) {
            updatedPosts[platform] = {
              ...updatedPosts[platform],
              imageUrl,
            };
          }
        });
        const finalGen = { ...prev, posts: updatedPosts };
        saveToHistory(finalGen);
        return finalGen;
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating content. Please check your settings or try again.');
    } finally {
      setIsGenerating(false);
      setBatchProgress('');
    }
  };

  // Update a single platform's draft in state
  const handleUpdatePost = (updated: PlatformPostDraft) => {
    if (!currentGeneration) return;
    const next = {
      ...currentGeneration,
      posts: {
        ...currentGeneration.posts,
        [updated.platform]: updated,
      },
    };
    setCurrentGeneration(next);
    saveToHistory(next);
  };

  // Regenerate image for specific platform
  const handleRegenerateImage = async (
    platform: string,
    prompt: string,
    aspectRatio: AspectRatio,
    imageSize: ImageResolution
  ) => {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        platform,
        aspectRatio,
        imageSize,
      }),
    });
    const data = await res.json();
    if (data.imageUrl && currentGeneration) {
      const p = platform as SocialPlatform;
      const updated = {
        ...currentGeneration.posts[p],
        imageUrl: data.imageUrl,
        aspectRatio,
      };
      handleUpdatePost(updated);
    }
  };

  // Fast AI Edit (gemini-3.1-flash-lite)
  const handleQuickEdit = async (
    platform: string,
    currentContent: string,
    instruction: string
  ): Promise<string> => {
    const res = await fetch('/api/edit-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform,
        currentContent,
        instruction,
      }),
    });
    const data = await res.json();
    return data.revisedContent || currentContent;
  };

  // Strategic Post Analysis (gemini-3.1-pro-preview)
  const handleAnalyzePost = async (
    platform: string,
    content: string
  ): Promise<AnalysisResult> => {
    const res = await fetch('/api/analyze-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform,
        content,
        tone: currentGeneration?.tone || 'professional',
      }),
    });
    return await res.json();
  };

  // Copy all drafts in one go
  const handleCopyAll = () => {
    if (!currentGeneration) return;
    const { linkedin, twitter, instagram } = currentGeneration.posts;
    const combined = `=== LINKEDIN ===\n${linkedin.content}\n\n${(linkedin.hashtags || []).join(' ')}\n\n=== TWITTER / X ===\n${twitter.content}\n\n${(twitter.hashtags || []).join(' ')}\n\n=== INSTAGRAM ===\n${instagram.content}\n\n${(instagram.hashtags || []).join(' ')}`;
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans antialiased text-slate-900">
      {/* App Header */}
      <Header
        hasResults={!!currentGeneration}
        onReset={() => setCurrentGeneration(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Generation Notice</p>
              <p className="text-rose-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-900 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input & Configuration Section */}
        <section aria-label="Social media content input">
          <IdeaInput onGenerate={handleGenerate} isLoading={isGenerating} />
        </section>

        {/* Status progress bar during generation */}
        {isGenerating && batchProgress && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center space-x-3 animate-pulse">
            <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              {batchProgress}
            </span>
          </div>
        )}

        {/* Results Showcase Section */}
        {currentGeneration && (
          <section className="space-y-4" aria-label="Generated social media drafts">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500">Active Tone:</span>
                <span className="capitalize font-bold text-xs sm:text-sm text-indigo-700 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
                  {currentGeneration.tone}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-600 truncate max-w-[200px] sm:max-w-md font-medium">
                  "{currentGeneration.idea}"
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="copy-all-btn"
                  onClick={handleCopyAll}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm shadow-indigo-100"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'All Copied' : 'Copy All 3 Posts'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex rounded-xl bg-slate-200 p-1 text-xs font-semibold">
              {(['linkedin', 'twitter', 'instagram'] as SocialPlatform[]).map((plat) => (
                <button
                  key={plat}
                  onClick={() => setActiveMobileTab(plat)}
                  className={`flex-1 py-2 text-center rounded-lg capitalize transition-all ${
                    activeMobileTab === plat
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {plat === 'twitter' ? 'Twitter / X' : plat}
                </button>
              ))}
            </div>

            {/* Desktop 3-Column Grid / Mobile Single View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* LinkedIn Column */}
              <div className={activeMobileTab !== 'linkedin' ? 'hidden lg:block' : 'block'}>
                <PlatformCard
                  post={currentGeneration.posts.linkedin}
                  onUpdatePost={handleUpdatePost}
                  onOpenImageModal={(url, prompt) =>
                    setModalData({
                      isOpen: true,
                      imageUrl: url,
                      prompt,
                      platform: 'LinkedIn',
                      aspectRatio: currentGeneration.posts.linkedin.aspectRatio || '16:9',
                    })
                  }
                  onRegenerateImage={handleRegenerateImage}
                  onQuickEdit={handleQuickEdit}
                  onAnalyzePost={handleAnalyzePost}
                />
              </div>

              {/* Twitter / X Column */}
              <div className={activeMobileTab !== 'twitter' ? 'hidden lg:block' : 'block'}>
                <PlatformCard
                  post={currentGeneration.posts.twitter}
                  onUpdatePost={handleUpdatePost}
                  onOpenImageModal={(url, prompt) =>
                    setModalData({
                      isOpen: true,
                      imageUrl: url,
                      prompt,
                      platform: 'Twitter / X',
                      aspectRatio: currentGeneration.posts.twitter.aspectRatio || '16:9',
                    })
                  }
                  onRegenerateImage={handleRegenerateImage}
                  onQuickEdit={handleQuickEdit}
                  onAnalyzePost={handleAnalyzePost}
                />
              </div>

              {/* Instagram Column */}
              <div className={activeMobileTab !== 'instagram' ? 'hidden lg:block' : 'block'}>
                <PlatformCard
                  post={currentGeneration.posts.instagram}
                  onUpdatePost={handleUpdatePost}
                  onOpenImageModal={(url, prompt) =>
                    setModalData({
                      isOpen: true,
                      imageUrl: url,
                      prompt,
                      platform: 'Instagram',
                      aspectRatio: currentGeneration.posts.instagram.aspectRatio || '1:1',
                    })
                  }
                  onRegenerateImage={handleRegenerateImage}
                  onQuickEdit={handleQuickEdit}
                  onAnalyzePost={handleAnalyzePost}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Image Zoom & Details Modal */}
      <ImageModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        imageUrl={modalData.imageUrl}
        prompt={modalData.prompt}
        platform={modalData.platform}
        aspectRatio={modalData.aspectRatio}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setCurrentGeneration({
            idea: item.idea,
            tone: item.tone,
            posts: item.posts,
          });
        }}
        onClear={() => {
          setHistory([]);
          localStorage.removeItem(STORAGE_KEY);
        }}
      />
    </div>
  );
}
