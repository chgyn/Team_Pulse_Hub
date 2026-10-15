import Image from 'next/image';
import Link from 'next/link';
import type { StandingItemDTO } from '@/lib/api-football/types';
import { getStandingZoneStyle } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Trophy } from 'lucide-react';

interface StandingsWidgetProps {
  standings: StandingItemDTO[];
  activeTeamId: number;
}

export function StandingsWidget({ standings, activeTeamId }: StandingsWidgetProps) {
  return (
    <Card className="p-4 sm:p-5">
      <CardHeader className="mb-4">
        <div>
          <CardTitle className="text-sm font-bold text-slate-100">
            <Trophy className="h-4 w-4 text-amber-400" />
            Classificação — Brasileirão Série A
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">Temporada Oficial 2026</p>
        </div>
      </CardHeader>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 pl-2 pr-1 w-8">#</th>
              <th className="py-2.5 px-2">Clube</th>
              <th className="py-2.5 px-2 text-center font-bold text-slate-200">PTS</th>
              <th className="py-2.5 px-2 text-center">J</th>
              <th className="py-2.5 px-2 text-center">V</th>
              <th className="py-2.5 px-2 text-center">E</th>
              <th className="py-2.5 px-2 text-center">D</th>
              <th className="py-2.5 px-2 text-center">SG</th>
              <th className="py-2.5 pr-2 text-center hidden sm:table-cell">Forma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {standings.map((item) => {
              const isSelected = item.team.id === activeTeamId;
              const zone = getStandingZoneStyle(item.rank);

              return (
                <tr
                  key={item.team.id}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-red-500/15 text-white font-bold border-l-4 border-l-red-500'
                      : `hover:bg-slate-800/40 text-slate-300 ${zone.borderClass}`
                  }`}
                >
                  {/* Posição */}
                  <td className="py-2.5 pl-2 pr-1 text-slate-400 text-center font-semibold text-[11px]">
                    <span className={isSelected ? 'text-red-400' : zone.colorClass}>
                      {item.rank}
                    </span>
                  </td>

                  {/* Nome e Escudo do Clube */}
                  <td className="py-2.5 px-2">
                    <Link
                      href={`/?team=${item.team.id}`}
                      className="flex items-center gap-2 group hover:text-white transition-colors"
                      title={`Ver estatísticas do ${item.team.name}`}
                    >
                      <div className="relative h-5 w-5 shrink-0">
                        <Image
                          src={item.team.logo}
                          alt={item.team.name}
                          fill
                          sizes="20px"
                          className="object-contain"
                        />
                      </div>
                      <span className="truncate max-w-[120px] sm:max-w-[160px]">
                        {item.team.name}
                      </span>
                    </Link>
                  </td>

                  {/* Pontos */}
                  <td className="py-2.5 px-2 text-center font-black text-slate-100 text-sm">
                    {item.points}
                  </td>

                  {/* Jogos */}
                  <td className="py-2.5 px-2 text-center text-slate-400">{item.all.played}</td>

                  {/* Vitórias */}
                  <td className="py-2.5 px-2 text-center text-emerald-400">{item.all.win}</td>

                  {/* Empates */}
                  <td className="py-2.5 px-2 text-center text-amber-400">{item.all.draw}</td>

                  {/* Derrotas */}
                  <td className="py-2.5 px-2 text-center text-rose-400">{item.all.lose}</td>

                  {/* Saldo de Gols */}
                  <td
                    className={`py-2.5 px-2 text-center font-semibold ${
                      item.goalsDiff > 0
                        ? 'text-emerald-400'
                        : item.goalsDiff < 0
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.goalsDiff > 0 ? `+${item.goalsDiff}` : item.goalsDiff}
                  </td>

                  {/* Forma Recente (Sm screens) */}
                  <td className="py-2.5 pr-2 text-center hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {item.form
                        ?.slice(-5)
                        .split('')
                        .map((f, idx) => (
                          <span
                            key={idx}
                            className={`inline-block h-2 w-2 rounded-full ${
                              f === 'V' || f === 'W'
                                ? 'bg-emerald-400'
                                : f === 'E'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                            title={`Resultado: ${f}`}
                          />
                        ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legenda de Zonas */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Libertadores (G-4)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span>Pré-Libertadores (G-6)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span>Sul-Americana (G-12)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span>Rebaixamento (Z-4)</span>
        </div>
      </div>
    </Card>
  );
}
