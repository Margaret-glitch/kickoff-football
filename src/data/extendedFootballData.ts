export interface LeagueDetail {
  id: string;
  name: string;
  shortName: string;
  country: string;
  countryCode: string;
  logo: string;
  season: string;
  standings: {
    rank: number;
    team: string;
    teamId: string;
    logo: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
  }[];
  topScorers: {
    rank: number;
    name: string;
    playerId: string;
    team: string;
    teamLogo: string;
    goals: number;
    assists: number;
    penalties: number;
    matches: number;
  }[];
  stats: {
    avgGoalsPerMatch: number;
    homeWinPercentage: number;
    awayWinPercentage: number;
    drawPercentage: number;
    cleanSheetsRate: number;
    bttsRate: number;
  };
}

export interface TeamDetail {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  country: string;
  countryCode: string;
  league: string;
  leagueId: string;
  stadium: string;
  capacity: string;
  manager: string;
  founded: number;
  leagueRank: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  stats: {
    goalsScored: number;
    goalsConceded: number;
    cleanSheets: number;
    avgPossession: number;
    winRate: number;
  };
  squad: {
    id: string;
    name: string;
    number: number;
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    nationality: string;
    flagCode: string;
    age: number;
    goals?: number;
    assists?: number;
    rating: number;
  }[];
}

export interface PlayerDetail {
  id: string;
  name: string;
  fullName: string;
  team: string;
  teamId: string;
  teamLogo: string;
  number: number;
  position: string;
  nationality: string;
  flagCode: string;
  age: number;
  height: string;
  foot: 'Right' | 'Left' | 'Both';
  avatarUrl: string;
  seasonStats: {
    appearances: number;
    minutes: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    shotsPerGame: number;
    passAccuracy: number;
    rating: number;
  };
  recentPerformances: {
    match: string;
    date: string;
    score: string;
    rating: number;
    goals: number;
    assists: number;
    minutes: number;
  }[];
}

export interface NewsArticle {
  id: string;
  category: 'Breaking' | 'Transfers' | 'MLS' | 'European' | 'African' | 'International' | 'Team News' | 'Player News';
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  imageUrl: string;
  readTime: string;
  relatedTeams?: string[];
}

export interface BroadcastGuideItem {
  id: string;
  matchId: string;
  matchTitle: string;
  league: string;
  kickoffTime: string;
  countries: {
    countryCode: 'US' | 'GB' | 'NG' | 'CA' | 'ES' | 'DE' | 'GLOBAL';
    countryName: string;
    flag: string;
    broadcaster: string;
    platformType: 'TV Channel' | 'Streaming App' | 'Free-to-Air';
    isFree: boolean;
    streamUrl: string;
  }[];
}

export interface WatchVideoItem {
  id: string;
  title: string;
  category: 'Highlights' | 'Interviews' | 'Shows' | 'Replays' | 'Originals';
  duration: string;
  thumbnail: string;
  videoUrl: string;
  publishedTime: string;
  views: string;
  matchInfo?: string;
  league?: string;
}

export interface MatchPrediction {
  matchId: string;
  matchTitle: string;
  league: string;
  homeProb: number;
  drawProb: number;
  awayProb: number;
  predictedScore: string;
  over25Prob: number;
  under25Prob: number;
  bttsYesProb: number;
  bttsNoProb: number;
  keyInsights: string[];
  confidence: 'High' | 'Medium' | 'Speculative';
}

