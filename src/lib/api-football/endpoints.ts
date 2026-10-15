import 'server-only';
import { fetchFootballApi } from '@/lib/api-football/client';
import type {
  TeamVenueDTO,
  FixtureItemDTO,
  StandingItemDTO,
  TeamStatisticsDTO,
  PlayerStatsItemDTO,
  FixtureSchedule,
} from '@/lib/api-football/types';
import {
  mockTeamOverview,
  mockStandings,
  mockLastFixtures,
  mockNextFixtures,
  mockTeamStatistics,
  mockTopScorers,
} from '@/lib/api-football/mock-data';

// ==============================================================================
// 1. Visão Geral do Time & Estádio
// Cache: 7 dias (604.800 s) — Tag: team-info-{teamId}
// ==============================================================================
export async function getTeamOverview(teamId: number): Promise<TeamVenueDTO> {
  const data = await fetchFootballApi<TeamVenueDTO[]>(`/teams?id=${teamId}`, {
    revalidate: 604800,
    tags: [`team-info`, `team-info-${teamId}`],
  });

  if (data && data.length > 0) {
    return data[0];
  }

  // Fallback quando a chave não estiver configurada ou for o Flamengo (127)
  if (teamId === 127) {
    return mockTeamOverview;
  }

  // Tenta extrair dados do time a partir da tabela de classificação em mock
  const fallbackFromStanding = mockStandings.find((s) => s.team.id === teamId);
  return {
    team: {
      id: teamId,
      name: fallbackFromStanding?.team.name ?? `Clube #${teamId}`,
      code: fallbackFromStanding?.team.name.slice(0, 3).toUpperCase() ?? 'CLU',
      country: 'Brazil',
      founded: 1900,
      national: false,
      logo:
        fallbackFromStanding?.team.logo ??
        `https://media.api-sports.io/football/teams/${teamId}.png`,
    },
    venue: {
      id: null,
      name: 'Estádio Principal',
      city: 'Brasil',
      capacity: 45000,
      surface: 'grass',
      image: null,
    },
  };
}

// ==============================================================================
// 2. Tabela de Classificação do Campeonato
// Cache: 12 horas (43.200 s) — Tag: standings
// ==============================================================================
export async function getStandings(
  leagueId: number,
  season: number
): Promise<StandingItemDTO[]> {
  const data = await fetchFootballApi<{ league: { standings: StandingItemDTO[][] } }[]>(
    `/standings?league=${leagueId}&season=${season}`,
    {
      revalidate: 43200,
      tags: ['standings', `standings-${leagueId}-${season}`],
    }
  );

  if (data && data.length > 0 && data[0].league?.standings?.[0]) {
    return data[0].league.standings[0];
  }

  return mockStandings;
}

// ==============================================================================
// 3. Calendário de Partidas (Últimos 5 e Próximos 5 Jogos em Paralelo)
// Cache: 4 horas (14.400 s) — Tag: fixtures-{teamId}
// ==============================================================================
export async function getFixturesSchedule(
  teamId: number,
  season: number
): Promise<FixtureSchedule> {
  const [lastRes, nextRes] = await Promise.allSettled([
    fetchFootballApi<FixtureItemDTO[]>(
      `/fixtures?team=${teamId}&season=${season}&last=5`,
      {
        revalidate: 14400,
        tags: ['fixtures', `fixtures-${teamId}`],
      }
    ),
    fetchFootballApi<FixtureItemDTO[]>(
      `/fixtures?team=${teamId}&season=${season}&next=5`,
      {
        revalidate: 14400,
        tags: ['fixtures', `fixtures-${teamId}`],
      }
    ),
  ]);

  const lastFixtures =
    lastRes.status === 'fulfilled' && lastRes.value ? lastRes.value : mockLastFixtures;
  const nextFixtures =
    nextRes.status === 'fulfilled' && nextRes.value ? nextRes.value : mockNextFixtures;

  // Encontra a partida destaque (Hero): próximo jogo, jogo ao vivo ou último confronto
  const heroMatch = nextFixtures.length > 0 ? nextFixtures[0] : lastFixtures[0] ?? null;

  return {
    lastFixtures,
    nextFixtures,
    heroMatch,
  };
}

// ==============================================================================
// 4. Estatísticas da Temporada do Clube
// Cache: 12 horas (43.200 s) — Tag: team-stats-{teamId}
// ==============================================================================
export async function getTeamSeasonStats(
  teamId: number,
  leagueId: number,
  season: number
): Promise<TeamStatisticsDTO> {
  const data = await fetchFootballApi<TeamStatisticsDTO>(
    `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`,
    {
      revalidate: 43200,
      tags: ['team-stats', `team-stats-${teamId}`],
    }
  );

  if (data && data.fixtures) {
    return data;
  }

  // Resolve o nome e o escudo corretos do clube selecionado a partir da tabela
  const clubInStandings = mockStandings.find((s) => s.team.id === teamId);
  const teamName =
    clubInStandings?.team.name ?? (teamId === 127 ? 'Flamengo' : `Clube #${teamId}`);
  const teamLogo =
    clubInStandings?.team.logo ??
    (teamId === 127
      ? mockTeamOverview.team.logo
      : `https://media.api-sports.io/football/teams/${teamId}.png`);

  return {
    ...mockTeamStatistics,
    team: {
      id: teamId,
      name: teamName,
      logo: teamLogo,
    },
  };
}

// ==============================================================================
// 5. Maiores Artilheiros & Assistências do Elenco
// Cache: 12 horas (43.200 s) — Tag: squad-stats-{leagueId}
// ==============================================================================
export async function getTopScorers(
  teamId: number,
  leagueId: number,
  season: number
): Promise<PlayerStatsItemDTO[]> {
  const data = await fetchFootballApi<PlayerStatsItemDTO[]>(
    `/players/topscorers?league=${leagueId}&season=${season}`,
    {
      revalidate: 43200,
      tags: ['squad-stats', `squad-stats-${leagueId}-${season}`],
    }
  );

  if (data && data.length > 0) {
    // Filtra apenas jogadores que atuam pelo time selecionado
    const teamScorers = data.filter((item) =>
      item.statistics.some((stat) => stat.team.id === teamId)
    );

    if (teamScorers.length > 0) {
      return teamScorers.slice(0, 5);
    }
  }

  return mockTopScorers;
}

// ==============================================================================
// 6. Detalhes de Partida ao Vivo / Específica
// Cache: 60 segundos — Tag: live-match-{fixtureId}
// ==============================================================================
export async function getFixtureDetail(fixtureId: number): Promise<FixtureItemDTO | null> {
  const data = await fetchFootballApi<FixtureItemDTO[]>(`/fixtures?id=${fixtureId}`, {
    revalidate: 60,
    tags: ['live-match', `live-match-${fixtureId}`],
  });

  if (data && data.length > 0) {
    return data[0];
  }

  const allMocks = [...mockLastFixtures, ...mockNextFixtures];
  return allMocks.find((m) => m.fixture.id === fixtureId) ?? null;
}
