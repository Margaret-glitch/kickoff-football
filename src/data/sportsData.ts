import { LeagueGroup, TransferItem, TopPerformance, StakingRecord, TopCompetition, CountryLeagueGroup, TickerMatch } from '../types';

export const REAL_FOOTBALL_TICKER: TickerMatch[] = [
  { id: 't-ars-che', time: "74'", home: 'Arsenal', away: 'Chelsea', score: '2 - 1', status: 'LIVE', competition: 'Premier League' },
  { id: 't-fra-ita', time: "58'", home: 'France', away: 'Italy', score: '2 - 1', status: 'LIVE', competition: 'UEFA Nations League' },
  { id: 't-bar-sev', time: "38'", home: 'Barcelona', away: 'Sevilla', score: '2 - 0', status: 'LIVE', competition: 'LaLiga' },
  { id: 't-bay-lev', time: "66'", home: 'Bayern', away: 'Leverkusen', score: '3 - 2', status: 'LIVE', competition: 'Bundesliga' },
  { id: 't-int-juv', time: "HT", home: 'Inter', away: 'Juventus', score: '0 - 0', status: 'LIVE', competition: 'Serie A' },
  { id: 't-por-den', time: "83'", home: 'Portugal', away: 'Denmark', score: '3 - 1', status: 'LIVE', competition: 'UEFA Nations League' },
  { id: 't-mci-mun', time: '20:00', home: 'Man City', away: 'Man United', score: 'vs', status: 'UPCOMING', competition: 'Premier League' },
  { id: 't-esp-eng', time: '20:45', home: 'Spain', away: 'England', score: 'vs', status: 'UPCOMING', competition: 'UEFA Nations League' },
  { id: 't-rma-atm', time: 'FT', home: 'Real Madrid', away: 'Atlético', score: '3 - 2', status: 'FT', competition: 'LaLiga' },
  { id: 't-liv-tot', time: 'FT', home: 'Liverpool', away: 'Tottenham', score: '2 - 1', status: 'FT', competition: 'Premier League' }
];

export const TOP_COMPETITIONS: TopCompetition[] = [
  {
    id: 'ucl',
    name: 'UEFA Champions League',
    displayName: 'UEFA Champions League',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png',
    region: 'Europe',
    isFavorite: false
  },
  {
    id: 'uel',
    name: 'UEFA Europa League',
    displayName: 'UEFA Europa League',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/mlsr7d1718774547.png',
    region: 'Europe',
    isFavorite: false
  },
  {
    id: 'pl',
    name: 'Premier League',
    displayName: 'Premier League',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png',
    region: 'England',
    isFavorite: false
  },
  {
    id: 'laliga',
    name: 'LaLiga',
    displayName: 'LaLiga',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png',
    region: 'Spain',
    isFavorite: false
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    displayName: 'Bundesliga',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png',
    region: 'Germany',
    isFavorite: false
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    displayName: 'Serie A',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png',
    region: 'Italy',
    isFavorite: false
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    displayName: 'Ligue 1',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/9f7z9d1742983155.png',
    region: 'France',
    isFavorite: false
  },
  {
    id: 'uefa-conference',
    name: 'UEFA Conference League',
    displayName: 'UEFA Conference...',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/5hr0511687510741.png',
    region: 'Europe',
    isFavorite: false
  },
  {
    id: 'brasileirao',
    name: 'Campeonato Brasileiro Série A',
    displayName: 'Campeonato Brasileiro Série A',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/lywv7t1766787179.png',
    region: 'Brazil',
    isFavorite: false
  },
  {
    id: 'libertadores',
    name: 'CONMEBOL Libertadores',
    displayName: 'CONMEBOL Libertadores',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/9shr931685425181.png',
    region: 'South America',
    isFavorite: false
  },
  {
    id: 'npfl',
    name: 'EuroMatch Nigeria Premier League',
    displayName: 'EuroMatch Nigeria Premie...',
    badgeUrl: 'https://r2.thesportsdb.com/images/media/league/badge/k4hgin1590183498.png',
    region: 'Nigeria',
    isFavorite: false
  }
];

