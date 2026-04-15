import type { TDatabase } from '@/lib/types';

import { honoLogLayer } from '@loglayer/hono';

import { createRouter } from '@/lib/init-server';
import logger from '@/middlewares/logger';
import notFound from '@/middlewares/not-found';
import onError from '@/middlewares/on-error';
import initTasksRoutes from '@/routes/tasks/_index';

export const mockSession = {
  session: {
    id: 'test-session-id',
    token: 'test-token',
    userId: 'test-user-id',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000)
  },
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

export function initTestApp(db: TDatabase) {
  const app = createRouter().basePath('/api');
  app.use(honoLogLayer({ instance: logger }));
  app.notFound(notFound);
  app.onError(onError);

  return app.route('/', initTasksRoutes(db));
}
