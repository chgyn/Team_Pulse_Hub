export const PULSE_MATCHDAY_QUEUE = 'team-pulse:matchday-monitor';

export interface WarmUpMatchDayJobData {
  teamId: number;
  leagueId: number;
  season: number;
  isMatchDay: boolean;
  scheduledAt: string;
}

export interface SyncStandingJobData {
  leagueId: number;
  season: number;
  triggeredBy: string;
}