export const COUNTRY_LEAGUES: CountryLeagueGroup[] = [
  {
    countryCode: 'ng',
    countryName: 'Nigeria',
    flagUrl: 'https://flagcdn.com/w40/ng.png',
    matchCount: 12,
    leagues: [
      { id: 'ng-npfl', name: 'NPFL (Nigeria Premier League)', matchCount: 8 },
      { id: 'ng-cup', name: 'Aiteo Cup (Federation Cup)', matchCount: 4 }
    ]
  },
  {
    countryCode: 'world',
    countryName: 'World',
    flagUrl: 'https://flagcdn.com/w40/un.png',
    matchCount: 34,
    leagues: [
      { id: 'world-qual', name: 'FIFA World Cup Qualification', matchCount: 18 },
      { id: 'intl-friendly', name: 'International Friendly Games', matchCount: 10 },
      { id: 'club-friendly', name: 'Club Friendly Games', matchCount: 6 }
    ]
  },
  {
    countryCode: 'gb-eng',
    countryName: 'England',
    flagUrl: 'https://flagcdn.com/w40/gb-eng.png',
    matchCount: 48,
    leagues: [
      { id: 'eng-pl', name: 'Premier League', matchCount: 20 },
      { id: 'eng-champ', name: 'Championship', matchCount: 14 },
      { id: 'eng-fa', name: 'FA Cup', matchCount: 8 },
      { id: 'eng-efl', name: 'EFL Cup', matchCount: 6 }
    ]
  },
  {
    countryCode: 'es',
    countryName: 'Spain',
    flagUrl: 'https://flagcdn.com/w40/es.png',
    matchCount: 36,
    leagues: [
      { id: 'es-laliga', name: 'LaLiga', matchCount: 18 },
      { id: 'es-laliga2', name: 'LaLiga 2', matchCount: 10 },
      { id: 'es-copa', name: 'Copa del Rey', matchCount: 8 }
    ]
  },
  {
    countryCode: 'de',
    countryName: 'Germany',
    flagUrl: 'https://flagcdn.com/w40/de.png',
    matchCount: 28,
    leagues: [
      { id: 'de-bunde', name: 'Bundesliga', matchCount: 16 },
      { id: 'de-bunde2', name: '2. Bundesliga', matchCount: 8 },
      { id: 'de-dfb', name: 'DFB-Pokal', matchCount: 4 }
    ]
  },
  {
    countryCode: 'it',
    countryName: 'Italy',
    flagUrl: 'https://flagcdn.com/w40/it.png',
    matchCount: 30,
    leagues: [
      { id: 'it-seriea', name: 'Serie A', matchCount: 18 },
      { id: 'it-serieb', name: 'Serie B', matchCount: 8 },
      { id: 'it-coppa', name: 'Coppa Italia', matchCount: 4 }
    ]
  },
  {
    countryCode: 'fr',
    countryName: 'France',
    flagUrl: 'https://flagcdn.com/w40/fr.png',
    matchCount: 26,
    leagues: [
      { id: 'fr-ligue1', name: 'Ligue 1', matchCount: 16 },
      { id: 'fr-ligue2', name: 'Ligue 2', matchCount: 6 },
      { id: 'fr-coupe', name: 'Coupe de France', matchCount: 4 }
    ]
  },
  {
    countryCode: 'br',
    countryName: 'Brazil',
    flagUrl: 'https://flagcdn.com/w40/br.png',
    matchCount: 42,
    leagues: [
      { id: 'br-seriea', name: 'Brasileirão Série A', matchCount: 20 },
      { id: 'br-serieb', name: 'Brasileirão Série B', matchCount: 14 },
      { id: 'br-copa', name: 'Copa do Brasil', matchCount: 8 }
    ]
  },
  {
    countryCode: 'eu',
    countryName: 'Europe',
    flagUrl: 'https://flagcdn.com/w40/eu.png',
    matchCount: 55,
    leagues: [
      { id: 'eu-ucl', name: 'UEFA Champions League', matchCount: 24 },
      { id: 'eu-uel', name: 'UEFA Europa League', matchCount: 16 },
      { id: 'eu-unl', name: 'UEFA Nations League', matchCount: 10 },
      { id: 'eu-uecl', name: 'UEFA Conference League', matchCount: 5 }
    ]
  }
];

