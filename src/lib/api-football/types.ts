import type {
  TeamVenueDTO,
  FixtureItemDTO,
  StandingItemDTO,
  TeamStatisticsDTO,
  PlayerStatsItemDTO,
} from '@/schemas/football-api.schema';

export type {
  TeamVenueDTO,
  FixtureItemDTO,
  StandingItemDTO,
  TeamStatisticsDTO,
  PlayerStatsItemDTO,
};

export interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: Record<string, string> | string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

export interface FetchFootballOptions {
  revalidate?: number;
  tags?: string[];
  signal?: AbortSignal;
}

export interface FixtureSchedule {
  lastFixtures: FixtureItemDTO[];
  nextFixtures: FixtureItemDTO[];
  heroMatch: FixtureItemDTO | null;
}

export interface ClubSelectorOption {
  id: number;
  name: string;
  logo: string;
  rank: number;
}
