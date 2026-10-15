'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Shield, Check } from 'lucide-react';
import type { ClubSelectorOption } from '@/lib/api-football/types';

interface TeamSelectorProps {
  teams: ClubSelectorOption[];
  activeTeamId: number;
}

export function TeamSelector({ teams, activeTeamId }: TeamSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Fecha o dropdown se o usuário clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTeam = teams.find((t) => t.id === activeTeamId) ?? teams[0];

  const filteredTeams = React.useMemo(() => {
    if (!searchQuery.trim()) return teams;
    return teams.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);

  const handleSelectTeam = (teamId: number) => {
    setIsOpen(false);
    setSearchQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.set('team', String(teamId));
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botão Gatilho do Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-sm font-semibold text-slate-100 shadow-lg backdrop-blur-md transition-all hover:border-red-500/50 hover:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-red-500/40"
        aria-expanded={isOpen}
      >
        {activeTeam?.logo ? (
          <div className="relative h-6 w-6 shrink-0">
            <Image
              src={activeTeam.logo}
              alt={activeTeam.name}
              fill
              sizes="24px"
              className="object-contain"
            />
          </div>
        ) : (
          <Shield className="h-5 w-5 text-red-500" />
        )}
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-tight">{activeTeam?.name ?? 'Selecionar Clube'}</span>
          {activeTeam?.rank && (
            <span className="text-[10px] text-slate-400 leading-tight">
              {activeTeam.rank}º no Brasileirão
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-red-400' : ''
          }`}
        />
      </button>

      {/* Menu Suspenso */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto z-50 mt-2 w-72 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Campo de Busca Rápida */}
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar clube da Série A..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-800/80 py-1.5 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              autoFocus
            />
          </div>

          {/* Lista de Clubes */}
          <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredTeams.length === 0 ? (
              <p className="py-3 text-center text-xs text-slate-400">Nenhum clube encontrado</p>
            ) : (
              filteredTeams.map((team) => {
                const isSelected = team.id === activeTeamId;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => handleSelectTeam(team.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold'
                        : 'text-slate-200 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-5 w-5 shrink-0">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          fill
                          sizes="20px"
                          className="object-contain"
                        />
                      </div>
                      <span className="truncate">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{team.rank}º</span>
                      {isSelected && <Check className="h-4 w-4 text-red-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
