import dotenv from 'dotenv';
import { z } from 'zod';

import { appEnvSchema } from './schema/app.schema';
import { dbEnvSchema } from './schema/db.schema';
import { tokenEnvSchema } from './schema/token.schema';
import { authEnvSchema } from './schema/auth.schema';
import { otpEnvSchema } from './schema/otp.schema';
import { redisEnvSchema } from './schema/redis.schema';
import { rateLimitEnvSchema } from './schema/rate-limit.schema';
import { sendGridSchema } from './schema/sendgrid.schema';
import { cloudinaryEnvSchema } from './schema/cloudinary.schema';

dotenv.config();

const envSchema = z
  .object({})
  .merge(appEnvSchema)
  .merge(dbEnvSchema)
  .merge(tokenEnvSchema)
  .merge(authEnvSchema)
  .merge(otpEnvSchema)
  .merge(redisEnvSchema)
  .merge(rateLimitEnvSchema)
  // .merge(emailEnvSchema)
  .merge(sendGridSchema)
  .merge(cloudinaryEnvSchema);

z.object({
  ...appEnvSchema.shape,
  ...dbEnvSchema.shape,
  ...tokenEnvSchema.shape,
  ...authEnvSchema.shape,
  ...otpEnvSchema.shape,
  ...redisEnvSchema.shape,
  ...rateLimitEnvSchema.shape,
  // ...emailEnvSchema.shape,
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
