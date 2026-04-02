#!/usr/bin/env node
import { runZephyr } from '@hmcts/zephyr-automation-nodejs';
import { createZephyrOptions } from './zephyr-util';
import * as path from 'node:path';

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
zephyrOptions.executionEnvironment = process.env['EXECUTION_ENVIRONMENT'] ?? undefined;
zephyrOptions.executionBuild = process.env['EXECUTION_BUILD'] ?? undefined;
zephyrOptions.executionTestCycleName = process.env['EXECUTION_TEST_CYCLE_NAME'] ?? undefined;
zephyrOptions.executionTestCycleDescription = process.env['EXECUTION_TEST_CYCLE_DESCRIPTION'] ?? undefined;
zephyrOptions.executionTestCycleVersion = process.env['EXECUTION_TEST_CYCLE_VERSION'] ?? undefined;
zephyrOptions.executionAttachEvidence = true;
runZephyr(zephyrOptions);