// -------------------------------------------------------------
// 1. LEAGUES & COMPETITIONS DATA
// -------------------------------------------------------------
export const LEAGUES_DATA: Record<string, LeagueDetail> = {
  'mls': {
    id: 'mls',
    name: 'Major League Soccer',
    shortName: 'MLS',
    country: 'United States',
    countryCode: 'us',
    logo: 'https://crests.football-data.org/mls.png',
    season: '2026 Season',
    standings: [
      { rank: 1, team: 'Inter Miami CF', teamId: 'inter-miami', logo: 'https://crests.football-data.org/inter-miami.png', played: 30, won: 20, drawn: 5, lost: 5, gf: 68, ga: 39, gd: 29, points: 65, form: ['W', 'W', 'W', 'D', 'W'] },
      { rank: 2, team: 'Columbus Crew', teamId: 'columbus-crew', logo: 'https://crests.football-data.org/columbus.png', played: 30, won: 18, drawn: 6, lost: 6, gf: 58, ga: 32, gd: 26, points: 60, form: ['W', 'D', 'W', 'W', 'L'] },
      { rank: 3, team: 'LA Galaxy', teamId: 'la-galaxy', logo: 'https://crests.football-data.org/galaxy.png', played: 30, won: 17, drawn: 7, lost: 6, gf: 61, ga: 44, gd: 17, points: 58, form: ['L', 'W', 'W', 'D', 'W'] },
      { rank: 4, team: 'FC Cincinnati', teamId: 'cincinnati', logo: 'https://crests.football-data.org/cincinnati.png', played: 30, won: 17, drawn: 5, lost: 8, gf: 51, ga: 40, gd: 11, points: 56, form: ['W', 'L', 'W', 'D', 'W'] },
      { rank: 5, team: 'Los Angeles FC', teamId: 'lafc', logo: 'https://crests.football-data.org/lafc.png', played: 30, won: 16, drawn: 7, lost: 7, gf: 55, ga: 38, gd: 17, points: 55, form: ['D', 'W', 'L', 'W', 'W'] },
      { rank: 6, team: 'New York Red Bulls', teamId: 'ny-redbulls', logo: 'https://crests.football-data.org/nyrb.png', played: 30, won: 13, drawn: 9, lost: 8, gf: 46, ga: 36, gd: 10, points: 48, form: ['D', 'D', 'W', 'L', 'D'] }
    ],
    topScorers: [
      { rank: 1, name: 'Lionel Messi', playerId: 'messi', team: 'Inter Miami CF', teamLogo: 'https://crests.football-data.org/inter-miami.png', goals: 22, assists: 14, penalties: 1, matches: 24 },
      { rank: 2, name: 'Luis Suárez', playerId: 'suarez', team: 'Inter Miami CF', teamLogo: 'https://crests.football-data.org/inter-miami.png', goals: 19, assists: 8, penalties: 2, matches: 27 },
      { rank: 3, name: 'Denis Bouanga', playerId: 'bouanga', team: 'Los Angeles FC', teamLogo: 'https://crests.football-data.org/lafc.png', goals: 18, assists: 9, penalties: 3, matches: 29 },
      { rank: 4, name: 'Cucho Hernández', playerId: 'cucho', team: 'Columbus Crew', teamLogo: 'https://crests.football-data.org/columbus.png', goals: 17, assists: 10, penalties: 4, matches: 26 }
    ],
    stats: {
      avgGoalsPerMatch: 3.12,
      homeWinPercentage: 48,
      awayWinPercentage: 29,
      drawPercentage: 23,
      cleanSheetsRate: 24,
      bttsRate: 61
    }
  },
  'premier-league': {
    id: 'premier-league',
    name: 'Premier League',
    shortName: 'PL',
    country: 'England',
    countryCode: 'gb-eng',
    logo: 'https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png',
    season: '2026/27 Season',
    standings: [
      { rank: 1, team: 'Arsenal', teamId: 'arsenal', logo: 'https://crests.football-data.org/57.png', played: 8, won: 6, drawn: 2, lost: 0, gf: 19, ga: 6, gd: 13, points: 20, form: ['W', 'W', 'W', 'D', 'W'] },
      { rank: 2, team: 'Manchester City', teamId: 'man-city', logo: 'https://crests.football-data.org/65.png', played: 8, won: 6, drawn: 1, lost: 1, gf: 21, ga: 8, gd: 13, points: 19, form: ['W', 'W', 'L', 'W', 'W'] },
      { rank: 3, team: 'Liverpool', teamId: 'liverpool', logo: 'https://crests.football-data.org/64.png', played: 8, won: 6, drawn: 0, lost: 2, gf: 18, ga: 9, gd: 9, points: 18, form: ['W', 'W', 'W', 'L', 'W'] },
      { rank: 4, team: 'Chelsea', teamId: 'chelsea', logo: 'https://crests.football-data.org/61.png', played: 8, won: 4, drawn: 2, lost: 2, gf: 16, ga: 11, gd: 5, points: 14, form: ['L', 'W', 'W', 'D', 'W'] },
      { rank: 5, team: 'Tottenham Hotspur', teamId: 'tottenham', logo: 'https://crests.football-data.org/73.png', played: 8, won: 4, drawn: 1, lost: 3, gf: 15, ga: 12, gd: 3, points: 13, form: ['L', 'W', 'L', 'W', 'W'] },
      { rank: 6, team: 'Aston Villa', teamId: 'aston-villa', logo: 'https://crests.football-data.org/58.png', played: 8, won: 4, drawn: 1, lost: 3, gf: 13, ga: 12, gd: 1, points: 13, form: ['W', 'D', 'L', 'W', 'L'] }
    ],
    topScorers: [
      { rank: 1, name: 'Erling Haaland', playerId: 'haaland', team: 'Manchester City', teamLogo: 'https://crests.football-data.org/65.png', goals: 10, assists: 2, penalties: 2, matches: 8 },
      { rank: 2, name: 'Bukayo Saka', playerId: 'saka', team: 'Arsenal', teamLogo: 'https://crests.football-data.org/57.png', goals: 7, assists: 6, penalties: 1, matches: 8 },
      { rank: 3, name: 'Cole Palmer', playerId: 'palmer', team: 'Chelsea', teamLogo: 'https://crests.football-data.org/61.png', goals: 6, assists: 5, penalties: 2, matches: 8 },
      { rank: 4, name: 'Mohamed Salah', playerId: 'salah', team: 'Liverpool', teamLogo: 'https://crests.football-data.org/64.png', goals: 6, assists: 4, penalties: 1, matches: 8 }
    ],
    stats: {
      avgGoalsPerMatch: 2.85,
      homeWinPercentage: 44,
      awayWinPercentage: 33,
      drawPercentage: 23,
      cleanSheetsRate: 31,
      bttsRate: 54
    }
  },
  'la-liga': {
    id: 'la-liga',
    name: 'LaLiga',
    shortName: 'LaLiga',
    country: 'Spain',
    countryCode: 'es',
    logo: 'https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png',
    season: '2026/27 Season',
    standings: [
      { rank: 1, team: 'Barcelona', teamId: 'barcelona', logo: 'https://crests.football-data.org/81.png', played: 9, won: 8, drawn: 0, lost: 1, gf: 28, ga: 9, gd: 19, points: 24, form: ['W', 'W', 'W', 'W', 'L'] },
      { rank: 2, team: 'Real Madrid', teamId: 'real-madrid', logo: 'https://crests.football-data.org/86.png', played: 9, won: 7, drawn: 1, lost: 1, gf: 22, ga: 8, gd: 14, points: 22, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 3, team: 'Atlético Madrid', teamId: 'atletico', logo: 'https://crests.football-data.org/78.png', played: 9, won: 5, drawn: 3, lost: 1, gf: 17, ga: 9, gd: 8, points: 18, form: ['L', 'D', 'W', 'W', 'D'] },
      { rank: 4, team: 'Athletic Club', teamId: 'athletic-club', logo: 'https://crests.football-data.org/77.png', played: 9, won: 5, drawn: 2, lost: 2, gf: 15, ga: 10, gd: 5, points: 17, form: ['W', 'D', 'W', 'W', 'L'] }
    ],
    topScorers: [
      { rank: 1, name: 'Robert Lewandowski', playerId: 'lewandowski', team: 'Barcelona', teamLogo: 'https://crests.football-data.org/81.png', goals: 11, assists: 3, penalties: 2, matches: 9 },
      { rank: 2, name: 'Kylian Mbappé', playerId: 'mbappe', team: 'Real Madrid', teamLogo: 'https://crests.football-data.org/86.png', goals: 8, assists: 2, penalties: 3, matches: 9 },
      { rank: 3, name: 'Lamine Yamal', playerId: 'yamal', team: 'Barcelona', teamLogo: 'https://crests.football-data.org/81.png', goals: 6, assists: 7, penalties: 0, matches: 9 },
      { rank: 4, name: 'Vinícius Júnior', playerId: 'vinicius', team: 'Real Madrid', teamLogo: 'https://crests.football-data.org/86.png', goals: 6, assists: 5, penalties: 1, matches: 9 }
    ],
    stats: {
      avgGoalsPerMatch: 2.72,
      homeWinPercentage: 46,
      awayWinPercentage: 28,
      drawPercentage: 26,
      cleanSheetsRate: 34,
      bttsRate: 51
    }
  },
  'champions-league': {
    id: 'champions-league',
    name: 'UEFA Champions League',
    shortName: 'UCL',
    country: 'Europe',
    countryCode: 'eu',
    logo: 'https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png',
    season: '2026/27 League Phase',
    standings: [
      { rank: 1, team: 'Manchester City', teamId: 'man-city', logo: 'https://crests.football-data.org/65.png', played: 3, won: 3, drawn: 0, lost: 0, gf: 11, ga: 1, gd: 10, points: 9, form: ['W', 'W', 'W'] },
      { rank: 2, team: 'Real Madrid', teamId: 'real-madrid', logo: 'https://crests.football-data.org/86.png', played: 3, won: 3, drawn: 0, lost: 0, gf: 9, ga: 2, gd: 7, points: 9, form: ['W', 'W', 'W'] },
      { rank: 3, team: 'Arsenal', teamId: 'arsenal', logo: 'https://crests.football-data.org/57.png', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 1, gd: 6, points: 7, form: ['W', 'D', 'W'] },
      { rank: 4, team: 'Bayern München', teamId: 'bayern', logo: 'https://crests.football-data.org/5.png', played: 3, won: 2, drawn: 0, lost: 1, gf: 10, ga: 4, gd: 6, points: 6, form: ['W', 'L', 'W'] },
      { rank: 5, team: 'Barcelona', teamId: 'barcelona', logo: 'https://crests.football-data.org/81.png', played: 3, won: 2, drawn: 0, lost: 1, gf: 8, ga: 3, gd: 5, points: 6, form: ['L', 'W', 'W'] },
      { rank: 6, team: 'Inter', teamId: 'inter', logo: 'https://crests.football-data.org/108.png', played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 1, gd: 4, points: 7, form: ['D', 'W', 'W'] }
    ],
    topScorers: [
      { rank: 1, name: 'Harry Kane', playerId: 'kane', team: 'Bayern München', teamLogo: 'https://crests.football-data.org/5.png', goals: 5, assists: 1, penalties: 2, matches: 3 },
      { rank: 2, name: 'Erling Haaland', playerId: 'haaland', team: 'Manchester City', teamLogo: 'https://crests.football-data.org/65.png', goals: 4, assists: 1, penalties: 1, matches: 3 },
      { rank: 3, name: 'Kylian Mbappé', playerId: 'mbappe', team: 'Real Madrid', teamLogo: 'https://crests.football-data.org/86.png', goals: 4, assists: 0, penalties: 1, matches: 3 }
    ],
    stats: {
      avgGoalsPerMatch: 3.25,
      homeWinPercentage: 51,
      awayWinPercentage: 30,
      drawPercentage: 19,
      cleanSheetsRate: 29,
      bttsRate: 58
    }
  },
  'african-competitions': {
    id: 'african-competitions',
    name: 'CAF Champions League & NPFL',
    shortName: 'CAF / Africa',
    country: 'Africa',
    countryCode: 'ng',
    logo: 'https://r2.thesportsdb.com/images/media/league/badge/k4hgin1590183498.png',
    season: '2026 Season',
    standings: [
      { rank: 1, team: 'Al Ahly SC', teamId: 'al-ahly', logo: 'https://crests.football-data.org/alahly.png', played: 6, won: 5, drawn: 1, lost: 0, gf: 14, ga: 3, gd: 11, points: 16, form: ['W', 'W', 'W', 'D', 'W'] },
      { rank: 2, team: 'Mamelodi Sundowns', teamId: 'sundowns', logo: 'https://crests.football-data.org/sundowns.png', played: 6, won: 4, drawn: 2, lost: 0, gf: 12, ga: 4, gd: 8, points: 14, form: ['W', 'D', 'W', 'W', 'D'] },
      { rank: 3, team: 'Espérance de Tunis', teamId: 'esperance', logo: 'https://crests.football-data.org/est.png', played: 6, won: 4, drawn: 1, lost: 1, gf: 9, ga: 4, gd: 5, points: 13, form: ['W', 'W', 'L', 'W', 'D'] },
      { rank: 4, team: 'Enyimba FC', teamId: 'enyimba', logo: 'https://crests.football-data.org/enyimba.png', played: 6, won: 3, drawn: 2, lost: 1, gf: 8, ga: 5, gd: 3, points: 11, form: ['W', 'D', 'W', 'D', 'L'] },
      { rank: 5, team: 'Rangers International', teamId: 'rangers-intl', logo: 'https://crests.football-data.org/rangers.png', played: 6, won: 3, drawn: 1, lost: 2, gf: 7, ga: 6, gd: 1, points: 10, form: ['L', 'W', 'W', 'D', 'W'] },
      { rank: 6, team: 'Remo Stars FC', teamId: 'remo-stars', logo: 'https://crests.football-data.org/remo.png', played: 6, won: 3, drawn: 0, lost: 3, gf: 8, ga: 8, gd: 0, points: 9, form: ['W', 'L', 'W', 'L', 'W'] }
    ],
    topScorers: [
      { rank: 1, name: 'Hussein El Shahat', playerId: 'el-shahat', team: 'Al Ahly SC', teamLogo: 'https://crests.football-data.org/alahly.png', goals: 6, assists: 3, penalties: 1, matches: 6 },
      { rank: 2, name: 'Peter Shalulile', playerId: 'shalulile', team: 'Mamelodi Sundowns', teamLogo: 'https://crests.football-data.org/sundowns.png', goals: 5, assists: 2, penalties: 0, matches: 6 },
      { rank: 3, name: 'Chijioke Mbaoma', playerId: 'mbaoma', team: 'Enyimba FC', teamLogo: 'https://crests.football-data.org/enyimba.png', goals: 5, assists: 1, penalties: 2, matches: 6 }
    ],
    stats: {
      avgGoalsPerMatch: 2.35,
      homeWinPercentage: 54,
      awayWinPercentage: 20,
      drawPercentage: 26,
      cleanSheetsRate: 38,
      bttsRate: 43
    }
  }
};

