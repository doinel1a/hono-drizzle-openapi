import { createRouter } from '@/lib/init-server';

import * as handlers from './handlers';
import * as routes from './routes';

const router = createRouter()
  .openapi(routes.insert, handlers.insert)
  .openapi(routes.selectAll, handlers.selectAll)
  .openapi(routes.selectById, handlers.selectById)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.deleteById, handlers.deleteById);

export default router;
