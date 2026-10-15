import { ShieldAlert, Target, Award, Home, Plane } from 'lucide-react';
import type { TeamStatisticsDTO } from '@/lib/api-football/types';
import { calculatePercentage } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface TeamStatsGridProps {
  stats: TeamStatisticsDTO;
}

export function TeamStatsGrid({ stats }: TeamStatsGridProps) {
  const { fixtures, goals, clean_sheet } = stats;

  // Cálculos de Aproveitamento
  const homeMatches = fixtures.played.home || 1;
  const awayMatches = fixtures.played.away || 1;
  const totalMatches = fixtures.played.total || 1;

  const homeWinRate = calculatePercentage(fixtures.wins.home, homeMatches);
  const awayWinRate = calculatePercentage(fixtures.wins.away, awayMatches);
  const totalWinRate = calculatePercentage(fixtures.wins.total, totalMatches);

  const cleanSheetRate = calculatePercentage(clean_sheet.total, totalMatches);

  // Intervalos de Gols Marcados (0-15', 16-30', etc.)
  const minuteGoals = goals.for.minute ?? {};
  const intervals = ['0-15', '16-30', '31-45', '46-60', '61-75', '76-90'];

  return (
    <div className="space-y-4">
      {/* Card 1: Aproveitamento & Desempenho Casa vs. Fora */}
      <Card className="p-4 sm:p-5">
        <CardHeader className="mb-4">
          <CardTitle className="text-sm font-bold text-slate-100">
            <Award className="h-4 w-4 text-amber-400" />
            Raio-X: Aproveitamento & Desempenho
          </CardTitle>
          <span className="text-xs font-bold text-red-400">{totalWinRate}% Geral</span>
        </CardHeader>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Em Casa */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Home className="h-3.5 w-3.5 text-emerald-400" />
              <span>Mandante</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-100">{homeWinRate}%</span>
              <span className="text-[11px] text-slate-400">
                {fixtures.wins.home}V - {fixtures.draws.home}E - {fixtures.loses.home}D
              </span>
            </div>
            <Progress value={homeWinRate} indicatorColor="bg-emerald-500" className="mt-2 h-1.5" />
          </div>

          {/* Fora de Casa */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Plane className="h-3.5 w-3.5 text-blue-400" />
              <span>Visitante</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-100">{awayWinRate}%</span>
              <span className="text-[11px] text-slate-400">
                {fixtures.wins.away}V - {fixtures.draws.away}E - {fixtures.loses.away}D
              </span>
            </div>
            <Progress value={awayWinRate} indicatorColor="bg-blue-500" className="mt-2 h-1.5" />
          </div>
        </div>

        {/* Clean Sheets (Jogos sem sofrer gols) */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              <span>Clean Sheets (Jogos Sem Sofrer Gols)</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              {clean_sheet.total} de {totalMatches} jogos ({cleanSheetRate}%)
            </span>
          </div>
          <Progress value={cleanSheetRate} indicatorColor="bg-emerald-500" className="h-2" />
        </div>
      </Card>

      {/* Card 2: Distribuição de Gols por Minutos */}
      <Card className="p-4 sm:p-5">
        <CardHeader className="mb-3">
          <CardTitle className="text-sm font-bold text-slate-100">
            <Target className="h-4 w-4 text-red-500" />
            Momento dos Gols Pró (15' a 15')
          </CardTitle>
          <span className="text-xs text-slate-400">
            Média: {goals.for.average.total} gols/jogo
          </span>
        </CardHeader>

        <div className="grid grid-cols-6 gap-1.5 text-center pt-2">
          {intervals.map((minute) => {
            const data = minuteGoals[minute];
            const count = data?.total ?? 0;
            const percentage = data?.percentage ?? '0%';

            return (
              <div
                key={minute}
                className="flex flex-col items-center justify-end rounded-lg bg-slate-950/40 p-2 border border-slate-800/60"
              >
                <span className="text-xs font-bold text-slate-100">{count}</span>
                <div
                  className="w-full bg-red-500/20 rounded mt-1 mb-1 transition-all"
                  style={{
                    height: `${Math.max(12, Math.min(48, count * 5))}px`,
                    backgroundColor: count > 8 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.3)',
                  }}
                />
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  {minute}'
                </span>
                <span className="text-[9px] text-red-400/80">{percentage}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
