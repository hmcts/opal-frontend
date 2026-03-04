#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const outputDirs = ['functional-output', 'smoke-output'];

for (const outputDir of outputDirs) {
  const outputsDir = path.resolve(projectRoot, outputDir);

  console.log(`[setup-test-outputs] Clearing test outputs in: ${outputsDir}`);

  if (fs.existsSync(outputsDir)) {
    fs.rmSync(outputsDir, { recursive: true, force: true });
  }
}

console.log('[setup-test-outputs] Recreated directory structure.');
