#!/usr/bin/env node
import { ZephyrCliOptions } from '@hmcts/zephyr-automation-nodejs';
import * as path from 'node:path';

export function createZephyrOptions(actionType: string, processType: string, reportPath: string): ZephyrCliOptions {
  const jiraToken = process.env['JIRA_AUTH_TOKEN'];
  if (!jiraToken) {
    throw new Error('JIRA_AUTH_TOKEN environment variable is required for Zephyr integration');
  }

  const basePath = path.resolve(process.cwd());
  const jiraLocation = path.resolve(process.cwd(), 'lib/uk.gov.hmcts-zephyr-automation-independent.jar');
  return {
    actionType: actionType,
    basePath: basePath,
    reportPath: reportPath,
    processType: processType,
    githubRepoBaseSrcDir: 'https://github.com/hmcts/opal-frontend/tree/master',
    jiraBaseUrl: 'https://api.atlassian.com/ex/jira/d4472f2d-5525-4dc9-8d92-04e5433d9947/rest/api/3',
    jiraProjectId: '10013',
    jiraDefaultUserId: process.env['JIRA_ACCOUNT_ID'] ?? '',
    jiraAuthUsername: process.env['JIRA_ACCOUNT_EMAIL'] ?? '',
    jiraDefaultComponents: 'opal-frontend',
    jiraAuthToken: jiraToken,
    jarLocation: jiraLocation,
    zephyrAccessKey: process.env['ZEPHYR_ACCESS_KEY'] ?? '',
    zephyrSecretKey: process.env['ZEPHYR_SECRET_KEY'] ?? '',
    zephyrAccountId: process.env['ZEPHYR_ACCOUNT_ID'] ?? '',
  };
}
