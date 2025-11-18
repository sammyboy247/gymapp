/**
 * Runner for seed data script
 * Executes the seed script with proper Vite environment loading
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedScriptPath = resolve(__dirname, '../src/scripts/seedData.ts');

console.log('Starting seed script with vite-node...\n');

const seedProcess = spawn('npx', ['vite-node', seedScriptPath], {
  stdio: 'inherit',
  shell: true,
  cwd: resolve(__dirname, '..')
});

seedProcess.on('close', (code) => {
  process.exit(code || 0);
});
