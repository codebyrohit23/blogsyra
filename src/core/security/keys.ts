import fs from 'fs';
import path from 'path';

const PRIVATE_KEY_PATH = path.resolve(process.cwd(), 'etc/secrets/private.pem');
const PUBLIC_KEY_PATH = path.resolve(process.cwd(), 'etc/secrets/public.pem');

export const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
export const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
