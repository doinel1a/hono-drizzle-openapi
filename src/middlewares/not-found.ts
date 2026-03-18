import type { NotFoundHandler } from 'hono';

import { NOT_FOUND_CODE } from '@/lib/constants/http-status-codes';
import { NOT_FOUND_PHRASE } from '@/lib/constants/http-status-phrases';

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND_PHRASE} - ${c.req.path}`
    },
    NOT_FOUND_CODE
  );
};

export default notFound;
