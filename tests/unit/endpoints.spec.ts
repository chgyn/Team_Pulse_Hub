import { describe, it, expect } from 'vitest';
import {
  getTeamOverview,
  getStandings,
  getFixturesSchedule,
  getTeamSeasonStats,
  getTopScorers,
} from '@/lib/api-football/endpoints';

describe('Endpoints da Camada de Integração (src/lib/api-football/endpoints.ts)', () => {
  it('deve retornar dados do Flamengo (127) via getTeamOverview', async () => {
    const data = await getTeamOverview(127);
    expect(data).toBeDefined();
    expect(data.team.id).toBe(127);
    expect(data.team.name).toBe('Flamengo');
    expect(data.venue.name).toContain('Maracanã');
  });

  it('deve retornar a tabela de classificação completa com 20 clubes', async () => {
    const standings = await getStandings(71, 2026);
    expect(standings).toBeDefined();
    expect(standings.length).toBe(20);
    expect(standings[0].rank).toBe(1);
    expect(standings[0].team.name).toBe('Flamengo');
  });

  it('deve retornar calendário com últimas partidas e partida hero', async () => {
    const schedule = await getFixturesSchedule(127, 2026);
    expect(schedule).toBeDefined();
    expect(schedule.lastFixtures.length).toBeGreaterThan(0);
    expect(schedule.heroMatch).toBeDefined();
  });

  it('deve retornar estatísticas da temporada com minutos de gols', async () => {
    const stats = await getTeamSeasonStats(127, 71, 2026);
    expect(stats).toBeDefined();
    expect(stats.goals.for.minute).toBeDefined();
    expect(stats.clean_sheet.total).toBeGreaterThanOrEqual(0);
  });

  it('deve retornar principais artilheiros do clube', async () => {
    const scorers = await getTopScorers(127, 71, 2026);
    expect(scorers).toBeDefined();
    expect(scorers.length).toBeGreaterThan(0);
    expect(scorers[0].player.name).toBeDefined();
  });

  it('deve resolver o nome correto do clube em getTeamSeasonStats em modo fallback', async () => {
    const palmeirasStats = await getTeamSeasonStats(121, 71, 2026);
    expect(palmeirasStats).toBeDefined();
    expect(palmeirasStats.team.name).toBe('Palmeiras');
    expect(palmeirasStats.team.id).toBe(121);
  });
});
