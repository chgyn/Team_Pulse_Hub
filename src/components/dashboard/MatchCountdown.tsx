'use client';

import * as React from 'react';

interface MatchCountdownProps {
  targetDateIso: string;
}

export function MatchCountdown({ targetDateIso }: MatchCountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  React.useEffect(() => {
    function calculate() {
      const targetTime = new Date(targetDateIso).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDateIso]);

  if (timeLeft.isPast) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
        Dia de Jogo / Horário da Partida
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 text-center">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center rounded-xl bg-slate-800/80 px-2.5 py-1.5 min-w-[48px] border border-slate-700/60">
          <span className="text-sm sm:text-base font-extrabold text-white">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-medium uppercase text-slate-400">Dias</span>
        </div>
      )}
      <div className="flex flex-col items-center rounded-xl bg-slate-800/80 px-2.5 py-1.5 min-w-[48px] border border-slate-700/60">
        <span className="text-sm sm:text-base font-extrabold text-white">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-medium uppercase text-slate-400">Horas</span>
      </div>
      <span className="text-slate-500 font-bold">:</span>
      <div className="flex flex-col items-center rounded-xl bg-slate-800/80 px-2.5 py-1.5 min-w-[48px] border border-slate-700/60">
        <span className="text-sm sm:text-base font-extrabold text-white">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-medium uppercase text-slate-400">Min</span>
      </div>
      <span className="text-slate-500 font-bold">:</span>
      <div className="flex flex-col items-center rounded-xl bg-slate-800/80 px-2.5 py-1.5 min-w-[48px] border border-slate-700/60">
        <span className="text-sm sm:text-base font-extrabold text-red-400">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-medium uppercase text-slate-400">Seg</span>
      </div>
    </div>
  );
}