// -------------------------------------------------------------
// 2. TEAMS DATA
// -------------------------------------------------------------
export const TEAMS_DATA: Record<string, TeamDetail> = {
  'arsenal': {
    id: 'arsenal',
    name: 'Arsenal FC',
    shortName: 'ARS',
    logo: 'https://crests.football-data.org/57.png',
    country: 'England',
    countryCode: 'gb-eng',
    league: 'Premier League',
    leagueId: 'premier-league',
    stadium: 'Emirates Stadium, London',
    capacity: '60,704',
    manager: 'Mikel Arteta',
    founded: 1886,
    leagueRank: 1,
    points: 20,
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 19,
      goalsConceded: 6,
      cleanSheets: 5,
      avgPossession: 61.4,
      winRate: 75.0
    },
    squad: [
      { id: 'p-raya', name: 'David Raya', number: 22, position: 'GK', nationality: 'Spain', flagCode: 'es', age: 31, rating: 8.1 },
      { id: 'p-saliba', name: 'William Saliba', number: 2, position: 'DEF', nationality: 'France', flagCode: 'fr', age: 25, rating: 8.5 },
      { id: 'p-gabriel', name: 'Gabriel Magalhães', number: 6, position: 'DEF', nationality: 'Brazil', flagCode: 'br', age: 28, goals: 2, rating: 8.3 },
      { id: 'p-white', name: 'Ben White', number: 4, position: 'DEF', nationality: 'England', flagCode: 'gb-eng', age: 28, rating: 7.6 },
      { id: 'p-rice', name: 'Declan Rice', number: 41, position: 'MID', nationality: 'England', flagCode: 'gb-eng', age: 27, goals: 2, assists: 3, rating: 8.4 },
      { id: 'p-odegaard', name: 'Martin Ødegaard', number: 8, position: 'MID', nationality: 'Norway', flagCode: 'no', age: 27, goals: 3, assists: 4, rating: 8.6 },
      { id: 'p-merino', name: 'Mikel Merino', number: 23, position: 'MID', nationality: 'Spain', flagCode: 'es', age: 30, goals: 1, assists: 1, rating: 7.7 },
      { id: 'p-saka', name: 'Bukayo Saka', number: 7, position: 'FWD', nationality: 'England', flagCode: 'gb-eng', age: 25, goals: 7, assists: 6, rating: 8.9 },
      { id: 'p-havertz', name: 'Kai Havertz', number: 29, position: 'FWD', nationality: 'Germany', flagCode: 'de', age: 27, goals: 5, assists: 2, rating: 8.0 },
      { id: 'p-martinelli', name: 'Gabriel Martinelli', number: 11, position: 'FWD', nationality: 'Brazil', flagCode: 'br', age: 25, goals: 3, assists: 3, rating: 7.9 }
    ]
  },
  'chelsea': {
    id: 'chelsea',
    name: 'Chelsea FC',
    shortName: 'CHE',
    logo: 'https://crests.football-data.org/61.png',
    country: 'England',
    countryCode: 'gb-eng',
    league: 'Premier League',
    leagueId: 'premier-league',
    stadium: 'Stamford Bridge, London',
    capacity: '40,341',
    manager: 'Enzo Maresca',
    founded: 1905,
    leagueRank: 4,
    points: 14,
    form: ['L', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 16,
      goalsConceded: 11,
      cleanSheets: 3,
      avgPossession: 58.2,
      winRate: 50.0
    },
    squad: [
      { id: 'p-sanchez', name: 'Robert Sánchez', number: 1, position: 'GK', nationality: 'Spain', flagCode: 'es', age: 28, rating: 7.4 },
      { id: 'p-colwill', name: 'Levi Colwill', number: 6, position: 'DEF', nationality: 'England', flagCode: 'gb-eng', age: 23, rating: 7.8 },
      { id: 'p-fofana', name: 'Wesley Fofana', number: 29, position: 'DEF', nationality: 'France', flagCode: 'fr', age: 25, rating: 7.5 },
      { id: 'p-caicedo', name: 'Moisés Caicedo', number: 25, position: 'MID', nationality: 'Ecuador', flagCode: 'ec', age: 24, goals: 1, rating: 8.2 },
      { id: 'p-palmer', name: 'Cole Palmer', number: 20, position: 'MID', nationality: 'England', flagCode: 'gb-eng', age: 24, goals: 6, assists: 5, rating: 8.8 },
      { id: 'p-jackson', name: 'Nicolas Jackson', number: 15, position: 'FWD', nationality: 'Senegal', flagCode: 'sn', age: 25, goals: 4, assists: 2, rating: 7.7 }
    ]
  },
  'barcelona': {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'BAR',
    logo: 'https://crests.football-data.org/81.png',
    country: 'Spain',
    countryCode: 'es',
    league: 'LaLiga',
    leagueId: 'la-liga',
    stadium: 'Spotify Camp Nou, Barcelona',
    capacity: '105,000',
    manager: 'Hansi Flick',
    founded: 1899,
    leagueRank: 1,
    points: 24,
    form: ['W', 'W', 'W', 'W', 'L'],
    stats: {
      goalsScored: 28,
      goalsConceded: 9,
      cleanSheets: 4,
      avgPossession: 64.8,
      winRate: 88.8
    },
    squad: [
      { id: 'p-terstegen', name: 'Marc-André ter Stegen', number: 1, position: 'GK', nationality: 'Germany', flagCode: 'de', age: 34, rating: 8.0 },
      { id: 'p-cubarsi', name: 'Pau Cubarsí', number: 2, position: 'DEF', nationality: 'Spain', flagCode: 'es', age: 19, rating: 8.2 },
      { id: 'p-kounde', name: 'Jules Koundé', number: 23, position: 'DEF', nationality: 'France', flagCode: 'fr', age: 27, rating: 8.1 },
      { id: 'p-pedri', name: 'Pedri', number: 8, position: 'MID', nationality: 'Spain', flagCode: 'es', age: 23, goals: 3, assists: 4, rating: 8.7 },
      { id: 'p-yamal', name: 'Lamine Yamal', number: 19, position: 'FWD', nationality: 'Spain', flagCode: 'es', age: 19, goals: 6, assists: 7, rating: 9.1 },
      { id: 'p-lewandowski', name: 'Robert Lewandowski', number: 9, position: 'FWD', nationality: 'Poland', flagCode: 'pl', age: 38, goals: 11, assists: 3, rating: 8.9 },
      { id: 'p-raphinha', name: 'Raphinha', number: 11, position: 'FWD', nationality: 'Brazil', flagCode: 'br', age: 29, goals: 6, assists: 5, rating: 8.6 }
    ]
  },
  'inter-miami': {
    id: 'inter-miami',
    name: 'Inter Miami CF',
    shortName: 'MIA',
    logo: 'https://crests.football-data.org/inter-miami.png',
    country: 'United States',
    countryCode: 'us',
    league: 'Major League Soccer',
    leagueId: 'mls',
    stadium: 'Chase Stadium, Fort Lauderdale',
    capacity: '21,550',
    manager: 'Tata Martino',
    founded: 2018,
    leagueRank: 1,
    points: 65,
    form: ['W', 'W', 'W', 'D', 'W'],
    stats: {
      goalsScored: 68,
      goalsConceded: 39,
      cleanSheets: 8,
      avgPossession: 59.3,
      winRate: 66.7
    },
    squad: [
      { id: 'p-callender', name: 'Drake Callender', number: 1, position: 'GK', nationality: 'USA', flagCode: 'us', age: 29, rating: 7.5 },
      { id: 'p-alba', name: 'Jordi Alba', number: 18, position: 'DEF', nationality: 'Spain', flagCode: 'es', age: 37, goals: 4, assists: 9, rating: 8.3 },
      { id: 'p-busquets', name: 'Sergio Busquets', number: 5, position: 'MID', nationality: 'Spain', flagCode: 'es', age: 38, rating: 8.0 },
      { id: 'p-redondo', name: 'Federico Redondo', number: 55, position: 'MID', nationality: 'Argentina', flagCode: 'ar', age: 23, rating: 7.7 },
      { id: 'p-messi', name: 'Lionel Messi', number: 10, position: 'FWD', nationality: 'Argentina', flagCode: 'ar', age: 39, goals: 22, assists: 14, rating: 9.4 },
      { id: 'p-suarez', name: 'Luis Suárez', number: 9, position: 'FWD', nationality: 'Uruguay', flagCode: 'uy', age: 39, goals: 19, assists: 8, rating: 8.6 }
    ]
  }
};

