import initDocs from '@/lib/init-docs';
import initServer from '@/lib/init-server';
import tasksRoute from '@/routes/tasks/_index';

const routes = [tasksRoute];

const server = initServer();
initDocs(server);
for (const route of routes) {
  server.route('/', route);
}

export default server;
