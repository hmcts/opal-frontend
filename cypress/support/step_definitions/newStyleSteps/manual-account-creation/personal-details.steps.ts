/**
 * @file personal-details.steps.ts
 * @description NewStyle step definitions for Manual Account Creation Personal details.
 */
import { When, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { ManualAccountCreationFlow } from '../../../../e2e/functional/opal/flows/manual-account-creation.flow';
import { log } from '../../../utils/log.helper';

const flow = () => new ManualAccountCreationFlow();

/**
 * @step Provides personal details from Account details using a data table.
 * @description Opens the Personal details task, asserts the header, and completes required fields.
 * @example
 *   When I provide manual personal details from account details:
 *     | title        | Mr        |
 *     | first names  | Firstname |
 *     | last name    | Lastname  |
 *     | address line 1 | Address line 1 |
 */
When('I provide manual personal details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  const payload = {
    title: (data['title'] || '').trim(),
    firstNames: (data['first names'] || '').trim(),
    lastName: (data['last name'] || '').trim(),
    addressLine1: (data['address line 1'] || '').trim(),
  };

  log('step', 'Providing personal details from Account details via table', payload);
  flow().providePersonalDetailsFromAccountDetails(payload);
});
