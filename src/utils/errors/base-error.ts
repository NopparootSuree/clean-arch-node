import { ValidationError as ClassValidatorError } from 'class-validator';
import { ERROR_CODES } from './error-codes'; // ต้องแน่ใจว่าได้สร้างไฟล์นี้และกำหนด ERROR_CODES ไว้

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(public errors: ClassValidatorError[]) {
    super('Validation failed', 400, ERROR_CODES.VAL_001);
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, errorCode: string = ERROR_CODES.NF_001) {
    super(`${resource} not found`, 404, errorCode);
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

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', errorCode: string = ERROR_CODES.DB_002) {
    super(message, 500, errorCode);
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