export const TICKER_ITEMS = REAL_FOOTBALL_TICKER;

export const INITIAL_LEAGUES: LeagueGroup[] = [
  {
    id: 'premier-league',
    name: 'Premier League',
    region: 'England',
    matchCount: 3,
    isExpanded: true,
    subGroups: [
      {
        title: 'Premier League - Matchday 8',
        matches: [
          {
            id: 'pl-1',
            time: "74'",
            day: 'Today',
            status: 'LIVE',
            homeTeam: 'Arsenal',
            homeFlag: 'https://crests.football-data.org/57.png',
            homeScore: 2,
            awayTeam: 'Chelsea',
            awayFlag: 'https://crests.football-data.org/61.png',
            awayScore: 1,
            isFavorite: true,
            odds: { home: 1.25, draw: 4.8, away: 8.5 }
          },
          {
            id: 'pl-2',
            time: '20:00',
            day: 'Today',
            status: 'UPCOMING',
            homeTeam: 'Manchester City',
            homeFlag: 'https://crests.football-data.org/65.png',
            homeScore: 0,
            awayTeam: 'Manchester United',
            awayFlag: 'https://crests.football-data.org/66.png',
            awayScore: 0,
            isFavorite: false,
            odds: { home: 1.55, draw: 4.2, away: 5.6 }
          },
          {
            id: 'pl-3',
            time: 'FT',
            day: 'Today',
            status: 'FT',
            homeTeam: 'Liverpool',
            homeFlag: 'https://crests.football-data.org/64.png',
            homeScore: 2,
            awayTeam: 'Tottenham Hotspur',
            awayFlag: 'https://crests.football-data.org/73.png',
            awayScore: 1,
            isFavorite: false,
            odds: { home: 1.75, draw: 3.8, away: 4.1 }
          }
        ]
      }
    ]
  },
  {
    id: 'nations-league',
    name: 'UEFA Nations League',
    region: 'Europe',
    matchCount: 4,
    isExpanded: true,
    subGroups: [
      {
        title: 'UEFA Nations League, League A, Gr. 2',
        matches: [
          {
            id: 'unl-fra-ita',
            time: "58'",
            day: 'Today',
            status: 'LIVE',
            homeTeam: 'France',
            homeFlag: 'https://flagcdn.com/w40/fr.png',
            homeScore: 2,
            awayTeam: 'Italy',
            awayFlag: 'https://flagcdn.com/w40/it.png',
            awayScore: 1,
            isFavorite: true,
            odds: { home: 1.45, draw: 3.9, away: 6.2 }
          },
          {
            id: 'unl-por-den',
            time: "83'",
            day: 'Today',
            status: 'LIVE',
            homeTeam: 'Portugal',
            homeFlag: 'https://flagcdn.com/w40/pt.png',
            homeScore: 3,
            awayTeam: 'Denmark',
            awayFlag: 'https://flagcdn.com/w40/dk.png',
            awayScore: 1,
            isFavorite: false,
            odds: { home: 1.08, draw: 9.5, away: 18.0 }
          },
          {
            id: 'unl-esp-eng',
            time: '20:45',
            day: 'Today',
            status: 'UPCOMING',
            homeTeam: 'Spain',
            homeFlag: 'https://flagcdn.com/w40/es.png',
            homeScore: 0,
            awayTeam: 'England',
            awayFlag: 'https://flagcdn.com/w40/gb-eng.png',
            awayScore: 0,
            isFavorite: false,
            odds: { home: 2.15, draw: 3.2, away: 3.3 }
          },
          {
            id: 'unl-ger-ned',
            time: 'FT',
            day: 'Today',
            status: 'FT',
            homeTeam: 'Germany',
            homeFlag: 'https://flagcdn.com/w40/de.png',
            homeScore: 2,
            awayTeam: 'Netherlands',
            awayFlag: 'https://flagcdn.com/w40/nl.png',
            awayScore: 2,
            isFavorite: false,
            odds: { home: 2.0, draw: 3.4, away: 3.4 }
          }
        ]
      }
    ]
  },
  {
    id: 'la-liga',
    name: 'LaLiga',
    region: 'Spain',
    matchCount: 3,
    isExpanded: true,
    subGroups: [
      {
        title: 'LaLiga - Matchday 9',
        matches: [
          {
            id: 'laliga-bar-sev',
            time: "38'",
            day: 'Today',
            status: 'LIVE',
            homeTeam: 'Barcelona',
            homeFlag: 'https://crests.football-data.org/81.png',
            homeScore: 2,
            awayTeam: 'Sevilla',
            awayFlag: 'https://crests.football-data.org/559.png',
            awayScore: 0,
            isFavorite: true,
            odds: { home: 1.14, draw: 7.0, away: 15.0 }
          },
          {
            id: 'laliga-rma-atm',
            time: 'FT',
            day: 'Today',
            status: 'FT',
            homeTeam: 'Real Madrid',
            homeFlag: 'https://crests.football-data.org/86.png',
            homeScore: 3,
            awayTeam: 'Atlético Madrid',
            awayFlag: 'https://crests.football-data.org/78.png',
            awayScore: 2,
            isFavorite: false,
            odds: { home: 2.1, draw: 3.3, away: 3.2 }
          },
          {
            id: 'laliga-ath-rso',
            time: '21:00',
            day: 'Today',
            status: 'UPCOMING',
            homeTeam: 'Athletic Club',
            homeFlag: 'https://crests.football-data.org/77.png',
            homeScore: 0,
            awayTeam: 'Real Sociedad',
            awayFlag: 'https://crests.football-data.org/92.png',
            awayScore: 0,
            isFavorite: false,
            odds: { home: 2.3, draw: 3.1, away: 3.1 }
          }
        ]
      }
    ]
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    region: 'Italy',
    matchCount: 3,
    isExpanded: true,
    subGroups: [
      {
        title: 'Serie A - Matchday 7',
        matches: [
          {
            id: 'sa-int-juv',
            time: "HT",
            day: 'Today',
            status: 'LIVE',
            homeTeam: 'Inter',
            homeFlag: 'https://crests.football-data.org/108.png',
            homeScore: 0,
            awayTeam: 'Juventus',
            awayFlag: 'https://crests.football-data.org/109.png',
            awayScore: 0,
            isFavorite: false,
            odds: { home: 2.35, draw: 2.8, away: 3.2 }
          },
          {
            id: 'sa-nap-mil',
            time: '20:45',
            day: 'Today',
            status: 'UPCOMING',
            homeTeam: 'Napoli',
            homeFlag: 'https://crests.football-data.org/113.png',
            homeScore: 0,
            awayTeam: 'AC Milan',
            awayFlag: 'https://crests.football-data.org/98.png',
            awayScore: 0,
            isFavorite: false,
            odds: { home: 2.2, draw: 3.25, away: 3.1 }
          },
          {
            id: 'sa-rom-laz',
            time: 'FT',
            day: 'Today',
            status: 'FT',
            homeTeam: 'Roma',
            homeFlag: 'https://crests.football-data.org/100.png',
            homeScore: 1,
            awayTeam: 'Lazio',
            awayFlag: 'https://crests.football-data.org/110.png',
            awayScore: 0,
            isFavorite: false,
            odds: { home: 2.4, draw: 3.1, away: 3.0 }
          }
        ]
      }
    ]
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    region: 'Germany',
    matchCount: 2,
    isExpanded: true,
    subGroups: [
      {
        title: 'Bundesliga - Matchday 7',
        matches: [
          {
            id: 'bun-bay-lev',
            time: "66'",
            day: 'Today',
            status: 'LIVE',
            homeTeam: 'Bayern München',
            homeFlag: 'https://crests.football-data.org/5.png',
            homeScore: 3,
            awayTeam: 'Bayer Leverkusen',
            awayFlag: 'https://crests.football-data.org/3.png',
            awayScore: 2,
            isFavorite: true,
            odds: { home: 1.35, draw: 4.5, away: 7.0 }
          },
          {
            id: 'bun-dor-rbl',
            time: '19:30',
            day: 'Today',
            status: 'UPCOMING',
            homeTeam: 'Borussia Dortmund',
            homeFlag: 'https://crests.football-data.org/4.png',
            homeScore: 0,
            awayTeam: 'RB Leipzig',
            awayFlag: 'https://crests.football-data.org/721.png',
            awayScore: 0,
            isFavorite: false,
            odds: { home: 2.25, draw: 3.6, away: 2.8 }
          }
        ]
      }
    ]
  }
];

