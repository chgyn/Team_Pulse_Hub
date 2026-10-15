import { z } from 'zod';

export const teamParamSchema = z.object({
  team: z.coerce.number().int().positive().default(127), // Padrão: 127 (Flamengo)
});

export type TeamParamDTO = z.infer<typeof teamParamSchema>;
