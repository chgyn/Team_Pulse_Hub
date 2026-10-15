import 'server-only';
import type { FetchFootballOptions, ApiFootballResponse } from '@/lib/api-football/types';

const BASE_URL = 'https://v3.football.api-sports.io';

/**
 * Cliente HTTP centralizado para a API-Football v3.
 * Blindado para cota gratuita via Next.js Data Cache com TTLs estratificados e tags de cache.
 */
export async function fetchFootballApi<T>(
  endpoint: string,
  options: FetchFootballOptions = {}
): Promise<T | null> {
  const { revalidate = 43200, tags = [], signal } = options;
  const apiKey = process.env.FOOTBALL_API_KEY?.trim();

  // Caso a chave não esteja configurada no ambiente, retorna null permitindo fallback
  if (!apiKey) {
    console.warn(
      `[API-Football] FOOTBALL_API_KEY não informada. Utilizando fallback para endpoint: ${endpoint}`
    );
    return null;
  }

  const url = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
        Accept: 'application/json',
      },
      next: {
        revalidate,
        tags,
      },
      signal,
    });

    // Tratamento de cota esgotada (429 Too Many Requests)
    if (res.status === 429) {
      console.error(
        `[API-Football] Cota diária de 100 requisições excedida (HTTP 429) para: ${endpoint}`
      );
      return null;
    }

    if (!res.ok) {
      console.error(
        `[API-Football] Erro HTTP ${res.status} (${res.statusText}) em: ${endpoint}`
      );
      return null;
    }

    const json: ApiFootballResponse<T> = await res.json();

    // Verificação de erros no payload retornado pela API-Sports
    if (json.errors && Object.keys(json.errors).length > 0) {
      console.error('[API-Football] Payload retornou erros:', json.errors);
      return null;
    }

    return json.response;
  } catch (error) {
    console.error(`[API-Football] Falha na requisição para ${endpoint}:`, error);
    return null;
  }
}