export const TRANSFERS: TransferItem[] = [
  {
    id: 't-1',
    playerName: 'Enzo Fernández',
    fromTeam: 'CHE',
    fromLogo: 'https://crests.football-data.org/61.png',
    toTeam: 'MCI',
    toLogo: 'https://crests.football-data.org/65.png',
    fee: '145M €',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/d49y2d1789054180.png'
  },
  {
    id: 't-2',
    playerName: 'Morgan Rogers',
    fromTeam: 'AVL',
    fromLogo: 'https://crests.football-data.org/58.png',
    toTeam: 'CHE',
    toLogo: 'https://crests.football-data.org/61.png',
    fee: '138M €',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/rlyedx1787689763.png'
  },
  {
    id: 't-3',
    playerName: 'Elliot Anderson',
    fromTeam: 'NFO',
    fromLogo: 'https://crests.football-data.org/351.png',
    toTeam: 'MCI',
    toLogo: 'https://crests.football-data.org/65.png',
    fee: '135M €',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/vyqnfz1787493776.png'
  },
  {
    id: 't-4',
    playerName: 'Yan Diomande',
    fromTeam: 'RBL',
    fromLogo: 'https://crests.football-data.org/721.png',
    toTeam: 'RMA',
    toLogo: 'https://crests.football-data.org/86.png',
    fee: '125M €',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/hpe7el1789380888.png'
  },
  {
    id: 't-5',
    playerName: 'Bradley Barcola',
    fromTeam: 'PSG',
    fromLogo: 'https://crests.football-data.org/524.png',
    toTeam: 'LIV',
    toLogo: 'https://crests.football-data.org/64.png',
    fee: '125M €',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/bvm4vi1788550565.png'
  },
  {
    id: 't-6',
    playerName: 'Sandro Tonali',
    fromTeam: 'NEW',
    fromLogo: 'https://crests.football-data.org/67.png',
    toTeam: 'TOT',
    toLogo: 'https://crests.football-data.org/73.png',
    fee: '108M €',
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/v6r6dh1789397617.png'
  }
];

