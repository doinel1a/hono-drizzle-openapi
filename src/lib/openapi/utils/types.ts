/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import type { z } from '@hono/zod-openapi';

// @ts-expect-error No problem
export type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;
