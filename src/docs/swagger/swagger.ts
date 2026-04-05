import swaggerUi from 'swagger-ui-express';
import { generateOpenAPI } from '../openapi/generator';
import { Application } from 'express';

export const setupSwagger = (app: Application) => {
  const doc = generateOpenAPI();

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc));
  app.get('/openapi.json', (_, res) => res.json(doc));
};
