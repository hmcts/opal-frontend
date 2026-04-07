#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Resolves the browser to use for generic runs.
 * @description Defaults to Edge, falls back to Chrome when Edge is unavailable, and fails for unsupported requests.
 */

const { resolveGenericBrowser } = require('./browser-support');

try {
  process.stdout.write(resolveGenericBrowser(process.env.BROWSER_TO_RUN));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
