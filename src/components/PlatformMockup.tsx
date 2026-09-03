import React from 'react';
import { PlatformPostDraft } from '../types';
import {
  ThumbsUp,
  MessageSquare,
  Repeat,
  Send,
  Heart,
  Bookmark,
  Share,
  MessageCircle,
  MoreHorizontal,
  CheckCircle2,
  Globe,
  BarChart2,
} from 'lucide-react';

interface PlatformMockupProps {
  post: PlatformPostDraft;
  onOpenImageModal?: (imageUrl: string, prompt: string) => void;
}

export const PlatformMockup: React.FC<PlatformMockupProps> = ({ post, onOpenImageModal }) => {
  const { platform, content, hashtags, imageUrl, aspectRatio } = post;

  // Aspect ratio styling class
  const getAspectClass = (ar: string) => {
    switch (ar) {
      case '1:1':
        return 'aspect-square';
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4]';
      case '9:16':
        return 'aspect-[9/16]';
      case '2:3':
        return 'aspect-[2/3]';
      case '3:2':
        return 'aspect-[3/2]';
      case '21:9':
        return 'aspect-[21/9]';
      default:
        return 'aspect-video';
    }
  };

  // LinkedIn Feed Mockup
  if (platform === 'linkedin') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-slate-900 font-sans text-xs sm:text-sm">
        {/* LinkedIn Author Header */}
        <div className="p-3.5 sm:p-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              JD
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-slate-900 text-sm">Jordan Davies</span>
                <span className="text-slate-400 text-xs">• 1st</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">Head of Product Strategy | Scaling SaaS & AI</p>
              <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-0.5">
                <span>1d</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* LinkedIn Content Text */}
        <div className="px-3.5 sm:px-4 pb-3 whitespace-pre-line text-slate-800 text-xs sm:text-sm leading-relaxed">
          {content}
          {hashtags && hashtags.length > 0 && (
            <div className="mt-2 text-blue-700 font-medium">
              {hashtags.map((h, i) => (
                <span key={i} className="mr-1.5 hover:underline cursor-pointer">
                  {h.startsWith('#') ? h : `#${h}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* LinkedIn Media Banner */}
        {imageUrl && (
          <div
            className={`w-full ${getAspectClass(aspectRatio)} bg-slate-900 overflow-hidden relative group cursor-pointer`}
            onClick={() => onOpenImageModal?.(imageUrl, post.imagePrompt)}
          >
            <img
              src={imageUrl}
              alt="LinkedIn visual asset"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
              Click to preview high-res
            </div>
          </div>
        )}

        {/* LinkedIn Reactions & Stats */}
        <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">👍</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px]">💡</span>
            <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px]">❤️</span>
            <span className="ml-1 text-slate-600 font-medium">342 reactions</span>
          </div>
          <div className="space-x-2">
            <span>48 comments</span>
            <span>•</span>
            <span>19 reposts</span>
          </div>
        </div>

        {/* LinkedIn Action Buttons */}
        <div className="px-2 py-1 border-t border-slate-100 flex items-center justify-around text-slate-600 font-medium text-xs">
          <button className="flex items-center space-x-1.5 py-2 px-3 rounded hover:bg-slate-100 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="hidden sm:inline">Like</span>
          </button>
          <button className="flex items-center space-x-1.5 py-2 px-3 rounded hover:bg-slate-100 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comment</span>
          </button>
          <button className="flex items-center space-x-1.5 py-2 px-3 rounded hover:bg-slate-100 transition-colors">
            <Repeat className="w-4 h-4" />
            <span className="hidden sm:inline">Repost</span>
          </button>
          <button className="flex items-center space-x-1.5 py-2 px-3 rounded hover:bg-slate-100 transition-colors">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    );
  }

  // Twitter / X Mockup
  if (platform === 'twitter') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 text-slate-900 font-sans text-xs sm:text-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
            𝕏
          </div>
          <div className="flex-1 min-w-0">
            {/* Author row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 truncate">
                <span className="font-bold text-slate-900 text-sm">Jordan Davies</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                <span className="text-slate-500 text-xs">@jordandavies</span>
                <span className="text-slate-400 text-xs">· 2h</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Tweet content */}
            <div className="mt-1 whitespace-pre-line text-slate-900 text-sm leading-relaxed">
              {content}
              {hashtags && hashtags.length > 0 && (
                <div className="mt-1.5 text-sky-600">
                  {hashtags.map((h, i) => (
                    <span key={i} className="mr-1.5 hover:underline cursor-pointer">
                      {h.startsWith('#') ? h : `#${h}`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Media Box */}
            {imageUrl && (
              <div
                className={`mt-3 rounded-2xl overflow-hidden border border-slate-200 ${getAspectClass(aspectRatio)} relative group cursor-pointer bg-slate-900`}
                onClick={() => onOpenImageModal?.(imageUrl, post.imagePrompt)}
              >
                <img
                  src={imageUrl}
                  alt="Twitter visual asset"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                  Click to preview
                </div>
              </div>
            )}

            {/* Twitter Engagement Bar */}
            <div className="mt-3 flex items-center justify-between text-slate-500 text-xs max-w-md pt-2 border-t border-slate-100">
              <button className="flex items-center space-x-1.5 hover:text-sky-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>38</span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-emerald-500 transition-colors">
                <Repeat className="w-4 h-4" />
                <span>84</span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-rose-500 transition-colors">
                <Heart className="w-4 h-4" />
                <span>612</span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-sky-500 transition-colors">
                <BarChart2 className="w-4 h-4" />
                <span>18.4K</span>
              </button>
              <div className="flex items-center space-x-2">
                <Bookmark className="w-4 h-4 hover:text-sky-500 cursor-pointer" />
                <Share className="w-4 h-4 hover:text-sky-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Instagram Feed Mockup
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden text-slate-900 font-sans text-xs sm:text-sm">
      {/* Instagram Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                JD
              </div>
            </div>
          </div>
          <div>
            <span className="font-semibold text-xs text-slate-900">jordandavies.studio</span>
            <p className="text-[10px] text-slate-400">Original audio</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Instagram Image Container (Optimal Square 1:1 or Selected Aspect Ratio) */}
      <div
        className={`w-full ${getAspectClass(aspectRatio)} bg-slate-950 relative group cursor-pointer overflow-hidden`}
        onClick={() => onOpenImageModal?.(imageUrl || '', post.imagePrompt)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Instagram visual asset"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            No image generated
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
          Click to view full image
        </div>
      </div>

      {/* Action Icons */}
      <div className="p-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-slate-800 hover:text-rose-500 cursor-pointer" />
            <MessageCircle className="w-5 h-5 text-slate-800 hover:text-slate-600 cursor-pointer" />
            <Send className="w-5 h-5 text-slate-800 hover:text-slate-600 cursor-pointer" />
          </div>
          <Bookmark className="w-5 h-5 text-slate-800 hover:text-slate-600 cursor-pointer" />
        </div>

        {/* Likes */}
        <p className="font-semibold text-xs text-slate-900 mb-1">1,482 likes</p>

        {/* Caption */}
        <div className="text-xs text-slate-800 leading-relaxed">
          <span className="font-semibold mr-1.5 text-slate-900">jordandavies.studio</span>
          <span className="whitespace-pre-line">{content}</span>
          {hashtags && hashtags.length > 0 && (
            <div className="mt-2 text-slate-500 space-x-1">
              {hashtags.map((h, i) => (
                <span key={i} className="text-indigo-600 font-medium hover:underline cursor-pointer">
                  {h.startsWith('#') ? h : `#${h}`}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mt-2 mb-1 cursor-pointer">View all 62 comments</p>
        <p className="text-[9px] text-slate-400 uppercase tracking-wider">3 hours ago</p>
      </div>
    </div>
  );
};
