import * as authSchemas from './auth';
import { tasksSchema } from './tasks';

const schema = {
  users: authSchemas.usersSchema,
  sessions: authSchemas.sessionsSchema,
  accounts: authSchemas.accountsSchema,
  verifications: authSchemas.verificationsSchema,
  tasks: tasksSchema
};

export type TSchema = typeof schema;

export default schema;
