import { Match } from '../types';

export interface MatchPlayer {
  id: string;
  name: string;
  shortName: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'ATT';
  rating: number;
  avatarUrl: string;
  isCaptain?: boolean;
  isPlayerOfTheMatch?: boolean;
  hasGoal?: boolean;
  goalMinute?: number;
  hasAssist?: boolean;
  hasYellowCard?: boolean;
  cardMinute?: number;
  isSubbedOut?: boolean;
  subMinute?: number;
  subInPlayerName?: string;
  subInPlayerNumber?: number;
}

export interface MatchSubstitution {
  minute: number;
  playerIn: { name: string; number: number; rating: number; avatarUrl: string };
  playerOut: { name: string; number: number };
  team: 'home' | 'away';
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'substitution' | 'card' | 'halftime';
  team: 'home' | 'away';
  text: string;
  detail?: string;
  score?: string;
}

export interface DynamicMatchDetail {
  id: string;
  tournamentName: string;
  tournamentRound: string;
  dateStr: string;
  timeStr: string;
  venue: string;
  referee: { name: string; countryCode: string; avgRed: number; avgYellow: number };
  homeManager: { name: string; photo: string };
  awayManager: { name: string; photo: string };
  homeFormation: string;
  awayFormation: string;
  homeRatingAvg: number;
  awayRatingAvg: number;
  homeLineup: MatchPlayer[];
  awayLineup: MatchPlayer[];
  homeBench: MatchPlayer[];
  awayBench: MatchPlayer[];
  substitutions: MatchSubstitution[];
  events: MatchEvent[];
  stats: {
    possession: [number, number];
    xG: [number, number];
    bigChances: [number, number];
    totalShots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    fouls: [number, number];
    passes: [number, number];
    passAccuracy: [number, number];
    yellowCards: [number, number];
  };
  momentum: { minute: number; value: number; isGoal?: boolean; goalTeam?: 'home' | 'away' }[];
  playerOfTheMatch: {
    name: string;
    team: string;
    teamFlag: string;
    rating: number;
    photo: string;
    fanPickPct: number;
    fanVotes: string;
    topRatings: { name: string; teamFlag: string; rating: number; photo: string }[];
    topFans: { name: string; teamFlag: string; pct: number; photo: string }[];
  };
  goalScorers: { name: string; minute: number; team: 'home' | 'away' }[];
  commentary: { minute: number; text: string; type: 'goal' | 'card' | 'sub' | 'chance' | 'general' }[];
}

