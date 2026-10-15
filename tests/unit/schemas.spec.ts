import { describe, it, expect } from 'vitest';
import {
  TeamVenueSchema,
  StandingItemSchema,
  FixtureItemSchema,
} from '@/schemas/football-api.schema';
import { revalidateQuerySchema, triggerSourceSchema } from '@/schemas/revalidation.schema';
import { teamParamSchema } from '@/schemas/team-selection.schema';

describe('Validação Zod Schemas', () => {
  it('deve validar estrutura de Team e Estádio', () => {
    const validData = {
      team: {
        id: 127,
        name: 'Flamengo',
        country: 'Brazil',
        logo: 'https://media.api-sports.io/football/teams/127.png',
      },
      venue: {
        name: 'Maracanã',
        city: 'Rio de Janeiro',
        capacity: 78838,
      },
    };

    const result = TeamVenueSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('deve validar parâmetros de seleção de time com fallback para 127', () => {
    const parsedDefault = teamParamSchema.parse({});
    expect(parsedDefault.team).toBe(127);

    const parsedCustom = teamParamSchema.parse({ team: '121' });
    expect(parsedCustom.team).toBe(121);
  });

  it('deve validar query de revalidação de tag de cache', () => {
    const valid = revalidateQuerySchema.safeParse({ tag: 'standings' });
    expect(valid.success).toBe(true);

    const invalid = revalidateQuerySchema.safeParse({ tag: '' });
    expect(invalid.success).toBe(false);
  });

  it('deve validar triggerSourceSchema aceitando webhook, manual e cron com fallback', () => {
    expect(triggerSourceSchema.parse('webhook')).toBe('webhook');
    expect(triggerSourceSchema.parse('cron')).toBe('cron');
    expect(triggerSourceSchema.parse('manual')).toBe('manual');
    expect(triggerSourceSchema.parse(undefined)).toBe('manual');
  });
});
