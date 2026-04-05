import { z } from 'zod';

type ZodError = z.ZodError;
type ZodIssue = z.ZodIssue;

export interface MongoDuplicateKeyError extends Error {
  code: 11000;
  keyValue?: Record<string, unknown>;
  errmsg?: string;
}

export interface MongooseCastError extends Error {
  name: 'CastError';
  path: string;
  value: any;
  kind?: string;
}

export interface MongooseValidationError extends Error {
  name: 'ValidationError';
  errors: Record<
    string,
    {
      message: string;
      kind: string;
      path: string;
      value: unknown;
    }
  >;
}

export interface JWTExpiredError extends Error {
  name: 'TokenExpiredError';
  expiredAt: Date;
}

export interface JWTInvalidError extends Error {
  name: 'JsonWebTokenError';
  message: string;
}

export interface ZodValidationError extends ZodError {
  name: 'ZodError';
  issues: ZodIssue[];
}
