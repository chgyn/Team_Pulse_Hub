import Image from 'next/image';
import type { FixtureItemDTO } from '@/lib/api-football/types';
import { getFormBadgeVariant } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity } from 'lucide-react';

interface RecentFormProps {
  lastFixtures: FixtureItemDTO[];
  teamId: number;
}

export function RecentForm({ lastFixtures, teamId }: RecentFormProps) {
  // Converte as últimas partidas para o resultado do time selecionado
  const formResults = lastFixtures.slice(0, 5).map((match) => {
    const isHome = match.teams.home.id === teamId;
    const teamGoals = isHome ? (match.goals.home ?? 0) : (match.goals.away ?? 0);
    const opponentGoals = isHome ? (match.goals.away ?? 0) : (match.goals.home ?? 0);
    const opponent = isHome ? match.teams.away : match.teams.home;

    let resultLetter = 'E';
    if (teamGoals > opponentGoals) resultLetter = 'V';
    else if (teamGoals < opponentGoals) resultLetter = 'D';

    return {
      matchId: match.fixture.id,
      letter: resultLetter,
      score: `${match.goals.home ?? 0} x ${match.goals.away ?? 0}`,
      opponentName: opponent.name,
      opponentLogo: opponent.logo,
      isHome,
      round: match.league.round,
    };
  });

  return (
    <Card className="p-4 sm:p-5">
      <CardHeader className="mb-3">
        <CardTitle className="text-sm font-bold text-slate-200">
          <Activity className="h-4 w-4 text-red-500" />
          Forma Recente (Últimos 5 Jogos)
        </CardTitle>
        <span className="text-xs text-slate-400 font-medium">Brasileirão</span>
      </CardHeader>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {formResults.map((item) => {
          const variant = getFormBadgeVariant(item.letter);
          return (
            <div
              key={item.matchId}
              className="group relative flex flex-1 min-w-[56px] flex-col items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/60 cursor-pointer"
            >
              {/* Badge Circular V / E / D */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-black shadow-inner ${variant.bg} ${variant.text} ${variant.border}`}
              >
                {item.letter}
              </div>

              {/* Adversário e Local */}
              <div className="mt-2 flex items-center gap-1">
                <div className="relative h-4 w-4 shrink-0">
                  <Image
                    src={item.opponentLogo}
                    alt={item.opponentName}
                    fill
                    sizes="16px"
                    className="object-contain"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  {item.isHome ? '(C)' : '(F)'}
                </span>
              </div>

              {/* Tooltip no Hover / Touch */}
              <div className="pointer-events-none absolute -top-12 z-20 hidden w-max rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-slate-200 shadow-xl group-hover:flex flex-col items-center">
                <span>vs {item.opponentName} ({item.score})</span>
                <span className="text-[9px] text-slate-400">{item.round}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
