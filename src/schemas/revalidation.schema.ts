import { z } from 'zod';

export const revalidateQuerySchema = z.object({
  tag: z.string().min(1, 'Tag de cache é obrigatória'),
});

export const revalidateHeaderSchema = z.object({
  secret: z.string().min(1, 'Secret de revalidação é obrigatório'),
});

export const triggerSourceSchema = z
  .enum(['webhook', 'manual', 'cron'])
  .default('manual');

export type RevalidateQueryDTO = z.infer<typeof revalidateQuerySchema>;
export type TriggerSourceDTO = z.infer<typeof triggerSourceSchema>;
