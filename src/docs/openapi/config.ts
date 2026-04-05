import { config } from '@/core/config';

export const openApiExtraConfig = {
  servers: [
    {
      url: config.app.apiBaseUrl.concat('/api/v1'),
    },
  ],
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
} as const;
