import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { LogLayer } from 'loglayer';
import type { TAuth } from './auth';

export type TServerBindings = {
  Variables: {
    session: TAuth['session'];
    user: TAuth['user'];

    logger: LogLayer;
  };
};

export type TOpenApiServer = OpenAPIHono<TServerBindings>;

export type TRouteHandler<T extends RouteConfig> = RouteHandler<T, TServerBindings>;
