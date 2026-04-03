import type { TOpenApiServer } from './types';

import { Scalar } from '@scalar/hono-api-reference';

export default function initDocs(server: TOpenApiServer) {
  server.doc('/docs', {
    openapi: '3.1.1',
    info: {
      version: '1.0.0',
      title: 'API Documentation',
      description: 'API documentation for the project'
    },
    security: [{ apiKeyCookie: [] }]
  });

  server.openAPIRegistry.registerComponent('securitySchemes', 'apiKeyCookie', {
    type: 'apiKey',
    in: 'cookie',
    name: 'better-auth.session_token',
    description: 'API Key authentication via cookie'
  });

  server.get(
    '/reference',
    Scalar({
      url: '/api/docs',
      theme: 'default',
      authentication: {
        preferredSecurityScheme: 'apiKeyCookie'
      },
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'js'
      }
    })
  );
}