// -------------------------------------------------------------
// 3. PLAYERS DATA
// -------------------------------------------------------------
export const PLAYERS_DATA: Record<string, PlayerDetail> = {
  'saka': {
    id: 'saka',
    name: 'Bukayo Saka',
    fullName: 'Bukayo Ayoyinka T. M. Saka',
    team: 'Arsenal FC',
    teamId: 'arsenal',
    teamLogo: 'https://crests.football-data.org/57.png',
    number: 7,
    position: 'Right Winger',
    nationality: 'England',
    flagCode: 'gb-eng',
    age: 25,
    height: '1.78 m',
    foot: 'Left',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/bvm4vi1788550565.png',
    seasonStats: {
      appearances: 8,
      minutes: 712,
      goals: 7,
      assists: 6,
      yellowCards: 1,
      redCards: 0,
      shotsPerGame: 2.8,
      passAccuracy: 86.4,
      rating: 8.9
    },
    recentPerformances: [
      { match: 'Arsenal 2 - 1 Chelsea', date: 'Today', score: '2-1', rating: 9.1, goals: 1, assists: 1, minutes: 74 },
      { match: 'Arsenal 2 - 0 PSG', date: '01 Oct 2026', score: '2-0', rating: 8.7, goals: 1, assists: 0, minutes: 90 },
      { match: 'Arsenal 4 - 2 Leicester', date: '28 Sep 2026', score: '4-2', rating: 8.9, goals: 1, assists: 2, minutes: 90 }
    ]
  },
  'messi': {
    id: 'messi',
    name: 'Lionel Messi',
    fullName: 'Lionel Andrés Messi',
    team: 'Inter Miami CF',
    teamId: 'inter-miami',
    teamLogo: 'https://crests.football-data.org/inter-miami.png',
    number: 10,
    position: 'Forward / Playmaker',
    nationality: 'Argentina',
    flagCode: 'ar',
    age: 39,
    height: '1.70 m',
    foot: 'Left',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/khc46s1725657673.png',
    seasonStats: {
      appearances: 24,
      minutes: 2010,
      goals: 22,
      assists: 14,
      yellowCards: 0,
      redCards: 0,
      shotsPerGame: 4.2,
      passAccuracy: 88.9,
      rating: 9.4
    },
    recentPerformances: [
      { match: 'Inter Miami 3 - 2 Columbus', date: '03 Oct 2026', score: '3-2', rating: 9.6, goals: 2, assists: 1, minutes: 90 },
      { match: 'Inter Miami 1 - 1 Charlotte', date: '29 Sep 2026', score: '1-1', rating: 8.8, goals: 1, assists: 0, minutes: 90 }
    ]
  },
  'yamal': {
    id: 'yamal',
    name: 'Lamine Yamal',
    fullName: 'Lamine Yamal Nasraoui Ebana',
    team: 'FC Barcelona',
    teamId: 'barcelona',
    teamLogo: 'https://crests.football-data.org/81.png',
    number: 19,
    position: 'Right Winger',
    nationality: 'Spain',
    flagCode: 'es',
    age: 19,
    height: '1.80 m',
    foot: 'Left',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/d1t2ik1787691507.png',
    seasonStats: {
      appearances: 9,
      minutes: 785,
      goals: 6,
      assists: 7,
      yellowCards: 2,
      redCards: 0,
      shotsPerGame: 3.4,
      passAccuracy: 84.8,
      rating: 9.1
    },
    recentPerformances: [
      { match: 'Barcelona 2 - 0 Sevilla', date: 'Today', score: '2-0', rating: 8.9, goals: 1, assists: 1, minutes: 38 },
      { match: 'Barcelona 5 - 0 Young Boys', date: '01 Oct 2026', score: '5-0', rating: 9.2, goals: 1, assists: 2, minutes: 75 }
    ]
  }
};

