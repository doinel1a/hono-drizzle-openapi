import type { OpenAPIHono } from '@hono/zod-openapi';

export default function initDocs(server: OpenAPIHono) {
  return server.doc('/docs', {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    }
  });
}
