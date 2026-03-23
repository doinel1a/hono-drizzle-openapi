import { z } from '@hono/zod-openapi';

const idParametersSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: 'id',
      in: 'path',
      required: true
    },
    required: ['id'],
    example: 123
  })
});

export default idParametersSchema;
