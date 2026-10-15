import Image from 'next/image';
import { Flame, Footprints, Shield } from 'lucide-react';
import type { PlayerStatsItemDTO } from '@/lib/api-football/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

interface TopPerformersProps {
  scorers: PlayerStatsItemDTO[];
}

export function TopPerformers({ scorers }: TopPerformersProps) {
  const topPlayers = scorers.slice(0, 3);

  return (
    <Card className="p-4 sm:p-5">
      <CardHeader className="mb-3">
        <CardTitle className="text-sm font-bold text-slate-100">
          <Flame className="h-4 w-4 text-orange-400" />
          Destaques Individuais (Gols & Assistências)
        </CardTitle>
        <span className="text-xs text-slate-400">Temporada 2026</span>
      </CardHeader>

      <div className="space-y-3">
        {topPlayers.length === 0 ? (
          <p className="py-4 text-center text-xs text-slate-400">
            Nenhuma estatística individual disponível no momento.
          </p>
        ) : (
          topPlayers.map((item, index) => {
            const stats = item.statistics[0];
            const goals = stats?.goals.total ?? 0;
            const assists = stats?.goals.assists ?? 0;
            const matches = stats?.games.appearances ?? 0;

            return (
              <div
                key={item.player.id}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 transition-colors hover:border-slate-700 hover:bg-slate-900/50"
              >
                {/* Posição e Foto */}
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-slate-300">
                    {index + 1}
                  </span>
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                    {item.player.photo ? (
                      <Image
                        src={item.player.photo}
                        alt={item.player.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <Shield className="h-6 w-6 text-slate-500 m-auto mt-2.5" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                      {item.player.name}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{stats?.games.position ?? 'Jogador'}</span>
                      <span>•</span>
                      <span>{matches} jogos</span>
                    </div>
                  </div>
                </div>

                {/* Métricas: Gols e Assistências */}
                <div className="flex items-center gap-3 text-right">
                  <div className="flex flex-col items-center min-w-[36px]">
                    <div className="flex items-center gap-1 text-xs font-black text-red-400">
                      <Flame className="h-3 w-3" />
                      <span>{goals}</span>
                    </div>
                    <span className="text-[10px] uppercase text-slate-400 font-medium">Gols</span>
                  </div>

                  <div className="flex flex-col items-center min-w-[36px]">
                    <div className="flex items-center gap-1 text-xs font-black text-cyan-400">
                      <Footprints className="h-3 w-3" />
                      <span>{assists}</span>
                    </div>
                    <span className="text-[10px] uppercase text-slate-400 font-medium">Assists</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
