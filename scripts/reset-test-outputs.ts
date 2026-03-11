#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const outputDirs = ['functional-output', 'smoke-output'];

for (const outputDir of outputDirs) {
  const outputsDir = path.resolve(projectRoot, outputDir);
  if (fs.existsSync(outputsDir)) {
    fs.rmSync(outputsDir, { recursive: true, force: true });
  }
}