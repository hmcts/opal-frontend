// cypress/support/step_definitions/newStyleSteps/draftAccount.steps.ts
import { Given } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { createDraftAndSetStatus } from '../../../e2e/functional/opal/actions/draftAccount.api';

Given(
  'I create a {string} draft account with the following details and set status {string}:',
  (accountType: 'company' | 'adultOrYouthOnly' | 'pgToPay', newStatus: string, table: DataTable) => {
    return createDraftAndSetStatus(accountType, newStatus, table);
  },
);
