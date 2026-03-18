import initServer from '@/lib/init-server';

const server = initServer();

server.get('/', (c) => c.text('Hello, World!'));

export default server;
