import { LeagueGroup, Match } from '../types';

export interface NextMatchInfo {
  match: Match;
  leagueName: string;
  kickoffTime: string;
  day: string;
  countdownText: string;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  isStartingSoon: boolean;
}

/**
 * Parses match time string (e.g. "20:00", "19:30", "Sun 11:45", "14:15")
 * and computes approximate milliseconds until kickoff relative to current time.
 */
export function getTimeUntilKickoff(timeStr: string): {
  msRemaining: number;
  formattedCountdown: string;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  
  // Try matching HH:MM (e.g., "20:00")
  const hhmmMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (hhmmMatch) {
    const hours = parseInt(hhmmMatch[1], 10);
    const minutes = parseInt(hhmmMatch[2], 10);
    
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);

    // If target is earlier than now today, check if it's tomorrow
    let diffMs = target.getTime() - now.getTime();
    if (diffMs < -1000 * 60 * 60 * 2) {
      // If more than 2 hours in the past, treat as next day or scheduled upcoming
      target.setDate(target.getDate() + 1);
      diffMs = target.getTime() - now.getTime();
    } else if (diffMs < 0) {
      // Just past kickoff time (within 2 hours)
      diffMs = 0;
    }

    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    let formatted = '';
    if (h > 0) {
      formatted = `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    } else if (m > 0) {
      formatted = `${m}m ${String(s).padStart(2, '0')}s`;
    } else if (s > 0) {
      formatted = `${s}s`;
    } else {
      formatted = 'Starting now';
    }

    return {
      msRemaining: diffMs,
      formattedCountdown: formatted,
      hours: h,
      minutes: m,
      seconds: s
    };
  }

  // Fallback for days like "Sun 11:45"
  return {
    msRemaining: 1000 * 60 * 60 * 5, // 5 hours default
    formattedCountdown: '5h 00m',
    hours: 5,
    minutes: 0,
    seconds: 0
  };
}

/**
 * Finds the NEXT upcoming match with its league name, kickoff time, and countdown.
 */
export function findNextUpcomingMatch(
  matches: Match[],
  leagues?: LeagueGroup[]
): NextMatchInfo | null {
  // 1. Filter all upcoming matches
  const upcoming = matches.filter((m) => m.status === 'UPCOMING');

  let chosenMatch: Match | null = null;
  let chosenLeagueName = 'Top Fixtures';

  if (upcoming.length > 0) {
    // Sort by earliest kickoff time today
    const sorted = [...upcoming].sort((a, b) => {
      const aTime = getTimeUntilKickoff(a.time).msRemaining;
      const bTime = getTimeUntilKickoff(b.time).msRemaining;
      return aTime - bTime;
    });
    chosenMatch = sorted[0];
  } else {
    // If no match has status UPCOMING in the current filtered list,
    // look through leagues for an upcoming match or pick first scheduled match
    if (leagues) {
      for (const league of leagues) {
        for (const sub of league.subGroups) {
          const up = sub.matches.find((m) => m.status === 'UPCOMING');
          if (up) {
            chosenMatch = up;
            chosenLeagueName = league.name;
            break;
          }
        }
        if (chosenMatch) break;
      }
    }
  }

  // If still not found, return null
  if (!chosenMatch) return null;

  // Resolve league name if not yet found
  if (chosenLeagueName === 'Top Fixtures' && leagues) {
    for (const league of leagues) {
      for (const sub of league.subGroups) {
        if (sub.matches.some((m) => m.id === chosenMatch!.id)) {
          chosenLeagueName = league.name;
          break;
        }
      }
    }
  }

  const { formattedCountdown, hours, minutes, seconds } = getTimeUntilKickoff(chosenMatch.time);

  return {
    match: chosenMatch,
    leagueName: chosenLeagueName,
    kickoffTime: chosenMatch.time,
    day: chosenMatch.day || 'Today',
    countdownText: formattedCountdown,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    secondsRemaining: seconds,
    isStartingSoon: hours === 0 && minutes < 30
  };
}