// -------------------------------------------------------------
// 4. NEWS ARTICLES DATA (With Authorized Source Attributions)
// -------------------------------------------------------------
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'n-1',
    category: 'Breaking',
    title: 'Arsenal Surge Ahead in High-Stakes London Derby as Saka Shines',
    summary: 'Mikel Arteta praises tactical bravery as the Gunners maintain top spot in the Premier League following a commanding second-half display at Emirates Stadium.',
    source: 'BBC Sport',
    sourceUrl: 'https://www.bbc.com/sport/football',
    publishedAt: '25 mins ago',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    relatedTeams: ['Arsenal', 'Chelsea']
  },
  {
    id: 'n-2',
    category: 'MLS',
    title: 'Inter Miami Secure MLS Supporters Shield in Dramatic Fashion',
    summary: 'Lionel Messi and Luis Suárez inspire a remarkable comeback victory to hoist another historic trophy ahead of the 2026 MLS Cup Playoffs.',
    source: 'MLSsoccer.com',
    sourceUrl: 'https://www.mlssoccer.com',
    publishedAt: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    relatedTeams: ['Inter Miami CF', 'Columbus Crew']
  },
  {
    id: 'n-3',
    category: 'Transfers',
    title: 'Enzo Fernández Links to Manchester City in Blockbuster 145M € Move',
    summary: 'Reports indicate advanced negotiations between Chelsea and Premier League champions for the Argentine midfielder ahead of the winter transfer window.',
    source: 'The Athletic',
    sourceUrl: 'https://theathletic.com/football',
    publishedAt: '3 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    relatedTeams: ['Chelsea', 'Manchester City']
  },
  {
    id: 'n-4',
    category: 'African',
    title: 'CAF Champions League: Al Ahly and Sundowns Set Benchmark in Group Stage',
    summary: 'The continental heavyweights claim decisive clean-sheet victories while Enyimba and Remo Stars battle for qualification spots in tight encounters.',
    source: 'CAF Online',
    sourceUrl: 'https://www.cafonline.com',
    publishedAt: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    relatedTeams: ['Al Ahly SC', 'Mamelodi Sundowns', 'Enyimba FC']
  },
  {
    id: 'n-5',
    category: 'European',
    title: 'Lamine Yamal & Robert Lewandowski Lead Barcelona to Clinical Victory',
    summary: 'Hansi Flick’s fluid attacking philosophy yields another dominant showing as Barcelona remain undefeated domestically in an electric start to the season.',
    source: 'Reuters Sports',
    sourceUrl: 'https://www.reuters.com/lifestyle/sports/',
    publishedAt: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
    relatedTeams: ['Barcelona', 'Sevilla']
  },
  {
    id: 'n-6',
    category: 'International',
    title: 'UEFA Nations League: France Edge Italy in Tactical Battle of Titans',
    summary: 'Didier Deschamps orchestrates an emphatic win featuring dynamic midfield pressing as Les Bleus book their semifinal qualification spot.',
    source: 'UEFA.com',
    sourceUrl: 'https://www.uefa.com',
    publishedAt: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
    relatedTeams: ['France', 'Italy']
  }
];

