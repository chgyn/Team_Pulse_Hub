import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Trophy, ArrowRight, Radio } from 'lucide-react';
import type { FixtureItemDTO, TeamVenueDTO } from '@/lib/api-football/types';
import { formatMatchDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { MatchCountdown } from '@/components/dashboard/MatchCountdown';

interface HeroMatchProps {
  fixture: FixtureItemDTO | null;
  teamVenue?: TeamVenueDTO | null;
}

export function HeroMatch({ fixture, teamVenue }: HeroMatchProps) {
  if (!fixture) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="h-10 w-10 text-slate-500 mb-3" />
        <h3 className="text-base font-semibold text-slate-200">Nenhum confronto agendado</h3>
        <p className="text-xs text-slate-400 mt-1">Aguardando definição do calendário pela CBF.</p>
      </Card>
    );
  }

  const { fixture: matchInfo, league, teams, goals } = fixture;
  const status = matchInfo.status.short;
  const isLive = ['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(status);
  const isFinished = ['FT', 'AET', 'PEN'].includes(status);
  const isNotStarted = status === 'NS';

  const venueName = teamVenue?.venue?.name ?? 'Maracanã / Estádio Principal';
  const venueCity = teamVenue?.venue?.city ?? 'Rio de Janeiro';

  return (
    <Card
      glow={isLive}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border-slate-800"
    >
      {/* Background Glow Efeito Stadium */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-slate-800/30 blur-3xl pointer-events-none" />

      {/* Cabeçalho do Card: Competição e Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          {league.logo && (
            <div className="relative h-5 w-5 shrink-0">
              <Image
                src={league.logo}
                alt={league.name}
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>
          )}
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {league.name} • {league.round}
          </span>
        </div>

        <div>
          {isLive ? (
            <Badge variant="live" className="text-xs">
              <Radio className="h-3 w-3 mr-1" />
              AO VIVO {matchInfo.status.elapsed ? `• ${matchInfo.status.elapsed}'` : ''}
            </Badge>
          ) : isFinished ? (
            <Badge variant="default" className="text-xs">
              Encerrado
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-red-400 border-red-500/30 bg-red-500/10">
              Próximo Confronto
            </Badge>
          )}
        </div>
      </div>

      {/* Confronto Principal (Clubes e Placar) */}
      <div className="relative z-10 grid grid-cols-3 items-center py-2 sm:py-4">
        {/* Mandante */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative h-16 w-16 sm:h-24 sm:w-24 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={teams.home.logo}
              alt={teams.home.name}
              fill
              sizes="(max-width: 640px) 64px, 96px"
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <h4 className="mt-2 text-xs sm:text-sm font-bold text-slate-100 max-w-[110px] sm:max-w-none truncate sm:whitespace-normal">
            {teams.home.name}
          </h4>
          <span className="text-[10px] text-slate-400 font-medium uppercase">Mandante</span>
        </div>

        {/* Centro: Placar ou Contagem Regressiva */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          {isLive || isFinished ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 sm:gap-4 font-black tracking-tight text-3xl sm:text-5xl text-white">
                <span className={teams.home.winner ? 'text-red-400' : ''}>
                  {goals.home ?? 0}
                </span>
                <span className="text-slate-600 text-2xl sm:text-4xl">:</span>
                <span className={teams.away.winner ? 'text-red-400' : ''}>
                  {goals.away ?? 0}
                </span>
              </div>
              <span className="mt-1 text-[11px] font-semibold text-slate-400">
                {matchInfo.status.long}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-600">VS</span>
              <MatchCountdown targetDateIso={matchInfo.date} />
            </div>
          )}
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative h-16 w-16 sm:h-24 sm:w-24 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={teams.away.logo}
              alt={teams.away.name}
              fill
              sizes="(max-width: 640px) 64px, 96px"
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <h4 className="mt-2 text-xs sm:text-sm font-bold text-slate-100 max-w-[110px] sm:max-w-none truncate sm:whitespace-normal">
            {teams.away.name}
          </h4>
          <span className="text-[10px] text-slate-400 font-medium uppercase">Visitante</span>
        </div>
      </div>

      {/* Rodapé do Hero: Local, Horário e Link para Detalhes */}
      <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span>{formatMatchDate(matchInfo.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">
              {venueName} — {venueCity}
            </span>
          </div>
        </div>

        <Link
          href={`/match/${matchInfo.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors group"
        >
          <span>MatchCenter</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}
