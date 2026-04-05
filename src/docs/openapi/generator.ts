import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';
import { openApiExtraConfig } from './config';

export const generateOpenAPI = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'API Docs',
      version: '1.0.0',
    },
  });

  // ✅ Manually extend document
  document.servers = [...openApiExtraConfig.servers];

  document.components = {
    ...document.components,
    securitySchemes: openApiExtraConfig.securitySchemes,
  };

  return document;
};
