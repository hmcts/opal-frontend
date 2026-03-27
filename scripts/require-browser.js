#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Validates that an explicitly requested browser is installed before a browser-specific run starts.
 * @description Used by Edge- and Firefox-specific scripts to fail fast with a clear browser-missing message.
 */

const { requireInstalledBrowser } = require('./browser-support');

const requestedBrowser = process.argv[2];

try {
  requireInstalledBrowser(requestedBrowser);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
