#!/usr/bin/env node
'use strict';

const { requireInstalledBrowser } = require('./browser-support');

const requestedBrowser = process.argv[2];

try {
  requireInstalledBrowser(requestedBrowser);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
