import type { OpenAPIHono } from '@hono/zod-openapi';

import { Scalar } from '@scalar/hono-api-reference';

export default function initDocs(server: OpenAPIHono) {
  server.doc('/docs', {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    }
  });

  server.get(
    '/reference',
    Scalar({
      url: '/docs',
      theme: 'kepler',
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'js'
      }
    })
  );
}
