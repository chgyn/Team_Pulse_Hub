import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Trophy, Shield, Clock } from 'lucide-react';
import { getFixtureDetail } from '@/lib/api-football/endpoints';
import { formatMatchDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const fixtureId = Number(id);

  if (isNaN(fixtureId)) {
    notFound();
  }

  const match = await getFixtureDetail(fixtureId);

  if (!match) {
    notFound();
  }

  const { fixture: info, league, teams, goals } = match;
  const isLive = ['1H', 'HT', '2H', 'ET', 'LIVE'].includes(info.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(info.status.short);

  return (
    <div className="space-y-6">
      {/* Botão de Retorno */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
      </div>

      {/* Card Principal da Partida */}
      <Card glow={isLive} className="p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 uppercase">
              {league.name} • {league.round}
            </span>
          </div>

          <div>
            {isLive ? (
              <Badge variant="live">AO VIVO {info.status.elapsed}'</Badge>
            ) : isFinished ? (
              <Badge variant="default">Encerrado</Badge>
            ) : (
              <Badge variant="outline">Agendado</Badge>
            )}
          </div>
        </div>

        {/* Confronto */}
        <div className="grid grid-cols-3 items-center py-6 text-center">
          {/* Home */}
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-20 sm:h-28 sm:w-28">
              <Image
                src={teams.home.logo}
                alt={teams.home.name}
                fill
                sizes="(max-width: 640px) 80px, 112px"
                className="object-contain"
                priority
              />
            </div>
            <h2 className="mt-3 text-sm sm:text-base font-extrabold text-white">
              {teams.home.name}
            </h2>
            <span className="text-[11px] text-slate-400 font-medium uppercase">Mandante</span>
          </div>

          {/* Placar */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 text-4xl sm:text-6xl font-black text-white">
              <span>{goals.home ?? 0}</span>
              <span className="text-slate-600 text-3xl sm:text-5xl">:</span>
              <span>{goals.away ?? 0}</span>
            </div>
            <span className="mt-2 text-xs font-semibold text-slate-400">
              {info.status.long}
            </span>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-20 sm:h-28 sm:w-28">
              <Image
                src={teams.away.logo}
                alt={teams.away.name}
                fill
                sizes="(max-width: 640px) 80px, 112px"
                className="object-contain"
                priority
              />
            </div>
            <h2 className="mt-3 text-sm sm:text-base font-extrabold text-white">
              {teams.away.name}
            </h2>
            <span className="text-[11px] text-slate-400 font-medium uppercase">Visitante</span>
          </div>
        </div>

        {/* Informações de Local e Horário */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-red-400" />
            <span>{formatMatchDate(info.date)}</span>
          </div>
          {info.referee && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-400" />
              <span>Árbitro: {info.referee}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Linha do Tempo e Escalação Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-red-500" />
            Informações do Confronto
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Fase / Rodada</span>
              <span className="font-semibold text-white">{league.round}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Temporada</span>
              <span className="font-semibold text-white">{league.season}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Fuso Horário</span>
              <span className="font-semibold text-white">{info.timezone}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-amber-400" />
            Estádio e Localização
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Partida oficial homologada pela CBF para o Campeonato Brasileiro Série A. Acompanhamento estatístico atualizado automaticamente via ISR Data Cache.
          </p>
        </Card>
      </div>
    </div>
  );
}
