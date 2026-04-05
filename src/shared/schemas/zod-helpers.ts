import mongoose from 'mongoose';
import { z } from 'zod';

export const zObjectId = (message: string = 'Invalid ObjectId') =>
  z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message });

export const zParamId = (fieldName: string, errorMessage?: string) =>
  z.object({
    [fieldName]: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: errorMessage || `Invalid ${fieldName}`,
    }),
  });

export const zTrimmedStringSchema = (min: number, max: number, message?: string) =>
  z
    .string()
    .trim()
    .min(min, message || `Must be at least ${min} chars`)
    .max(max, message || `Cannot exceed ${max} chars`);

// export const matchFields = <T extends z.ZodRawShape>(
//   schema: z.ZodObject<T>,
//   field1: keyof T,
//   field2: keyof T,
//   message = 'Fields do not match'
// ) => {
//   return schema.refine((data) => data[field1] === data[field2], {
//     message,
//     path: [field2 as string],
//   });
// };
