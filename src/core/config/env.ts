import dotenv from 'dotenv';
import { z } from 'zod';

import {
  appEnvSchema,
  dbEnvSchema,
  redisEnvSchema,
  cloudinaryEnvSchema,
  otpEnvSchema,
  sendGridSchema,
  authEnvSchema,
} from './schema';

dotenv.config();

const envSchema = z
  .object({})
  .merge(appEnvSchema)
  .merge(dbEnvSchema)
  .merge(authEnvSchema)
  .merge(otpEnvSchema)
  .merge(redisEnvSchema)
  .merge(sendGridSchema)
  .merge(cloudinaryEnvSchema);

z.object({
  ...appEnvSchema.shape,
  ...dbEnvSchema.shape,
  ...authEnvSchema.shape,
  ...otpEnvSchema.shape,
  ...redisEnvSchema.shape,
  ...sendGridSchema.shape,
  ...cloudinaryEnvSchema.shape,
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = (() => {
  const parsed = envSchema.safeParse(process.env);

  // console.log(JSON.stringify(process.env, null, 2));

  if (!parsed.success) {
    console.error('❌ Environment validation failed:');

    parsed.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });

    process.exit(1);
  }

  return parsed.data;
})();
