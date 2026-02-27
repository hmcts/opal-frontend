#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const outputsDir = path.resolve(projectRoot, 'functional-output');
const zephyrDir = path.resolve(outputsDir, 'zephyr');

console.log(`[setup-test-outputs] Clearing test outputs in: ${outputsDir}`);

if (fs.existsSync(outputsDir)) {
  fs.rmSync(outputsDir, { recursive: true, force: true });
}

// Recreate base structure deterministically
fs.mkdirSync(zephyrDir, { recursive: true });

console.log(`[setup-test-outputs] Recreated directory structure.`);
