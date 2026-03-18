import { getSimplePrettyTerminal, neon } from '@loglayer/transport-simple-pretty-terminal';
import { LogLayer } from 'loglayer';
import { serializeError } from 'serialize-error';

const logger = new LogLayer({
  errorSerializer: serializeError,
  transport: getSimplePrettyTerminal({
    runtime: 'node',
    theme: neon
  })
});

export default logger;
