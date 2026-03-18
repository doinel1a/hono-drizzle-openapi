import initDocs from '@/lib/init-docs';
import initServer from '@/lib/init-server';
import indexRoute from '@/routes/index.route';

const routes = [indexRoute];

const server = initServer();
initDocs(server);
for (const route of routes) {
  server.route('/', route);
}

export default server;
