// middlewares/validate.ts
import { z } from 'zod';
type ZodTypeAny = z.ZodTypeAny;

import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/shared/utils';
import { ValidationSource } from '@/shared/constants';

export const validate = (schema: ZodTypeAny, source: ValidationSource = ValidationSource.BODY) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req[source]);
    next();
  });
