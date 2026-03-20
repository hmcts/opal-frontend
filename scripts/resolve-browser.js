#!/usr/bin/env node
'use strict';

const rawBrowser = (process.env.BROWSER_TO_RUN || '').trim().toLowerCase();
process.stdout.write(rawBrowser || 'edge');
