import type { TRouteHandler } from '@/lib/types';
import type { TListRoute } from './routes';

export const list: TRouteHandler<TListRoute> = (c) => {
  return c.json([
    {
      name: 'Task 1',
      completed: false
    }
  ]);
};
