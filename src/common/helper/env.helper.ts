
import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const filename: string = env ? `${env}.env` : 'development.env';
  const fallback: string = resolve(`${dest}/.env`);
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}