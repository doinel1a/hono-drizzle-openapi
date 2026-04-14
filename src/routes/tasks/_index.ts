import type { TDatabase } from '@/lib/types';

import { createRouter } from '@/lib/init-server';

import initHandlers from './handlers';
import * as routes from './routes';

export default function initRoutes(db: TDatabase) {
  const handlers = initHandlers(db);

  return createRouter()
    .openapi(routes.insert, handlers.insert)
    .openapi(routes.selectAll, handlers.selectAll)
    .openapi(routes.selectById, handlers.selectById)
    .openapi(routes.patch, handlers.patch)
    .openapi(routes.deleteById, handlers.deleteById);
}
