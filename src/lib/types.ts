import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { TSchema } from '~/drizzle/schemas';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
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

export type TDatabase = PgDatabase<PgQueryResultHKT, TSchema, ExtractTablesWithRelations<TSchema>>;
