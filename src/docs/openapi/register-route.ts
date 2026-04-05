import { registry } from './registry';
import { z } from 'zod';

import { successResponse } from './schemas/success.schema';
import { errorResponse } from './schemas/error.schema';
import { HttpMethod } from '@/shared/constants';

type RouteConfig = {
  method: HttpMethod;
  path: string;
  tag: string;
  summary?: string;
  body?: z.ZodTypeAny;
  response?: z.ZodTypeAny;
  auth?: boolean;
};

const jsonContent = (schema: z.ZodTypeAny) => ({
  'application/json': {
    schema: schema,
  },
});

export const registerRoute = (config: RouteConfig) => {
  const { method, path, tag, summary, body, response, auth } = config;

  registry.registerPath({
    method,
    path,
    tags: [tag],
    summary,

    request: body
      ? {
          body: {
            content: jsonContent(body),
          } as any,
        }
      : undefined,

    responses: {
      200: {
        description: 'Success',
        content: response ? jsonContent(successResponse(response)) : undefined,
      },
      400: {
        description: 'Bad Request',
        content: jsonContent(errorResponse),
      },
    } as any,

    security: auth ? [{ bearerAuth: [] }] : undefined,
  });
};
