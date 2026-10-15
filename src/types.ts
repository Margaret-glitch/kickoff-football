export interface Match {
  id: string;
  time: string;
  day?: string;
  date?: string;
  status: 'FT' | 'LIVE' | 'UPCOMING';
  homeTeam: string;
  homeFlag: string;
  homeScore?: number;
  awayTeam: string;
  awayFlag: string;
  awayScore?: number;
  hasRedCard?: boolean;
  redCardTeam?: 'home' | 'away';
  isFavorite?: boolean;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface LeagueGroup {
  id: string;
  name: string;
  region: string;
  matchCount: number;
  isExpanded: boolean;
  subGroups: {
    title: string;
    matches: Match[];
  }[];
}

export interface TransferItem {
  id: string;
  playerName: string;
  fromTeam: string;
  fromLogo: string;
  toTeam: string;
  toLogo: string;
  fee: string;
  avatarUrl: string;
}

export interface TopPerformance {
  rank: number;
  name: string;
  position: string;
  matchInfo: string;
  homeScore: number;
  awayScore: number;
  rating: number;
  avatarUrl: string;
  clubLogo: string;
}

export type StakeStatus = 'Ongoing' | 'Win' | 'Loss' | 'Completed' | 'Credited' | 'Pending' | 'Processed';
export type HistoryType = 'deposit' | 'bet' | 'payout' | 'bonus';

export interface StakingRecord {
  id: string;
  type?: HistoryType;
  title?: string;
  description?: string;
  amount?: number;
  amountNGN?: number;
  reference?: string;
  paymentMethod?: string;
  date?: string;

  // Staking/betting properties
  matchTitle?: string;
  market?: string;
  odds?: number;
  stakeAmount?: number;
  potentialPayout?: number;
  status: StakeStatus;
  placedTime: string;
  matchScore?: string;
  liveTime?: string;
}

export type HistoryRecord = StakingRecord;

export interface TopCompetition {
  id: string;
  name: string;
  displayName: string;
  badgeUrl: string;
  region: string;
  isFavorite?: boolean;
}

export interface CountryLeagueGroup {
  countryCode: string;
  countryName: string;
  flagUrl: string;
  matchCount: number;
  isExpanded?: boolean;
  leagues: {
    id: string;
    name: string;
    matchCount: number;
  }[];
}

export interface TickerMatch {
  id: string;
  time: string;
  home: string;
  away: string;
  score?: string;
  status: 'LIVE' | 'FT' | 'UPCOMING';
  competition: string;
}
