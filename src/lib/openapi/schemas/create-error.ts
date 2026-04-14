/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { ZodSchema } from '../utils/types';

import { z } from '@hono/zod-openapi';

export default function createErrorSchema<TSchema extends ZodSchema>(schema: TSchema) {
  const isArrayRoot = schema._zod.def.type === 'array';
  const { error } = schema.safeParse(isArrayRoot ? [] : {});

  return z.object({
    message: z.string().openapi({
      example: 'Validation failed'
    }),
    errors: z
      .array(
        z.object({
          code: z.string(),
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string().optional()
        })
      )
      .optional()
      .openapi({
        example: error?.issues
      })
  });
}
