import db from '~/drizzle/db';

import initDocs from '@/lib/init-docs';
import initServer from '@/lib/init-server';
import initTasksRoutes from '@/routes/tasks/_index';

const routes = [initTasksRoutes(db)];

const server = initServer();
initDocs(server);
for (const route of routes) {
  server.route('/', route);
}

export default server;
