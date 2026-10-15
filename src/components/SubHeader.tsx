import { TrendingDown, Star, Tv, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubHeaderProps {
  favoritesCount?: number;
  onFavoritesClick?: () => void;
  onDroppingOddsClick?: () => void;
  onWhereToWatchClick?: () => void;
  onHistoryClick?: () => void;
  isDroppingOddsActive?: boolean;
}

export const SubHeader = ({
  favoritesCount = 0,
  onFavoritesClick,
  onDroppingOddsClick,
  onWhereToWatchClick,
  onHistoryClick,
  isDroppingOddsActive = false
}: SubHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#3557c7] text-white text-xs border-t border-blue-400/20 select-none">
      <div className="max-w-[1540px] mx-auto px-4 h-11 flex items-center justify-between">
        {/* Football Only navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold bg-white text-[#4169e1] shadow-xs cursor-pointer transition-all"
          >
            <span className="text-xs">⚽</span>
            <span>Football</span>
          </button>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-5 shrink-0 pl-4">
          <button
            onClick={() => {
              onDroppingOddsClick?.();
              navigate('/dropping-odds');
            }}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer group ${
              isDroppingOddsActive ? 'text-amber-300 font-bold' : 'text-white/90 hover:text-white'
            }`}
          >
            <TrendingDown className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${
              isDroppingOddsActive ? 'text-amber-300' : 'text-blue-200'
            }`} />
            <span className="font-medium">Dropping odds</span>
          </button>

          <button
            onClick={() => {
              onFavoritesClick?.();
              navigate('/favourites');
            }}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer group"
          >
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Favourites</span>
            {favoritesCount > 0 && (
              <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onWhereToWatchClick}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer group"
          >
            <Tv className="w-3.5 h-3.5 text-blue-200 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Where to Watch (TV Guide)</span>
          </button>

          <button
            onClick={() => {
              onHistoryClick?.();
              navigate('/history');
            }}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer group"
          >
            <Receipt className="w-3.5 h-3.5 text-blue-200 group-hover:scale-110 transition-transform" />
            <span className="font-medium">History & Deposits</span>
          </button>
        </div>
      </div>
    </div>
  );
};
