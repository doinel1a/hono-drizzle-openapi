import type { TServerBindings } from '@/lib/types';
import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { HTTPException } from 'hono/http-exception';

import { env } from '@/env';
import { INTERNAL_SERVER_ERROR_CODE } from '@/lib/constants/http-status-codes';
import { INTERNAL_SERVER_ERROR_PHRASE } from '@/lib/constants/http-status-phrases';
import DatabaseError from '@/lib/errors/db';

const onError: ErrorHandler<TServerBindings> = (genericError, c) => {
  if (DatabaseError.isKnownError(genericError)) {
    const error = new DatabaseError(genericError);
    c.var.logger.withError(genericError).error(error.message);
    return c.json({ message: error.message }, error.status);
  }

  const statusCode: ContentfulStatusCode =
    genericError instanceof HTTPException ? genericError.status : INTERNAL_SERVER_ERROR_CODE;

  c.var.logger.withError(genericError).error(INTERNAL_SERVER_ERROR_PHRASE);

  return c.json(
    {
      message: genericError.message,
      stack: env.NODE_ENV === 'production' ? undefined : genericError.stack
    },
    statusCode
  );
};

export default onError;
