import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS utilizando clsx e tailwind-merge para evitar conflitos de especificidade.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formata data ISO para padrão brasileiro (ex: "18 de Outubro, 21:30" ou "18/10/2026")
 */
export function formatMatchDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return 'Data a definir';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'Data a definir';
  }
}

/**
 * Formata apenas o horário (ex: "16:00")
 */
export function formatMatchTime(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return '--:--';
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '--:--';
  }
}

/**
 * Retorna classe de cor baseada no resultado da forma recente (V, E, D)
 */
export function getFormBadgeVariant(result: 'V' | 'E' | 'D' | string): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  const normalized = result.toUpperCase();
  switch (normalized) {
    case 'V':
    case 'W':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        label: 'Vitória',
      };
    case 'E':
    case 'D_DRAW':
    case 'D':
      if (normalized === 'E') {
        return {
          bg: 'bg-amber-500/15',
          text: 'text-amber-400',
          border: 'border-amber-500/40',
          label: 'Empate',
        };
      }
      return {
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        label: 'Derrota',
      };
    default:
      return {
        bg: 'bg-slate-800/40',
        text: 'text-slate-400',
        border: 'border-slate-700/40',
        label: 'Indefinido',
      };
  }
}

/**
 * Retorna estilo de zona da tabela de classificação (Libertadores, Sul-Americana, Z4)
 */
export function getStandingZoneStyle(rank: number): {
  zoneName: string;
  colorClass: string;
  borderClass: string;
} {
  if (rank >= 1 && rank <= 4) {
    return {
      zoneName: 'Fase de Grupos da Libertadores',
      colorClass: 'text-emerald-400',
      borderClass: 'border-l-4 border-l-emerald-500',
    };
  }
  if (rank >= 5 && rank <= 6) {
    return {
      zoneName: 'Qualificatória da Libertadores',
      colorClass: 'text-cyan-400',
      borderClass: 'border-l-4 border-l-cyan-500',
    };
  }
  if (rank >= 7 && rank <= 12) {
    return {
      zoneName: 'Copa Sul-Americana',
      colorClass: 'text-blue-400',
      borderClass: 'border-l-4 border-l-blue-500',
    };
  }
  if (rank >= 17 && rank <= 20) {
    return {
      zoneName: 'Zona de Rebaixamento (Z-4)',
      colorClass: 'text-rose-400',
      borderClass: 'border-l-4 border-l-rose-500',
    };
  }
  return {
    zoneName: 'Permanência',
    colorClass: 'text-slate-400',
    borderClass: 'border-l-4 border-l-transparent',
  };
}

/**
 * Calcula porcentagem arredondada
 */
export function calculatePercentage(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((part / total) * 100)));
}
