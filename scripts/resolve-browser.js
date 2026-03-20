#!/usr/bin/env node
'use strict';

const { resolveGenericBrowser } = require('./browser-support');

try {
  process.stdout.write(resolveGenericBrowser(process.env.BROWSER_TO_RUN));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
