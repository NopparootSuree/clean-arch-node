// src/utils/controller.utils.ts

import { Response } from 'express';
import { validate } from 'class-validator';
import { AppError, InternalServerError, ValidationError, ERROR_CODES } from '@utils/errors';
import { logger } from '@configs/logger.config';

export function handleError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    const response: {
      error: string;
      code: string;
      details?: Record<string, unknown>[];
    } = {
      error: error.message,
      code: error.errorCode,
    };

    if (error instanceof ValidationError && error.validationErrors) {
      response.details = error.validationErrors;
    }

    res.status(error.statusCode).json(response);
  } else if (error instanceof Error) {
    const internalError = new InternalServerError(error.message);
    res.status(internalError.statusCode).json({
      error: internalError.message,
      code: internalError.errorCode,
    });
  } else {
    const internalError = new InternalServerError();
    res.status(internalError.statusCode).json({
      error: internalError.message,
      code: internalError.errorCode,
    });
  }
}

export async function validateDto<T extends object>(dto: T): Promise<void> {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const validationErrors = errors.map((e) => ({
      property: e.property,
      constraints: e.constraints,
    }));
    logger.warn('Validation failed', {
      code: ERROR_CODES.VAL_001,
      errors: validationErrors,
    });
    throw new ValidationError('Validation failed', validationErrors);
  }
}

export function validateId(id: string): number {
  const numId = parseInt(id);
  if (isNaN(numId) || numId <= 0) {
    throw new ValidationError('ID must be a positive number');
  }
  return numId;
}