export function generateDynamicMatchDetails(match: Match): DynamicMatchDetail {
  const isGermanySerbia =
    (match.homeTeam.includes('Germany') && match.awayTeam.includes('Serbia')) ||
    (match.homeTeam.includes('Serbia') && match.awayTeam.includes('Germany'));

  const homeScore = match.homeScore ?? (isGermanySerbia ? 2 : 1);
  const awayScore = match.awayScore ?? (isGermanySerbia ? 0 : 0);

  interface RawPlayerDef {
    name: string;
    short: string;
    num: number;
    pos: 'GK' | 'DEF' | 'MID' | 'ATT';
    rating: number;
    isCaptain?: boolean;
    hasGoal?: boolean;
    goalMinute?: number;
    hasAssist?: boolean;
    hasYellowCard?: boolean;
    cardMinute?: number;
    isSubbedOut?: boolean;
    subMinute?: number;
    isPlayerOfTheMatch?: boolean;
  }

  // Home player names
  const homePlayerNames: RawPlayerDef[] = isGermanySerbia
    ? [
        { name: 'Jonas Urbig', short: 'J. Urbig', num: 1, pos: 'GK', rating: 6.8 },
        { name: 'Philipp Treu', short: 'P. Treu', num: 13, pos: 'DEF', rating: 8.1 },
        { name: 'Malick Thiaw', short: 'M. Thiaw', num: 2, pos: 'DEF', rating: 8.0 },
        { name: 'Waldemar Anton', short: 'W. Anton', num: 3, pos: 'DEF', rating: 7.3 },
        { name: 'Maximilian Mittelstädt', short: 'M. Mittelstädt', num: 18, pos: 'DEF', rating: 7.8, hasAssist: true },
        { name: 'Serge Gnabry', short: 'S. Gnabry', num: 20, pos: 'MID', rating: 6.8, isCaptain: true, isSubbedOut: true, subMinute: 46 },
        { name: 'Aleksandar Pavlović', short: 'A. Pavlović', num: 5, pos: 'MID', rating: 8.1, isSubbedOut: true, subMinute: 88 },
        { name: 'Tom Bischof', short: 'T. Bischof', num: 8, pos: 'MID', rating: 7.8, hasGoal: true, goalMinute: 39, isSubbedOut: true, subMinute: 77 },
        { name: 'Derry Scherhant', short: 'D. Scherhant', num: 9, pos: 'MID', rating: 6.7, isSubbedOut: true, subMinute: 77 },
        { name: 'Nick Woltemade', short: 'N. Woltemade', num: 11, pos: 'ATT', rating: 6.1, isSubbedOut: true, subMinute: 77 },
        { name: 'Florian Wirtz', short: 'F. Wirtz', num: 17, pos: 'ATT', rating: 8.7, isPlayerOfTheMatch: true, hasGoal: true, goalMinute: 61 }
      ]
    : [
        { name: 'First Keeper', short: 'Keeper', num: 1, pos: 'GK', rating: 7.1 },
        { name: 'Right Back', short: 'R. Back', num: 2, pos: 'DEF', rating: 7.2 },
        { name: 'Center Back 1', short: 'C. Back 1', num: 4, pos: 'DEF', rating: 7.4 },
        { name: 'Center Back 2', short: 'C. Back 2', num: 5, pos: 'DEF', rating: 7.0 },
        { name: 'Left Back', short: 'L. Back', num: 3, pos: 'DEF', rating: 7.3 },
        { name: 'Midfielder 1', short: 'Mid 1', num: 6, pos: 'MID', rating: 7.6 },
        { name: 'Midfielder 2', short: 'Mid 2', num: 8, pos: 'MID', rating: 7.5 },
        { name: 'Playmaker', short: 'Playmaker', num: 10, pos: 'MID', rating: 8.3, isCaptain: true },
        { name: 'Right Wing', short: 'R. Wing', num: 7, pos: 'ATT', rating: 7.7 },
        { name: 'Striker', short: 'Striker', num: 9, pos: 'ATT', rating: 8.2, hasGoal: true, goalMinute: 54 },
        { name: 'Left Wing', short: 'L. Wing', num: 11, pos: 'ATT', rating: 7.9 }
      ];

  // Away player names
  const awayPlayerNames: RawPlayerDef[] = isGermanySerbia
    ? [
        { name: 'Đorđe Petrović', short: 'Đ. Petrović', num: 1, pos: 'GK', rating: 7.6 },
        { name: 'Kosta Nedeljković', short: 'K. Nedeljković', num: 2, pos: 'DEF', rating: 7.0 },
        { name: 'Strahinja Eraković', short: 'S. Eraković', num: 16, pos: 'DEF', rating: 6.7, isSubbedOut: true, subMinute: 67 },
        { name: 'Nemanja Gudelj', short: 'N. Gudelj', num: 6, pos: 'DEF', rating: 6.3, hasYellowCard: true, cardMinute: 73 },
        { name: 'Srđan Babić', short: 'S. Babić', num: 15, pos: 'DEF', rating: 6.3 },
        { name: 'Filip Kostić', short: 'F. Kostić', num: 11, pos: 'DEF', rating: 6.2 },
        { name: 'Andrija Živković', short: 'A. Živković', num: 14, pos: 'MID', rating: 6.6, isSubbedOut: true, subMinute: 66 },
        { name: 'Nemanja Maksimović', short: 'N. Maksimović', num: 5, pos: 'MID', rating: 6.5, hasYellowCard: true, cardMinute: 79, isSubbedOut: true, subMinute: 88 },
        { name: 'Stefan Džodić', short: 'S. Džodić', num: 19, pos: 'MID', rating: 6.4, isSubbedOut: true, subMinute: 67 },
        { name: 'Dušan Tadić', short: 'D. Tadić', num: 10, pos: 'MID', rating: 6.0, isCaptain: true, isSubbedOut: true, subMinute: 67 },
        { name: 'Luka Jović', short: 'L. Jović', num: 8, pos: 'ATT', rating: 6.7 }
      ]
    : [
        { name: 'Away Keeper', short: 'Away GK', num: 1, pos: 'GK', rating: 6.8 },
        { name: 'Away Defender 1', short: 'A. Def 1', num: 2, pos: 'DEF', rating: 6.5 },
        { name: 'Away Defender 2', short: 'A. Def 2', num: 4, pos: 'DEF', rating: 6.7 },
        { name: 'Away Defender 3', short: 'A. Def 3', num: 5, pos: 'DEF', rating: 6.6 },
        { name: 'Away Defender 4', short: 'A. Def 4', num: 3, pos: 'DEF', rating: 6.4 },
        { name: 'Away Midfielder 1', short: 'A. Mid 1', num: 6, pos: 'MID', rating: 6.8 },
        { name: 'Away Midfielder 2', short: 'A. Mid 2', num: 8, pos: 'MID', rating: 6.9 },
        { name: 'Away Midfielder 3', short: 'A. Mid 3', num: 10, pos: 'MID', rating: 7.0, isCaptain: true },
        { name: 'Away Forward 1', short: 'A. Fwd 1', num: 7, pos: 'ATT', rating: 6.8 },
        { name: 'Away Striker', short: 'A. Striker', num: 9, pos: 'ATT', rating: 6.7 },
        { name: 'Away Forward 2', short: 'A. Fwd 2', num: 11, pos: 'ATT', rating: 6.5 }
      ];

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';

  const homeLineup: MatchPlayer[] = homePlayerNames.map((p, idx) => ({
    id: `hp-${idx}`,
    name: p.name,
    shortName: p.short,
    number: p.num,
    position: p.pos,
    rating: p.rating,
    avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + idx}?w=100&h=100&fit=crop&crop=face`,
    isCaptain: p.isCaptain,
    isPlayerOfTheMatch: p.name.includes('Wirtz') || p.rating >= 8.5,
    hasGoal: p.hasGoal,
    goalMinute: p.goalMinute,
    hasAssist: p.hasAssist,
    isSubbedOut: p.isSubbedOut,
    subMinute: p.subMinute
  }));

  const awayLineup: MatchPlayer[] = awayPlayerNames.map((p, idx) => ({
    id: `ap-${idx}`,
    name: p.name,
    shortName: p.short,
    number: p.num,
    position: p.pos,
    rating: p.rating,
    avatarUrl: `https://images.unsplash.com/photo-${1507003211169 + idx}?w=100&h=100&fit=crop&crop=face`,
    isCaptain: p.isCaptain,
    hasYellowCard: p.hasYellowCard,
    cardMinute: p.cardMinute,
    isSubbedOut: p.isSubbedOut,
    subMinute: p.subMinute
  }));

  // Bench players
  const homeBenchNames = [
    { name: 'Said El Mala', num: 7, rating: 6.8, subInMin: 46, subOutName: 'S. Gnabry' },
    { name: 'Mika Baur', num: 14, rating: 6.7, subInMin: 77, subOutName: 'T. Bischof' },
    { name: 'Bambasé Conté', num: 19, rating: 6.7, subInMin: 77, subOutName: 'D. Scherhant' },
    { name: 'Jonathan Burkardt', num: 10, rating: 6.5, subInMin: 77, subOutName: 'N. Woltemade' },
    { name: 'Vitaly Janelt', num: 23, rating: 6.6, subInMin: 88, subOutName: 'A. Pavlović' },
    { name: 'Finn Dahmen', num: 12, rating: 6.0 },
    { name: 'Noah Atubolu', num: 21, rating: 6.0 },
    { name: 'Finn Jeltsch', num: 4, rating: 6.0 },
    { name: 'Ridle Baku', num: 16, rating: 6.0 },
    { name: 'David Raum', num: 22, rating: 6.0 }
  ];

  const awayBenchNames = [
    { name: 'Lazar Samardžić', num: 21, rating: 6.9, subInMin: 66, subOutName: 'A. Živković' },
    { name: 'Strahinja Pavlović', num: 3, rating: 6.7, subInMin: 67, subOutName: 'S. Eraković' },
    { name: 'Saša Lukić', num: 22, rating: 6.9, subInMin: 67, subOutName: 'D. Tadić' },
    { name: 'Mihajlo Cvetković', num: 18, rating: 6.6, subInMin: 67, subOutName: 'S. Džodić' },
    { name: 'Vasilije Kostov', num: 20, rating: 6.5, subInMin: 88, subOutName: 'N. Maksimović' },
    { name: 'Filip Stanković', num: 12, rating: 6.0 },
    { name: 'Vanja Milinković-Savić', num: 23, rating: 6.0 },
    { name: 'Ognjen Mimović', num: 4, rating: 6.0 },
    { name: 'Nikola Simić', num: 13, rating: 6.0 },
    { name: 'Aleksa Terzić', num: 17, rating: 6.0 }
  ];

  const homeBench: MatchPlayer[] = homeBenchNames.map((b, i) => ({
    id: `hb-${i}`,
    name: b.name,
    shortName: b.name.split(' ').map((n, idx, arr) => idx === arr.length - 1 ? n : n[0] + '.').join(' '),
    number: b.num,
    position: 'MID',
    rating: b.rating,
    avatarUrl: defaultAvatar
  }));

  const awayBench: MatchPlayer[] = awayBenchNames.map((b, i) => ({
    id: `ab-${i}`,
    name: b.name,
    shortName: b.name.split(' ').map((n, idx, arr) => idx === arr.length - 1 ? n : n[0] + '.').join(' '),
    number: b.num,
    position: 'MID',
    rating: b.rating,
    avatarUrl: defaultAvatar
  }));

  // Match events (Chronological for Germany vs Serbia or dynamic)
  const events: MatchEvent[] = isGermanySerbia
    ? [
        { minute: 88, type: 'substitution', team: 'away', text: 'V. Kostov in for N. Maksimović' },
        { minute: 88, type: 'substitution', team: 'home', text: 'V. Janelt in for A. Pavlović' },
        { minute: 79, type: 'card', team: 'away', text: 'Yellow Card: N. Maksimović (Foul)' },
        { minute: 77, type: 'substitution', team: 'home', text: 'M. Baur in for T. Bischof' },
        { minute: 77, type: 'substitution', team: 'home', text: 'J. Burkardt in for N. Woltemade' },
        { minute: 77, type: 'substitution', team: 'home', text: 'B. Conté in for D. Scherhant' },
        { minute: 73, type: 'card', team: 'away', text: 'Yellow Card: N. Gudelj (Foul)' },
        { minute: 67, type: 'substitution', team: 'away', text: 'S. Lukić in for D. Tadić' },
        { minute: 67, type: 'substitution', team: 'away', text: 'M. Cvetković in for S. Džodić' },
        { minute: 67, type: 'substitution', team: 'away', text: 'S. Pavlović in for S. Eraković' },
        { minute: 66, type: 'substitution', team: 'away', text: 'L. Samardžić in for A. Živković' },
        { minute: 61, type: 'goal', team: 'home', text: 'Goal: F. Wirtz', detail: 'Assist: M. Mittelstädt', score: '2 - 0' },
        { minute: 46, type: 'substitution', team: 'home', text: 'S. El Mala in for S. Gnabry' },
        { minute: 45, type: 'halftime', team: 'home', text: 'Half-time: 1 - 0' },
        { minute: 39, type: 'goal', team: 'home', text: 'Goal: T. Bischof', score: '1 - 0' }
      ]
    : [
        { minute: 74, type: 'card', team: 'away', text: 'Yellow Card: Tactical Foul' },
        { minute: 62, type: 'goal', team: 'home', text: `Goal: ${match.homeTeam}`, score: `${homeScore} - ${awayScore}` },
        { minute: 45, type: 'halftime', team: 'home', text: 'Half-time' }
      ];

  // Momentum chart (90 ticks, green > 0, blue < 0, with goal pins)
  const momentum = Array.from({ length: 90 }, (_, i) => {
    const min = i + 1;
    let val = Math.sin(min / 7) * 35 + (min < 45 ? 25 : 30);
    if (min >= 35 && min <= 42) val = 65; // Bischof goal window
    if (min >= 57 && min <= 64) val = 75; // Wirtz goal window
    if (min >= 80 && min <= 84) val = -35; // Serbia pressure

    return {
      minute: min,
      value: Math.max(-60, Math.min(85, Math.round(val))),
      isGoal: min === 39 || min === 61,
      goalTeam: min === 39 || min === 61 ? ('home' as const) : undefined
    };
  });

  const goalScorers = isGermanySerbia
    ? [
        { name: 'Florian Wirtz', minute: 61, team: 'home' as const },
        { name: 'Tom Bischof', minute: 39, team: 'home' as const }
      ]
    : homeScore > 0
    ? [{ name: `${match.homeTeam} Scorer`, minute: 54, team: 'home' as const }]
    : [];

  return {
    id: match.id,
    tournamentName: 'UEFA Nations League, League A, Gr. 2',
    tournamentRound: 'Round 4',
    dateStr: '01/10/2026 • 11:45',
    timeStr: match.time,
    venue: 'Allianz Arena, Munich',
    referee: { name: 'Espen Eskas', countryCode: 'no', avgRed: 0.12, avgYellow: 3.46 },
    homeManager: { name: 'Jürgen Klopp', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face' },
    awayManager: { name: 'Veljko Paunović', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face' },
    homeFormation: '4-4-2',
    awayFormation: '5-4-1',
    homeRatingAvg: 8.19,
    awayRatingAvg: 6.96,
    homeLineup,
    awayLineup,
    homeBench,
    awayBench,
    substitutions: [
      { minute: 46, team: 'home', playerIn: { name: 'Said El Mala', number: 7, rating: 6.8, avatarUrl: defaultAvatar }, playerOut: { name: 'S. Gnabry', number: 20 } },
      { minute: 66, team: 'away', playerIn: { name: 'Lazar Samardžić', number: 21, rating: 6.9, avatarUrl: defaultAvatar }, playerOut: { name: 'A. Živković', number: 14 } },
      { minute: 67, team: 'away', playerIn: { name: 'Strahinja Pavlović', number: 3, rating: 6.7, avatarUrl: defaultAvatar }, playerOut: { name: 'S. Eraković', number: 16 } },
      { minute: 67, team: 'away', playerIn: { name: 'Saša Lukić', number: 22, rating: 6.9, avatarUrl: defaultAvatar }, playerOut: { name: 'D. Tadić', number: 10 } },
      { minute: 67, team: 'away', playerIn: { name: 'Mihajlo Cvetković', number: 18, rating: 6.6, avatarUrl: defaultAvatar }, playerOut: { name: 'S. Džodić', number: 19 } },
      { minute: 77, team: 'home', playerIn: { name: 'Mika Baur', number: 14, rating: 6.7, avatarUrl: defaultAvatar }, playerOut: { name: 'T. Bischof', number: 8 } },
      { minute: 77, team: 'home', playerIn: { name: 'Jonathan Burkardt', number: 10, rating: 6.5, avatarUrl: defaultAvatar }, playerOut: { name: 'N. Woltemade', number: 11 } },
      { minute: 77, team: 'home', playerIn: { name: 'Bambasé Conté', number: 19, rating: 6.7, avatarUrl: defaultAvatar }, playerOut: { name: 'D. Scherhant', number: 9 } },
      { minute: 88, team: 'home', playerIn: { name: 'Vitaly Janelt', number: 23, rating: 6.6, avatarUrl: defaultAvatar }, playerOut: { name: 'A. Pavlović', number: 5 } },
      { minute: 88, team: 'away', playerIn: { name: 'Vasilije Kostov', number: 20, rating: 6.5, avatarUrl: defaultAvatar }, playerOut: { name: 'N. Maksimović', number: 5 } }
    ],
    events,
    stats: {
      possession: [74, 26],
      xG: [3.90, 0.01],
      bigChances: [7, 1],
      totalShots: [21, 3],
      shotsOnTarget: [9, 1],
      corners: [8, 2],
      fouls: [9, 14],
      passes: [684, 241],
      passAccuracy: [91, 76],
      yellowCards: [0, 2]
    },
    momentum,
    playerOfTheMatch: {
      name: isGermanySerbia ? 'F. Wirtz' : homeLineup[10]?.name || 'Top Player',
      team: match.homeTeam,
      teamFlag: match.homeFlag,
      rating: 8.7,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
      fanPickPct: 72,
      fanVotes: '2.7k votes',
      topRatings: [
        { name: 'P. Treu', teamFlag: match.homeFlag, rating: 8.1, photo: defaultAvatar },
        { name: 'A. Pavlović', teamFlag: match.homeFlag, rating: 8.1, photo: defaultAvatar },
        { name: 'M. Thiaw', teamFlag: match.homeFlag, rating: 8.0, photo: defaultAvatar }
      ],
      topFans: [
        { name: 'T. Bischof', teamFlag: match.homeFlag, pct: 8, photo: defaultAvatar },
        { name: 'A. Pavlović', teamFlag: match.homeFlag, pct: 7, photo: defaultAvatar },
        { name: 'Đ. Petrović', teamFlag: match.awayFlag, pct: 3, photo: defaultAvatar }
      ]
    },
    goalScorers,
    commentary: [
      { minute: 90, text: 'Full Time! The referee blows the final whistle. A dominant 2-0 display.', type: 'general' },
      { minute: 88, text: 'Substitution: Vitaly Janelt replaces Aleksandar Pavlović.', type: 'sub' },
      { minute: 79, text: 'Yellow card shown to Nemanja Maksimović for a late sliding tackle.', type: 'card' },
      { minute: 61, text: 'GOAL! Florian Wirtz doubles the lead with a clinical finish into the bottom corner after Mittelstädt’s cross!', type: 'goal' },
      { minute: 46, text: 'Second half gets underway at the Allianz Arena.', type: 'general' },
      { minute: 39, text: 'GOAL! Tom Bischof unleashes a left-footed strike from the edge of the penalty box! 1-0!', type: 'goal' },
      { minute: 1, text: 'Match kicked off under bright floodlights.', type: 'general' }
    ]
  };
}
