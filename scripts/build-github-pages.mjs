import { existsSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const apiDirectory = resolve('app/api');
const apiStash = resolve('..', 'api.github-pages-disabled');

if (existsSync(apiStash)) throw new Error('Temporary GitHub Pages API directory already exists.');

try {
  if (existsSync(apiDirectory)) renameSync(apiDirectory, apiStash);
  const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, GITHUB_ACTIONS: 'true' },
  });
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  if (existsSync(apiStash)) renameSync(apiStash, apiDirectory);
}
