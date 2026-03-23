import type { ZodSchema } from './types.ts';

import jsonContent from './json-content.js';

function jsonContentRequired<TSchema extends ZodSchema>(schema: TSchema, description: string) {
  return {
    ...jsonContent(schema, description),
    required: true
  };
}

export default jsonContentRequired;
