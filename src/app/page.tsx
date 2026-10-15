import Image from 'next/image';
import {
  getTeamOverview,
  getStandings,
  getFixturesSchedule,
  getTeamSeasonStats,
  getTopScorers,
} from '@/lib/api-football/endpoints';
import type { ClubSelectorOption } from '@/lib/api-football/types';
import { HeroMatch } from '@/components/dashboard/HeroMatch';
import { RecentForm } from '@/components/dashboard/RecentForm';
import { StandingsWidget } from '@/components/dashboard/StandingsWidget';
import { TeamStatsGrid } from '@/components/dashboard/TeamStatsGrid';
import { TopPerformers } from '@/components/dashboard/TopPerformers';
import { TeamSelector } from '@/components/dashboard/TeamSelector';
import { Building2, Calendar, MapPin, AlertCircle } from 'lucide-react';

interface DashboardPageProps {
  searchParams: Promise<{ team?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;

  // Time selecionado via URL ou padrão Flamengo (127)
  const defaultTeamId = Number(process.env.NEXT_PUBLIC_DEFAULT_TEAM_ID ?? 127);
  const activeTeamId = params.team ? Number(params.team) : defaultTeamId;
  const leagueId = Number(process.env.NEXT_PUBLIC_DEFAULT_LEAGUE_ID ?? 71);
  const season = Number(process.env.NEXT_PUBLIC_SEASON ?? 2026);

  // Busca concorrente e resiliente via Promise.allSettled
  const [standingsRes, teamRes, fixturesRes, statsRes, scorersRes] =
    await Promise.allSettled([
      getStandings(leagueId, season),
      getTeamOverview(activeTeamId),
      getFixturesSchedule(activeTeamId, season),
      getTeamSeasonStats(activeTeamId, leagueId, season),
      getTopScorers(activeTeamId, leagueId, season),
    ]);

  const standings = standingsRes.status === 'fulfilled' ? standingsRes.value : [];
  const teamOverview = teamRes.status === 'fulfilled' ? teamRes.value : null;
  const fixturesSchedule =
    fixturesRes.status === 'fulfilled'
      ? fixturesRes.value
      : { lastFixtures: [], nextFixtures: [], heroMatch: null };
  const teamStats = statsRes.status === 'fulfilled' ? statsRes.value : null;
  const scorers = scorersRes.status === 'fulfilled' ? scorersRes.value : [];

  // Alimenta o seletor de clubes a partir da tabela já em cache (zero requisições extras!)
  const availableTeams: ClubSelectorOption[] = standings.map((item) => ({
    id: item.team.id,
    name: item.team.name,
    logo: item.team.logo,
    rank: item.rank,
  }));

  const activeStanding = standings.find((s) => s.team.id === activeTeamId);

  return (
    <div className="space-y-6">
      {/* Barra de Perfil e Seletor do Clube */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {teamOverview?.team.logo && (
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0">
              <Image
                src={teamOverview.team.logo}
                alt={teamOverview.team.name}
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-contain drop-shadow"
                priority
              />
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {teamOverview?.team.name ?? 'Clube'}
              </h1>
              {activeStanding && (
                <span className="rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-xs font-bold text-red-400">
                  {activeStanding.rank}º Lugar
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1 text-xs text-slate-400">
              {teamOverview?.venue.name && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {teamOverview.venue.name}
                </span>
              )}
              {teamOverview?.venue.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {teamOverview.venue.city}
                </span>
              )}
              {teamOverview?.team.founded && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Fundado em {teamOverview.team.founded}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seletor Dinâmico de Times da Série A */}
        <div className="flex items-center justify-end">
          <TeamSelector teams={availableTeams} activeTeamId={activeTeamId} />
        </div>
      </section>

      {/* Aviso Gracioso se Houver Falha Parcial */}
      {standingsRes.status === 'rejected' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Exibindo dados em modo de contingência devido à sobrecarga temporária na fonte externa.
          </span>
        </div>
      )}

      {/* 1. Hero Card (Próximo Confronto ou Partida Ao Vivo) */}
      <HeroMatch fixture={fixturesSchedule.heroMatch} teamVenue={teamVenueSafe(teamOverview)} />

      {/* 2. Barra de Forma Recente (Últimos 5 Jogos) */}
      <RecentForm
        lastFixtures={fixturesSchedule.lastFixtures}
        teamId={activeTeamId}
      />

      {/* 3. Grid Principal (2 Colunas em Desktop / 1 Coluna em Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Tabela Dinâmica do Brasileirão */}
        <div className="lg:col-span-7">
          <StandingsWidget standings={standings} activeTeamId={activeTeamId} />
        </div>

        {/* Coluna 2: Raio-X Estatístico & Destaques Individuais */}
        <div className="lg:col-span-5 space-y-6">
          {teamStats && <TeamStatsGrid stats={teamStats} />}
          <TopPerformers scorers={scorers} />
        </div>
      </div>
    </div>
  );
}

// Helper seguro para tipagem do Venue
function teamVenueSafe(overview: Awaited<ReturnType<typeof getTeamOverview>> | null) {
  if (!overview) return null;
  return overview;
}
