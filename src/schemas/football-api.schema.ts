import { z } from 'zod';

// ==============================================================================
// 1. Team & Venue Schemas
// ==============================================================================
export const TeamVenueSchema = z.object({
  team: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string().nullable().optional(),
    country: z.string(),
    founded: z.number().nullable().optional(),
    national: z.boolean().optional(),
    logo: z.string().url(),
  }),
  venue: z.object({
    id: z.number().nullable().optional(),
    name: z.string(),
    address: z.string().nullable().optional(),
    city: z.string(),
    capacity: z.number().nullable().optional(),
    surface: z.string().nullable().optional(),
    image: z.string().url().nullable().optional(),
  }),
});

// ==============================================================================
// 2. Fixture (Match) Schemas
// ==============================================================================
export const FixtureItemSchema = z.object({
  fixture: z.object({
    id: z.number(),
    referee: z.string().nullable().optional(),
    timezone: z.string(),
    date: z.string(),
    timestamp: z.number(),
    status: z.object({
      long: z.string(),
      short: z.string(), // NS, 1H, HT, 2H, FT, etc.
      elapsed: z.number().nullable().optional(),
    }),
  }),
  league: z.object({
    id: z.number(),
    name: z.string(),
    country: z.string(),
    logo: z.string().url().optional(),
    flag: z.string().url().nullable().optional(),
    season: z.number(),
    round: z.string(),
  }),
  teams: z.object({
    home: z.object({
      id: z.number(),
      name: z.string(),
      logo: z.string().url(),
      winner: z.boolean().nullable().optional(),
    }),
    away: z.object({
      id: z.number(),
      name: z.string(),
      logo: z.string().url(),
      winner: z.boolean().nullable().optional(),
    }),
  }),
  goals: z.object({
    home: z.number().nullable(),
    away: z.number().nullable(),
  }),
  score: z
    .object({
      halftime: z.object({ home: z.number().nullable(), away: z.number().nullable() }).optional(),
      fulltime: z.object({ home: z.number().nullable(), away: z.number().nullable() }).optional(),
    })
    .optional(),
});

// ==============================================================================
// 3. Standings (Classificação) Schemas
// ==============================================================================
export const StandingItemSchema = z.object({
  rank: z.number(),
  team: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().url(),
  }),
  points: z.number(),
  goalsDiff: z.number(),
  group: z.string().optional(),
  form: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  all: z.object({
    played: z.number(),
    win: z.number(),
    draw: z.number(),
    lose: z.number(),
    goals: z.object({
      for: z.number(),
      against: z.number(),
    }),
  }),
  home: z.object({
    played: z.number(),
    win: z.number(),
    draw: z.number(),
    lose: z.number(),
    goals: z.object({
      for: z.number(),
      against: z.number(),
    }),
  }),
  away: z.object({
    played: z.number(),
    win: z.number(),
    draw: z.number(),
    lose: z.number(),
    goals: z.object({
      for: z.number(),
      against: z.number(),
    }),
  }),
});

// ==============================================================================
// 4. Team Season Statistics Schemas
// ==============================================================================
export const GoalsMinuteIntervalSchema = z.object({
  total: z.number().nullable(),
  percentage: z.string().nullable(),
});

export const TeamStatisticsSchema = z.object({
  league: z.object({
    id: z.number(),
    name: z.string(),
    country: z.string(),
    logo: z.string().url().optional(),
    season: z.number(),
  }),
  team: z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().url(),
  }),
  form: z.string().nullable().optional(),
  fixtures: z.object({
    played: z.object({ home: z.number(), away: z.number(), total: z.number() }),
    wins: z.object({ home: z.number(), away: z.number(), total: z.number() }),
    draws: z.object({ home: z.number(), away: z.number(), total: z.number() }),
    loses: z.object({ home: z.number(), away: z.number(), total: z.number() }),
  }),
  goals: z.object({
    for: z.object({
      total: z.object({ home: z.number(), away: z.number(), total: z.number() }),
      average: z.object({ home: z.string(), away: z.string(), total: z.string() }),
      minute: z.record(z.string(), GoalsMinuteIntervalSchema).optional(),
    }),
    against: z.object({
      total: z.object({ home: z.number(), away: z.number(), total: z.number() }),
      average: z.object({ home: z.string(), away: z.string(), total: z.string() }),
      minute: z.record(z.string(), GoalsMinuteIntervalSchema).optional(),
    }),
  }),
  clean_sheet: z.object({
    home: z.number(),
    away: z.number(),
    total: z.number(),
  }),
  cards: z
    .object({
      yellow: z.record(z.string(), GoalsMinuteIntervalSchema).optional(),
      red: z.record(z.string(), GoalsMinuteIntervalSchema).optional(),
    })
    .optional(),
});

// ==============================================================================
// 5. Top Scorers Schemas
// ==============================================================================
export const PlayerStatsItemSchema = z.object({
  player: z.object({
    id: z.number(),
    name: z.string(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    age: z.number().nullable().optional(),
    nationality: z.string().nullable().optional(),
    photo: z.string().url(),
  }),
  statistics: z.array(
    z.object({
      team: z.object({
        id: z.number(),
        name: z.string(),
        logo: z.string().url(),
      }),
      league: z.object({
        id: z.number(),
        name: z.string(),
      }),
      games: z.object({
        appearances: z.number().nullable().optional(),
        lineups: z.number().nullable().optional(),
        minutes: z.number().nullable().optional(),
        position: z.string().nullable().optional(),
      }),
      goals: z.object({
        total: z.number().nullable(),
        assists: z.number().nullable().optional(),
      }),
      cards: z.object({
        yellow: z.number().nullable().optional(),
        red: z.number().nullable().optional(),
      }),
    })
  ),
});

// Exported Types
export type TeamVenueDTO = z.infer<typeof TeamVenueSchema>;
export type FixtureItemDTO = z.infer<typeof FixtureItemSchema>;
export type StandingItemDTO = z.infer<typeof StandingItemSchema>;
export type TeamStatisticsDTO = z.infer<typeof TeamStatisticsSchema>;
export type PlayerStatsItemDTO = z.infer<typeof PlayerStatsItemSchema>;
