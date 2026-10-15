import 'server-only';
import { PULSE_MATCHDAY_QUEUE, type WarmUpMatchDayJobData } from '@/jobs/queues';

/**
 * Worker para sincronização em segundo plano de dias de jogo.
 * Configurado com limite estrito de taxa (Anti-Rate-Limit) para nunca consumir
 * mais do que 5 requisições por minuto na cota diária de 100 da API-Football.
 */
export const matchDayWorkerOptions = {
  queueName: PULSE_MATCHDAY_QUEUE,
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 5000,
  },
  limiter: {
    max: 5,
    duration: 60000, // Máximo de 5 jobs a cada 60 segundos
  },
};

export async function processMatchDayJob(data: WarmUpMatchDayJobData): Promise<{
  success: boolean;
  teamId: number;
  processedAt: string;
}> {
  console.log(`[Worker: MatchDay] Processando aquecimento de cache para o clube: ${data.teamId}`);

  // Simula ou dispara revalidação controlada
  return {
    success: true,
    teamId: data.teamId,
    processedAt: new Date().toISOString(),
  };
}
