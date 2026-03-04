#!/usr/bin/env node
import { runZephyr } from '@hmcts/zephyr-automation-nodejs/cypress';
import { createZephyrOptions } from './zephyr-util';
import path from 'path';

function getArg(name: string): string {
  const arg = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));

  if (!arg) {
    throw new Error(`Missing required argument --${name}`);
  }

  return arg.split('=')[1];
}

const actionType = getArg('action-type');
const processType = getArg('process-type');
const reportPath = path.resolve(process.cwd(), getArg('report-path'));

console.log(`Running Zephyr with actionType=${actionType}, processType=${processType}, reportPath=${reportPath}`);
const zephyrOptions = createZephyrOptions(actionType, processType, reportPath);
//Additional optional environment variables for Zephyr
zephyrOptions.executionEnvironment = process.env['EXECUTION_ENVIRONMENT'] ?? '';
zephyrOptions.executionBuild = process.env['EXECUTION_BUILD'] ?? '';
runZephyr(zephyrOptions);
