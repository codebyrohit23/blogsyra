// import fs from 'fs';
// import path from 'path';

// const PRIVATE_KEY_PATH = path.resolve(process.cwd(), 'etc/secrets/private.pem');
// const PUBLIC_KEY_PATH = path.resolve(process.cwd(), 'etc/secrets/public.pem');

// export const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
// export const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');

import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { Environment } from '@/shared/constants';

const isProd = config.app.nodeEnv === Environment.PRODUCTION;

const PRIVATE_KEY_PATH = isProd
  ? '/etc/secrets/private.pem'
  : path.resolve(process.cwd(), 'secrets/private.pem');

const PUBLIC_KEY_PATH = isProd
  ? '/etc/secrets/public.pem'
  : path.resolve(process.cwd(), 'secrets/public.pem');

export const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
export const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
