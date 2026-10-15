import { describe, it, expect } from 'vitest';
import {
  cn,
  calculatePercentage,
  getFormBadgeVariant,
  getStandingZoneStyle,
  formatMatchDate,
} from '@/lib/utils';

describe('Formatadores e Utilitários (src/lib/utils.ts)', () => {
  it('deve combinar classes CSS sem conflitos via cn()', () => {
    const result = cn('px-4 py-2', 'bg-red-500', { 'text-white': true, 'opacity-50': false });
    expect(result).toContain('px-4 py-2');
    expect(result).toContain('bg-red-500');
    expect(result).toContain('text-white');
    expect(result).not.toContain('opacity-50');
  });

  it('deve calcular porcentagem corretamente e limitar entre 0 e 100', () => {
    expect(calculatePercentage(10, 20)).toBe(50);
    expect(calculatePercentage(0, 10)).toBe(0);
    expect(calculatePercentage(5, 0)).toBe(0);
    expect(calculatePercentage(150, 100)).toBe(100);
  });

  it('deve retornar cores corretas para a forma recente (V, E, D)', () => {
    const win = getFormBadgeVariant('V');
    expect(win.label).toBe('Vitória');
    expect(win.text).toContain('emerald');

    const draw = getFormBadgeVariant('E');
    expect(draw.label).toBe('Empate');
    expect(draw.text).toContain('amber');

    const loss = getFormBadgeVariant('D');
    expect(loss.label).toBe('Derrota');
    expect(loss.text).toContain('rose');
  });

  it('deve identificar zonas da tabela de classificação com precisão', () => {
    expect(getStandingZoneStyle(1).zoneName).toBe('Fase de Grupos da Libertadores');
    expect(getStandingZoneStyle(4).zoneName).toBe('Fase de Grupos da Libertadores');
    expect(getStandingZoneStyle(5).zoneName).toBe('Qualificatória da Libertadores');
    expect(getStandingZoneStyle(8).zoneName).toBe('Copa Sul-Americana');
    expect(getStandingZoneStyle(14).zoneName).toBe('Permanência');
    expect(getStandingZoneStyle(18).zoneName).toBe('Zona de Rebaixamento (Z-4)');
  });

  it('deve tratar datas inválidas graciosamente em formatMatchDate()', () => {
    expect(formatMatchDate('invalid-date')).toBe('Data a definir');
  });
});
