import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { LogLayer } from 'loglayer';

export type TServerBindings = {
  Variables: {
    logger: LogLayer;
  };
};

export type TOpenApiServer = OpenAPIHono<TServerBindings>;

export type TRouteHandler<T extends RouteConfig> = RouteHandler<T, TServerBindings>;
