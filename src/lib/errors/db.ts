import { DrizzleQueryError } from 'drizzle-orm';

const DB_CONNECTION_ERROR_MAP = {
  ECONNREFUSED: 'Database connection refused',
  ENOTFOUND: 'Database host not found',
  ETIMEDOUT: 'Database connection timed out',
  ECONNRESET: 'Database connection reset',
  '28P01': 'Database authentication failed',
  '3D000': 'Database does not exist'
} as const;

const DB_CONFLICT_ERROR_MAP = {
  '23505': 'Database - Duplicate value violates unique constraint'
} as const;

const DB_UNPROCESSABLE_ENTITY_ERROR_MAP = {
  '23502': 'Database - Not null constraint violation',
  '23503': 'Database - Foreign key constraint violation',
  '23514': 'Database - Check constraint violation'
} as const;

type TDBAllErrorsErrorCode = keyof typeof DB_ALL_ERRORS_MAP;
const DB_ALL_ERRORS_MAP = {
  ...DB_CONNECTION_ERROR_MAP,
  ...DB_CONFLICT_ERROR_MAP,
  ...DB_UNPROCESSABLE_ENTITY_ERROR_MAP
} as const;

export default class DatabaseError extends Error {
  constructor(cause: unknown) {
    const code = DatabaseError.extractErrorCode(cause);
    super(code ? DB_ALL_ERRORS_MAP[code] : 'Database - Unknown error');
    this.name = 'DatabaseError';
  }

  static isConnectionError(error: unknown) {
    const code = DatabaseError.extractErrorCode(error);
    return !!code && code in DB_CONNECTION_ERROR_MAP;
  }

  static isConflictError(error: unknown) {
    const code = DatabaseError.extractErrorCode(error);
    return !!code && code in DB_CONFLICT_ERROR_MAP;
  }

  static isUnprocessableEntityError(error: unknown) {
    const code = DatabaseError.extractErrorCode(error);
    return !!code && code in DB_UNPROCESSABLE_ENTITY_ERROR_MAP;
  }

  private static extractErrorCode(error: unknown) {
    if (
      error instanceof DrizzleQueryError &&
      error.cause &&
      'code' in error.cause &&
      typeof error.cause.code === 'string' &&
      error.cause.code in DB_ALL_ERRORS_MAP
    ) {
      return error.cause.code as TDBAllErrorsErrorCode;
    }
  }
}