export const TOP_PERFORMANCES: TopPerformance[] = [
  {
    rank: 1,
    name: 'Naomie Feller',
    position: 'Forward',
    matchInfo: 'PSG 5 - 0 OH Leuven',
    homeScore: 5,
    awayScore: 0,
    rating: 10,
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/khc46s1725657673.png',
    clubLogo: 'https://crests.football-data.org/524.png'
  },
  {
    rank: 2,
    name: 'Carlos Espí',
    position: 'Forward',
    matchInfo: 'Levante 0 - 13 Spain U21',
    homeScore: 0,
    awayScore: 13,
    rating: 10,
    avatarUrl: 'https://r2.thesportsdb.com/images/media/player/cutout/d1t2ik1787691507.png',
    clubLogo: 'https://flagcdn.com/w40/es.png'
  }
];

export const INITIAL_STAKING_HISTORY: StakingRecord[] = [
  {
    id: 'dep-1',
    type: 'deposit',
    title: 'Wallet Deposit via Card',
    description: 'Mastercard •••• 9024 (Instant Credit)',
    amount: 100.00,
    amountNGN: 158500,
    reference: 'PAY_17924891',
    paymentMethod: 'Debit Card (Mastercard)',
    status: 'Completed',
    placedTime: 'Today, 11:35',
    date: 'Today'
  },
  {
    id: 'st-1',
    type: 'bet',
    title: 'Match Stake',
    matchTitle: 'Portugal vs Denmark',
    market: 'Match Winner - Portugal',
    odds: 1.65,
    stakeAmount: 50.00,
    amount: 50.00,
    potentialPayout: 82.50,
    status: 'Ongoing',
    placedTime: 'Today, 11:20',
    liveTime: "83' (3 - 1)",
    reference: 'STK_982104'
  },
  {
    id: 'st-2',
    type: 'bet',
    title: 'Match Stake',
    matchTitle: 'Arsenal vs Chelsea',
    market: 'Arsenal to Win',
    odds: 1.25,
    stakeAmount: 100.00,
    amount: 100.00,
    potentialPayout: 125.00,
    status: 'Ongoing',
    placedTime: 'Today, 11:00',
    liveTime: "74' (2 - 1)",
    reference: 'STK_982103'
  },
  {
    id: 'dep-2',
    type: 'deposit',
    title: 'Instant Bank Transfer Deposit',
    description: 'Providus Bank (0124893710) • Virtual Auto-Credit',
    amount: 50.00,
    amountNGN: 79250,
    reference: 'TRF_17829411',
    paymentMethod: 'Instant Bank Transfer',
    status: 'Completed',
    placedTime: 'Today, 10:45',
    date: 'Today'
  },
  {
    id: 'st-3',
    type: 'bet',
    title: 'Match Stake',
    matchTitle: 'Barcelona vs Sevilla',
    market: 'Over 2.5 Goals',
    odds: 1.45,
    stakeAmount: 75.00,
    amount: 75.00,
    potentialPayout: 108.75,
    status: 'Ongoing',
    placedTime: 'Today, 10:30',
    liveTime: "38' (2 - 0)",
    reference: 'STK_982102'
  },
  {
    id: 'st-4',
    type: 'bet',
    title: 'Match Stake',
    matchTitle: 'Liverpool vs Tottenham',
    market: 'Liverpool to Win',
    odds: 1.75,
    stakeAmount: 60.00,
    amount: 60.00,
    potentialPayout: 105.00,
    status: 'Win',
    placedTime: 'Today, 09:30',
    matchScore: '2 - 1 FT',
    reference: 'STK_982101'
  },
  {
    id: 'payout-1',
    type: 'payout',
    title: 'Bank Transfer Payout',
    description: 'Providus Bank • Acc: 0124893710',
    amount: 40.00,
    amountNGN: 63400,
    reference: 'WTH_17748192',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    placedTime: 'Yesterday, 16:40',
    date: 'Yesterday'
  },
  {
    id: 'st-5',
    type: 'bet',
    title: 'Match Stake',
    matchTitle: 'Real Madrid vs Atlético Madrid',
    market: 'Both Teams to Score',
    odds: 1.68,
    stakeAmount: 80.00,
    amount: 80.00,
    potentialPayout: 134.40,
    status: 'Win',
    placedTime: 'Yesterday, 14:15',
    matchScore: '3 - 2 FT',
    reference: 'STK_982099'
  },
  {
    id: 'bonus-1',
    type: 'bonus',
    title: 'Early Access Welcome Bonus',
    description: 'ONEKICKX Verified Player Promotion',
    amount: 25.00,
    reference: 'BNS_100293',
    status: 'Credited',
    placedTime: 'Yesterday, 12:00',
    date: 'Yesterday'
  },
  {
    id: 'st-6',
    type: 'bet',
    title: 'Match Stake',
    matchTitle: 'Roma vs Lazio',
    market: 'Under 2.5 Goals',
    odds: 1.82,
    stakeAmount: 50.00,
    amount: 50.00,
    potentialPayout: 91.00,
    status: 'Win',
    placedTime: 'Yesterday, 10:00',
    matchScore: '1 - 0 FT',
    reference: 'STK_982098'
  }
];
