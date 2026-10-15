import { useState } from 'react';
import { Newspaper, ExternalLink, Clock, Tag } from 'lucide-react';
import { NEWS_ARTICLES, NewsArticle } from '../data/extendedFootballData';

interface NewsFeedViewProps {
  onOpenTeam?: (teamId: string) => void;
}

export const NewsFeedView = ({ onOpenTeam }: NewsFeedViewProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Breaking',
    'Transfers',
    'MLS',
    'European',
    'African',
    'International',
    'Team News'
  ];

  const filteredArticles = activeCategory === 'All'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-5 pb-12 select-none">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4169e1]">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">ONEKICKX Football News</h1>
            <p className="text-xs text-slate-500">
              Verified breaking reports, transfer exclusives, and continental coverage
            </p>
          </div>
        </div>

        {/* Source Compliance Note */}
        <span className="text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Source attributed · Licensed sports wires & official team feeds
        </span>
      </div>

      {/* Category Filter Pills (Functional Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#4169e1] text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-[#4169e1] transition-all flex flex-col group"
          >
            <div className="h-44 relative overflow-hidden bg-slate-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                {article.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs md:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#4169e1] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              {/* Related Teams Tags */}
              {article.relatedTeams && article.relatedTeams.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {article.relatedTeams.map((team) => (
                    <span
                      key={team}
                      onClick={() => onOpenTeam?.(team.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              )}

              {/* Source & External Link Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{article.source}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.publishedAt}
                  </span>
                </div>

                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-[#4169e1] hover:underline"
                >
                  <span>Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
