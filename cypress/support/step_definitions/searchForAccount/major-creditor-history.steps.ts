import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { MajorCreditorHistoryFlow } from '../../../e2e/functional/opal/flows/major-creditor-history.flow';
import { createScopedLogger } from '../../utils/log.helper';

const log = createScopedLogger('MajorCreditorHistorySteps');

const majorCreditorHistoryFlow = () => new MajorCreditorHistoryFlow();

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
