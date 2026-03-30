/* eslint-disable unicorn/no-null */

import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { env } from '@/env';
import { INTERNAL_SERVER_ERROR_CODE, OK_CODE } from '@/lib/constants/http-status-codes';
import { INTERNAL_SERVER_ERROR_PHRASE } from '@/lib/constants/http-status-phrases';

const onError: ErrorHandler = (error, c) => {
  const environment = c.env?.NODE_ENV ?? env.NODE_ENV;
  const currentStatus = 'status' in error ? error.status : c.newResponse(null).status;
  const statusCode =
    currentStatus === OK_CODE
      ? INTERNAL_SERVER_ERROR_CODE
      : (currentStatus as ContentfulStatusCode);

  c.var['logger'].withError(error).error(INTERNAL_SERVER_ERROR_PHRASE);

  return c.json(
    {
      message: error.message,
      stack: environment === 'production' ? undefined : error.stack
    },
    statusCode
  );
};

export default onError;
