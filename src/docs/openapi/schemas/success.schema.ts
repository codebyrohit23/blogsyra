// import '@/docs/openapi/setup';
import { z } from 'zod';

export const successResponse = (dataSchema: z.ZodTypeAny) =>
  z.object({
    success: z.boolean().meta({ example: true }),
    message: z.string().meta({ example: 'Success' }),
    data: dataSchema,
  });
