import type { OpenAPIHono } from '@hono/zod-openapi';
import type { LogLayer } from 'loglayer';

export type TServerBindings = {
  Variables: {
    logger: LogLayer;
  };
};

export type TOpenApiServer = OpenAPIHono<TServerBindings>;