// -------------------------------------------------------------
// 5. WHERE TO WATCH BROADCAST GUIDE DATA
// -------------------------------------------------------------
export const BROADCAST_GUIDE: BroadcastGuideItem[] = [
  {
    id: 'bg-1',
    matchId: 'pl-1',
    matchTitle: 'Arsenal vs Chelsea',
    league: 'Premier League',
    kickoffTime: 'Today, 17:30 BST / 12:30 EDT',
    countries: [
      { countryCode: 'US', countryName: 'United States', flag: '🇺🇸', broadcaster: 'Peacock / NBC Sports', platformType: 'Streaming App', isFree: false, streamUrl: 'https://www.peacocktv.com/sports' },
      { countryCode: 'GB', countryName: 'United Kingdom', flag: '🇬🇧', broadcaster: 'Sky Sports Premier League', platformType: 'TV Channel', isFree: false, streamUrl: 'https://www.skysports.com' },
      { countryCode: 'NG', countryName: 'Nigeria', flag: '🇳🇬', broadcaster: 'SuperSport Premier League', platformType: 'TV Channel', isFree: false, streamUrl: 'https://supersport.com' },
      { countryCode: 'CA', countryName: 'Canada', flag: '🇨🇦', broadcaster: 'FuboTV Canada', platformType: 'Streaming App', isFree: false, streamUrl: 'https://www.fubo.tv/canada' }
    ]
  },
  {
    id: 'bg-2',
    matchId: 'mls-inter',
    matchTitle: 'Inter Miami vs Columbus Crew',
    league: 'Major League Soccer',
    kickoffTime: 'Tomorrow, 19:30 EDT / 00:30 BST',
    countries: [
      { countryCode: 'US', countryName: 'United States', flag: '🇺🇸', broadcaster: 'Apple TV (MLS Season Pass)', platformType: 'Streaming App', isFree: false, streamUrl: 'https://tv.apple.com/channel/tvs.sbd.7000' },
      { countryCode: 'GB', countryName: 'United Kingdom', flag: '🇬🇧', broadcaster: 'Apple TV (MLS Season Pass)', platformType: 'Streaming App', isFree: false, streamUrl: 'https://tv.apple.com' },
      { countryCode: 'NG', countryName: 'Nigeria', flag: '🇳🇬', broadcaster: 'Apple TV (MLS Season Pass)', platformType: 'Streaming App', isFree: false, streamUrl: 'https://tv.apple.com' },
      { countryCode: 'GLOBAL', countryName: 'Worldwide (Free Match)', flag: '🌍', broadcaster: 'Apple TV (Select Free Matches)', platformType: 'Free-to-Air', isFree: true, streamUrl: 'https://tv.apple.com' }
    ]
  },
  {
    id: 'bg-3',
    matchId: 'laliga-bar-sev',
    matchTitle: 'Barcelona vs Sevilla',
    league: 'LaLiga',
    kickoffTime: 'Today, 21:00 CEST / 15:00 EDT',
    countries: [
      { countryCode: 'US', countryName: 'United States', flag: '🇺🇸', broadcaster: 'ESPN+ / ESPN Deportes', platformType: 'Streaming App', isFree: false, streamUrl: 'https://plus.espn.com' },
      { countryCode: 'GB', countryName: 'United Kingdom', flag: '🇬🇧', broadcaster: 'Premier Sports 1', platformType: 'TV Channel', isFree: false, streamUrl: 'https://www.premiersports.com' },
      { countryCode: 'ES', countryName: 'Spain', flag: '🇪🇸', broadcaster: 'DAZN LaLiga / Movistar+', platformType: 'TV Channel', isFree: false, streamUrl: 'https://www.dazn.com/es-ES' },
      { countryCode: 'NG', countryName: 'Nigeria', flag: '🇳🇬', broadcaster: 'SuperSport LaLiga', platformType: 'TV Channel', isFree: false, streamUrl: 'https://supersport.com' }
    ]
  },
  {
    id: 'bg-4',
    matchId: 'ucl-mci-rma',
    matchTitle: 'Man City vs Real Madrid (UCL)',
    league: 'UEFA Champions League',
    kickoffTime: 'Wednesday, 20:00 BST / 15:00 EDT',
    countries: [
      { countryCode: 'US', countryName: 'United States', flag: '🇺🇸', broadcaster: 'Paramount+ / CBS Sports', platformType: 'Streaming App', isFree: false, streamUrl: 'https://www.paramountplus.com' },
      { countryCode: 'GB', countryName: 'United Kingdom', flag: '🇬🇧', broadcaster: 'TNT Sports 1 / discovery+', platformType: 'TV Channel', isFree: false, streamUrl: 'https://www.discoveryplus.com' },
      { countryCode: 'NG', countryName: 'Nigeria', flag: '🇳🇬', broadcaster: 'SuperSport Football Plus', platformType: 'TV Channel', isFree: false, streamUrl: 'https://supersport.com' }
    ]
  }
];

