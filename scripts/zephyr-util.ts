#!/usr/bin/env node
import { ZephyrCliOptions } from '@hmcts/zephyr-automation-nodejs/cypress';
import path from 'node:path';

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
    jiraBaseUrl: 'https://tools.hmcts.net/jira/rest/api/latest',
    jiraProjectId: '33305',
    jiraDefaultUser: 'Ben.Edwards',
    jiraEpicLinkCustomFieldId: 'customfield_10008',
    jiraDefaultComponents: 'opal-fines-service',
    jiraAuthToken: jiraToken,
    jarLocation: jiraLocation,
  };
}
