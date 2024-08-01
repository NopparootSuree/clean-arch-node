import { ERROR_CODES } from './errorCodes.utils';

export class AppError<T = undefined> extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string,
    public details?: T,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public validationErrors?: Record<string, unknown>[],
  ) {
    super(message, 400, ERROR_CODES.VAL_001);
    this.validationErrors = validationErrors;
  }
}

export class NotFoundError extends AppError<{ resource: string }> {
  constructor(resource: string, errorCode: string = ERROR_CODES.NF_001) {
    super(`${resource} not found`, 404, errorCode, { resource });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, ERROR_CODES.AUTH_001);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, ERROR_CODES.AUTH_004);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, ERROR_CODES.DB_004);
  }
}

export class DatabaseError extends AppError<{ operation?: string }> {
  constructor(message: string = 'Database operation failed', errorCode: string = ERROR_CODES.DB_002, operation?: string) {
    super(message, 500, errorCode, operation ? { operation } : undefined);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, ERROR_CODES.GEN_001);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, ERROR_CODES.GEN_002);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service is currently unavailable') {
    super(message, 503, ERROR_CODES.EXT_001);
  }
}
