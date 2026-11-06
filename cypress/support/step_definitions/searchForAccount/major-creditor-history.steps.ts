import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { MajorCreditorHistoryFlow } from '../../../e2e/functional/opal/flows/major-creditor-history.flow';
import { createScopedLogger } from '../../utils/log.helper';

const log = createScopedLogger('MajorCreditorHistorySteps');

const majorCreditorHistoryFlow = () => new MajorCreditorHistoryFlow();

/** Stubs the Major Creditor History and notes API with deterministic tab data. */
Given('the Major Creditor History and notes API is stubbed with standard tab data', () => {
  log('step', 'Stub Major Creditor History and notes API with standard tab data');
  majorCreditorHistoryFlow().stubHistoryAndNotesTabData();
});

/** Opens the Major Creditor History and notes tab. */
When('I open the Major Creditor History and notes tab', () => {
  log('step', 'Open Major Creditor History and notes tab');
  majorCreditorHistoryFlow().openHistoryAndNotes();
});

/** Verifies that the Major Creditor History and notes tab shell is displayed. */
Then('I should see the Major Creditor History and notes tab', () => {
  log('assert', 'Assert Major Creditor History and notes tab');
  majorCreditorHistoryFlow().assertHistoryAndNotesShellVisible();
});

/** Verifies Major Creditor History and notes rows loaded. */
Then('I should see the Major Creditor History and notes items load', () => {
  log('assert', 'Major Creditor History and notes items are loaded');
  majorCreditorHistoryFlow().assertHistoryAndNotesItemsLoaded();
});

/** Applies a date filter on the Major Creditor History and notes tab. */
When('I filter the Major Creditor History and notes results by date', () => {
  log('step', 'Filter Major Creditor History and notes results by date');
  majorCreditorHistoryFlow().filterHistoryAndNotesByDate();
});

/** Verifies the Major Creditor History and notes date-filtered result. */
Then('I should see filtered Major Creditor History and notes items', () => {
  log('assert', 'Major Creditor History and notes results show the filtered row');
  majorCreditorHistoryFlow().assertHistoryAndNotesFilteredByDate();
});

/** Opens the first account-linked Major Creditor history item and verifies the target route. */
When('I open the first Major Creditor History and notes account link in a new tab', () => {
  log('step', 'Open first Major Creditor History and notes account link in a new tab');
  majorCreditorHistoryFlow().openHistoryAndNotesAccountLinkInNewTab();
});
