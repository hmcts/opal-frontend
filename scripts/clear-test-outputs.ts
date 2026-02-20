#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const outputsDir = path.resolve(process.cwd(), 'function-outputs');
console.log(`[clear-test-outputs] Clearing test outputs in: ${outputsDir}`);
if (fs.existsSync(outputsDir)) {
  const root = path.resolve(outputsDir);
  fs.rmSync(root, { recursive: true, force: true });
}
console.log(`[clear-test-outputs] Done clearing test outputs.`);