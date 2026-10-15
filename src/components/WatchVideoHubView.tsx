import { useState } from 'react';
import { Play, Eye, Clock, X, ShieldCheck } from 'lucide-react';
import { WATCH_VIDEOS, WatchVideoItem } from '../data/extendedFootballData';

export const WatchVideoHubView = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [playingVideo, setPlayingVideo] = useState<WatchVideoItem | null>(null);

  const categories = ['All', 'Highlights', 'Interviews', 'Originals', 'Shows'];

  const filteredVideos = activeCategory === 'All'
    ? WATCH_VIDEOS
    : WATCH_VIDEOS.filter((v) => v.category === activeCategory);

  return (
    <div className="space-y-5 pb-12 select-none">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">ONEKICKX Video & Highlights Hub</h1>
            <p className="text-xs text-slate-500">
              Authorized match highlights, post-match reaction, and original tactical breakdowns
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Licensed & Authorized Content</span>
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setPlayingVideo(vid)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-rose-400 transition-all cursor-pointer group flex flex-col"
          >
            <div className="h-44 relative bg-slate-900 overflow-hidden">
              <img
                src={vid.thumbnail}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {vid.duration}
              </span>
              <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                {vid.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
                {vid.title}
              </h3>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  {vid.views}
                </span>
                <span>{vid.publishedTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-slate-800 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <h3 className="text-sm font-bold truncate pr-4">{playingVideo.title}</h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Embed / Responsive Container */}
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                src={playingVideo.videoUrl}
                title={playingVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-slate-950 text-slate-300 text-xs flex items-center justify-between">
              <span>{playingVideo.views} · {playingVideo.publishedTime}</span>
              <span className="text-rose-400 font-bold">{playingVideo.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