// -------------------------------------------------------------
// 6. WATCH (VIDEO HUB) DATA
// -------------------------------------------------------------
export const WATCH_VIDEOS: WatchVideoItem[] = [
  {
    id: 'vid-1',
    title: 'Highlights: Arsenal 2 - 1 Chelsea | Saka & Havertz Sizzle in North London',
    category: 'Highlights',
    duration: '8:42',
    thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedTime: '1 hour ago',
    views: '420K views',
    matchInfo: 'Premier League MD 8',
    league: 'Premier League'
  },
  {
    id: 'vid-2',
    title: 'Masterclass: Lionel Messi’s Free Kick & 2 Assists in Supporters Shield Clincher',
    category: 'Highlights',
    duration: '6:15',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedTime: '3 hours ago',
    views: '1.2M views',
    matchInfo: 'MLS Matchday 30',
    league: 'Major League Soccer'
  },
  {
    id: 'vid-3',
    title: 'Post-Match Reaction: Mikel Arteta on Team Mentality & Title Ambition',
    category: 'Interviews',
    duration: '11:20',
    thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedTime: '45 mins ago',
    views: '185K views',
    league: 'Premier League'
  },
  {
    id: 'vid-4',
    title: 'ONEKICKX Tactical Room: Hansi Flick’s High Line Demystified',
    category: 'Originals',
    duration: '14:05',
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedTime: '1 day ago',
    views: '350K views',
    league: 'LaLiga'
  },
  {
    id: 'vid-5',
    title: 'The Weekly Touchline Show: Top 10 Goals from Around the World',
    category: 'Shows',
    duration: '22:15',
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publishedTime: '2 days ago',
    views: '610K views'
  }
];

// -------------------------------------------------------------
// 7. PREDICTIONS (STATISTICAL AI & QUANT MODELS)
// -------------------------------------------------------------
export const MATCH_PREDICTIONS: MatchPrediction[] = [
  {
    matchId: 'pl-1',
    matchTitle: 'Arsenal vs Chelsea',
    league: 'Premier League',
    homeProb: 58,
    drawProb: 24,
    awayProb: 18,
    predictedScore: '2 - 1',
    over25Prob: 64,
    under25Prob: 36,
    bttsYesProb: 68,
    bttsNoProb: 32,
    keyInsights: [
      'Arsenal generate 2.45 expected goals (xG) at home this campaign.',
      'Chelsea have conceded in 6 of their last 7 away Premier League fixtures.',
      'Saka has scored or assisted in 5 consecutive home games.'
    ],
    confidence: 'High'
  },
  {
    matchId: 'pl-2',
    matchTitle: 'Manchester City vs Manchester United',
    league: 'Premier League',
    homeProb: 65,
    drawProb: 21,
    awayProb: 14,
    predictedScore: '3 - 1',
    over25Prob: 72,
    under25Prob: 28,
    bttsYesProb: 62,
    bttsNoProb: 38,
    keyInsights: [
      'Man City have won the last 4 Manchester derbies at the Etihad Stadium.',
      'Erling Haaland averages 1.25 goals per game in home derby clashes.',
      'United have scored on the counter in their last 3 away outings.'
    ],
    confidence: 'High'
  },
  {
    matchId: 'laliga-bar-sev',
    matchTitle: 'Barcelona vs Sevilla',
    league: 'LaLiga',
    homeProb: 74,
    drawProb: 16,
    awayProb: 10,
    predictedScore: '3 - 0',
    over25Prob: 69,
    under25Prob: 31,
    bttsYesProb: 44,
    bttsNoProb: 56,
    keyInsights: [
      'Barcelona have kept clean sheets in 3 of their last 4 matches against Sevilla.',
      'Robert Lewandowski leads LaLiga with 11 goals in 9 games.',
      'Sevilla average under 0.9 xG when playing top-4 opponents away.'
    ],
    confidence: 'High'
  },
  {
    matchId: 'unl-fra-ita',
    matchTitle: 'France vs Italy',
    league: 'UEFA Nations League',
    homeProb: 52,
    drawProb: 28,
    awayProb: 20,
    predictedScore: '2 - 1',
    over25Prob: 55,
    under25Prob: 45,
    bttsYesProb: 58,
    bttsNoProb: 42,
    keyInsights: [
      'France have won 4 of their last 5 competitive home international fixtures.',
      'Both sides have scored in 4 of the last 5 encounters between these nations.',
      'Tactical discipline favours a high duel count in midfield.'
    ],
    confidence: 'Medium'
  }
];

// -------------------------------------------------------------
// 8. NOTIFICATIONS FEED
// -------------------------------------------------------------
export interface AppNotification {
  id: string;
  type: 'goal' | 'card' | 'kickoff' | 'fulltime' | 'news';
  title: string;
  message: string;
  time: string;
  matchId?: string;
  isRead: boolean;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'goal',
    title: 'GOAL! Arsenal 2 - 1 Chelsea',
    message: 'Bukayo Saka curls a sublime strike into the top corner (74\')',
    time: '2 mins ago',
    matchId: 'pl-1',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'card',
    title: 'Yellow Card: Moises Caicedo (Chelsea)',
    message: 'Tactical foul stopping an Arsenal counter-attack (69\')',
    time: '7 mins ago',
    matchId: 'pl-1',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'kickoff',
    title: 'Upcoming Match Alert',
    message: 'Man City vs Man United kicks off in 2 hours at 20:00 GMT.',
    time: '20 mins ago',
    matchId: 'pl-2',
    isRead: true
  },
  {
    id: 'notif-4',
    type: 'fulltime',
    title: 'Full-Time Result: Real Madrid 3 - 2 Atlético',
    message: 'Real Madrid secure thriller in the Madrid Derby at the Bernabéu.',
    time: '1 hour ago',
    matchId: 'laliga-rma-atm',
    isRead: true
  },
  {
    id: 'notif-5',
    type: 'news',
    title: 'Breaking Transfer Exclusive',
    message: 'Enzo Fernández agreement progress reported ahead of winter window.',
    time: '2 hours ago',
    isRead: true
  }
];
