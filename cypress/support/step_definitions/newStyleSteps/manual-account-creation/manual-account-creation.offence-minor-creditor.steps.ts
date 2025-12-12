/**
 * @file manual-account-creation.offence-minor-creditor.steps.ts
 * @description Minor creditor step definitions for Manual Account Creation offence journeys.
 */
import { When, Then, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { normalizeHash } from '../../../utils/cucumberHelpers';
import { log } from '../../../utils/log.helper';
import { ManualOffenceDetailsLocators as L } from '../../../../shared/selectors/manual-account-creation/offence-details.locators';
import {
  flow,
  getCurrentOffenceCode,
  getCurrentImpositionIndex,
  minorCreditor,
  offenceDetails,
  offenceReview,
  setCurrentOffenceCode,
  setCurrentImpositionIndex,
} from './manual-account-creation.offence.stepshelper';

const ensureOnOffenceDetailsFromReview = (): Cypress.Chainable => {
  return cy.get('body').then(($body) => {
    const onReview = $body.find(L.review.offenceComponent).length > 0;
    if (!onReview) {
      return;
    }
    const offenceCode = getCurrentOffenceCode();
    if (!offenceCode) {
      throw new Error('Current offence code is unknown; cannot navigate to change imposition.');
    }
    offenceReview().clickChangeOffence(offenceCode);
    offenceDetails().assertOnAddOffencePage();
  });
};

/**
 * @step Fill individual minor creditor form for an imposition.
 * @description Fill individual minor creditor form for an imposition.

 * @param imposition - 1-based imposition number.
 * @param table - DataTable of fields (Title, First name, Last name, Address lines, Postcode).
 * @example
 *   When I maintain minor creditor details for imposition 1:
 *     | Title         | Mr      |
 *     | First name    | John    |
 *     | Last name     | Smith   |
 *     | Address line 1| Addr 1  |
 *     | Postcode      | AB1 2CD |
 */
When('I maintain minor creditor details for imposition {int}:', (imposition: number, table: DataTable) => {
  const data = normalizeHash(table);
  const payload = {
    title: data['Title'],
    firstNames: data['First name'],
    lastName: data['Last name'],
    address1: data['Address line 1'],
    address2: data['Address line 2'],
    address3: data['Address line 3'],
    postcode: data['Postcode'],
  };

  setCurrentImpositionIndex(imposition - 1);
  log('flow', 'Maintaining individual minor creditor details', { imposition, payload });
  flow().maintainIndividualMinorCreditor(imposition, payload);
});

/**
 * @step Fill company minor creditor form for an imposition.
 * @description Fill company minor creditor form for an imposition.

 * @param imposition - 1-based imposition number.
 * @param table - DataTable of fields (Company, Address lines, Postcode).
 * @example
 *   When I maintain company minor creditor details for imposition 2:
 *     | Company        | ACME Ltd |
 *     | Address line 1 | Addr 1   |
 *     | Postcode       | AB1 2CD  |
 */
When('I maintain company minor creditor details for imposition {int}:', (imposition: number, table: DataTable) => {
  const data = normalizeHash(table);
  const payload = {
    company: data['Company'],
    address1: data['Address line 1'],
    address2: data['Address line 2'],
    address3: data['Address line 3'],
    postcode: data['Postcode'],
  };

  setCurrentImpositionIndex(imposition - 1);
  log('flow', 'Maintaining company minor creditor details', { imposition, payload });
  flow().maintainCompanyMinorCreditor(imposition, payload);
});

/**
 * @step Populate BACS payment fields on the minor creditor form.
 * @description Populate BACS payment fields on the minor creditor form.

 * @param _imposition - 1-based imposition number (unused; retained for Gherkin clarity).
 * @param table - DataTable for accountName, sortCode, accountNumber, paymentReference.
 */
When('I maintain BACS payment details for imposition {int}:', (imposition: number, table: DataTable) => {
  const data = normalizeHash(table);
  const accountName = data['Account name'] ?? data['Name on account'] ?? data['Name on the account'];
  const payload = {
    accountName,
    sortCode: data['Sort code'],
    accountNumber: data['Account number'],
    paymentReference: data['Payment reference'],
  };

  setCurrentImpositionIndex(imposition - 1);
  log('flow', 'Maintaining BACS payment details', { imposition, payload });
  flow().maintainMinorCreditorBacsDetails(imposition, payload);
});

/**
 * @step Fill and save an individual minor creditor with optional BACS.
 * @description Fill and save an individual minor creditor with optional BACS.

 * @param imposition - 1-based imposition number.
 * @param table - DataTable covering individual fields and optional BACS details.
 */
When(
  'I maintain individual minor creditor with BACS details for imposition {int}:',
  (imposition: number, table: DataTable) => {
    const data = normalizeHash(table);
    const accountName = data['Account name'] ?? data['Name on account'] ?? data['Name on the account'];
    const payload = {
      title: data['Title'],
      firstNames: data['First name'],
      lastName: data['Last name'],
      address1: data['Address line 1'],
      address2: data['Address line 2'],
      address3: data['Address line 3'],
      postcode: data['Postcode'],
      accountName,
      sortCode: data['Sort code'],
      accountNumber: data['Account number'],
      paymentReference: data['Payment reference'],
    };

    log('flow', 'Maintaining individual minor creditor with BACS', { imposition, payload });
    flow().maintainIndividualMinorCreditorWithBacs(imposition, payload);
  },
);

/**
 * @step Fill and save a company minor creditor with optional BACS.
 * @description Fill and save a company minor creditor with optional BACS.

 * @param imposition - 1-based imposition number.
 * @param table - DataTable covering company fields and optional BACS details.
 */
When(
  'I maintain company minor creditor with BACS details for imposition {int}:',
  (imposition: number, table: DataTable) => {
    const data = normalizeHash(table);
    const accountName = data['Account name'] ?? data['Name on account'] ?? data['Name on the account'];
    const payload = {
      company: data['Company'],
      address1: data['Address line 1'],
      address2: data['Address line 2'],
      address3: data['Address line 3'],
      postcode: data['Postcode'],
      accountName,
      sortCode: data['Sort code'],
      accountNumber: data['Account number'],
      paymentReference: data['Payment reference'],
    };

    log('flow', 'Maintaining company minor creditor with BACS', { imposition, payload });
    flow().maintainCompanyMinorCreditorWithBacs(imposition, payload);
  },
);

/**
 * @step Update an existing individual minor creditor with optional BACS.
 * @description Update an existing individual minor creditor with optional BACS.

 * @param imposition - 1-based imposition number.
 * @param table - DataTable of fields to update (individual + optional BACS).
 */
When(
  'I update individual minor creditor with BACS details for imposition {int}:',
  (imposition: number, table: DataTable) => {
    const data = normalizeHash(table);
    const accountName = data['Account name'] ?? data['Name on account'] ?? data['Name on the account'];
    const payload = {
      title: data['Title'],
      firstNames: data['First name'],
      lastName: data['Last name'],
      address1: data['Address line 1'],
      address2: data['Address line 2'],
      address3: data['Address line 3'],
      postcode: data['Postcode'],
      accountName,
      sortCode: data['Sort code'],
      accountNumber: data['Account number'],
      paymentReference: data['Payment reference'],
    };

    setCurrentImpositionIndex(imposition - 1);

    ensureOnOffenceDetailsFromReview().then(() => {
      flow().updateIndividualMinorCreditorWithBacs(imposition, payload);
    });
  },
);

/**
 * @step Save minor creditor details for an imposition.
 * @description Save minor creditor details for an imposition.

 * @param _imposition - 1-based imposition number (unused; kept for signature parity).
 */
When('I save the minor creditor details for imposition {int}', () => {
  minorCreditor().save();
});

/**
 * @step Seed an offence with two minor creditor impositions.
 * @description Seed an offence with two minor creditor impositions.

 * @param offenceCode - Offence code to seed.
 */
Given('an offence exists with 2 minor creditor impositions for offence code {string}', (offenceCode: string) => {
  log('flow', 'Creating offence with two minor creditors', { offenceCode });
  flow().seedOffenceWithTwoMinorCreditors(offenceCode);
  setCurrentOffenceCode(offenceCode);
});

/**
 * @step Select creditor type or minor creditor type based on label.
 * @description Select creditor type or minor creditor type based on label.

 * @param label - Text containing "major/minor creditor" or "Individual/Company".
 * @example When I select the "Minor creditor" radio button
 */
When('I select the minor creditor radio option {string}', (label: string) => {
  const index = getCurrentImpositionIndex();
  log('click', 'Selecting minor/major or minor creditor type via flow', { label, index });
  flow().selectMinorCreditorRadioOption(label, index);
});

/**
 * @step Toggle the BACS checkbox on the minor creditor form ON.
 * @description Toggle the BACS checkbox on the minor creditor form ON.

 */
When('I select the "I have BACS payment details" checkbox', () => {
  log('click', 'Selecting BACS checkbox');
  minorCreditor().togglePayByBacs(true);
});

/**
 * @step Toggle the BACS checkbox on the minor creditor form OFF.
 * @description Toggle the BACS checkbox on the minor creditor form OFF.

 */
When('I unselect the "I have BACS payment details" checkbox', () => {
  log('click', 'Unselecting BACS checkbox');
  minorCreditor().togglePayByBacs(false);
});

/**
 * @step Assert which minor creditor type radio is selected.
 * @description Assert which minor creditor type radio is selected.

 * @param label - Text containing "Individual" or "Company".
 */
Then('the minor creditor radio option {string} is selected', (label: string) => {
  const normalized = label.toLowerCase();
  const type = normalized.includes('individual') ? 'Individual' : 'Company';
  log('assert', 'Asserting radio selected', { label, type });
  minorCreditor().assertCreditorTypeSelected(type as 'Individual' | 'Company');
});

/**
 * @step Open the minor creditor form for an imposition.
 * @description Open the minor creditor form for an imposition.

 * @param row - 1-based imposition number.
 */
When('I open minor creditor details for imposition {int}', (row: number) => {
  const index = row - 1;
  setCurrentImpositionIndex(index);
  offenceDetails().openMinorCreditorDetails(index);
});

/**
 * @step Open company minor creditor, populate company name, cancel, and assert values persist.
 * @description Open company minor creditor, populate company name, cancel, and assert values persist.

 * @param imposition - 1-based imposition number.
 * @param company - Company name to populate before cancelling.
 */
When(
  'I open and cancel company minor creditor for imposition {int} with company {string}',
  (imposition: number, company: string) => {
    setCurrentImpositionIndex(imposition - 1);
    log('flow', 'Opening company minor creditor and cancelling with data preserved', { imposition, company });
    flow().openAndCancelCompanyMinorCreditor(imposition, company);
  },
);

/**
 * @step Expand minor creditor summary for an imposition.
 * @description Expand minor creditor summary for an imposition.

 * @param row - 1-based imposition number.
 */
When('I view minor creditor details for imposition {int}', (row: number) => {
  const index = row - 1;
  setCurrentImpositionIndex(index);
  offenceDetails().toggleMinorCreditorDetails(index, 'Show details');
});

/**
 * @step Assert minor creditor summary details for an imposition.
 * @description Assert minor creditor summary details for an imposition.

 * @param imposition - 1-based imposition number.
 * @param table - DataTable of expected summary values.
 */
Then('I see the minor creditor summary for imposition {int}:', (imposition: number, table: DataTable) => {
  const expectations = normalizeHash(table);
  log('assert', 'Asserting minor creditor summary', { imposition, expectations });
  flow().assertMinorCreditorSummary(imposition, expectations);
});

/**
 * @step Alias for asserting minor creditor summary using a different wording.
 * @description Alias for asserting minor creditor summary using a different wording.

 * @param imposition - 1-based imposition number.
 * @param table - DataTable of expected summary values.
 */
Then('the minor creditor summary for imposition {int} is:', (imposition: number, table: DataTable) => {
  const expectations = normalizeHash(table);
  log('assert', 'Asserting minor creditor summary (alias)', { imposition, expectations });
  flow().assertMinorCreditorSummary(imposition, expectations);
});

/**
 * @step Asserts current minor creditor field values using a table.
 * @description Maps table labels to minor creditor field keys and asserts their values.
 * @param table - DataTable of label/value pairs.
 */
Then('I see the following values in the Minor Creditor fields:', (table: DataTable) => {
  const expectations = normalizeHash(table);
  log('assert', 'Asserting minor creditor field values', { expectations });
  flow().assertMinorCreditorFormValues(expectations);
});

/**
 * @step Asserts BACS payment field values for the minor creditor form.
 * @description Uses the same label mapping as minor creditor fields.
 * @param table - DataTable of payment field labels and expected values.
 */
Then('I see the following values in the Payment details fields:', (table: DataTable) => {
  const expectations = normalizeHash(table);
  log('assert', 'Asserting minor creditor payment detail values', { expectations });
  flow().assertMinorCreditorPaymentValues(expectations);
});

/**
 * @step Cancel minor creditor removal for an imposition.
 * @description Cancel minor creditor removal for an imposition.

 * @param imposition - 1-based imposition number to cancel removal for.
 */
When('I cancel removing the minor creditor for imposition {int}', (imposition: number) => {
  ensureOnOffenceDetailsFromReview().then(() => {
    flow().cancelRemoveMinorCreditor(imposition);
  });
});

/**
 * @step Confirm minor creditor removal for an imposition.
 * @description Confirm minor creditor removal for an imposition.

 * @param imposition - 1-based imposition number to confirm removal for.
 */
When('I confirm removing the minor creditor for imposition {int}', (imposition: number) => {
  ensureOnOffenceDetailsFromReview().then(() => {
    flow().confirmRemoveMinorCreditor(imposition);
  });
});

/**
 * @step Cancels the minor creditor form and chooses a prompt response.
 * @description Cancels the minor creditor form and chooses a prompt response.

 * @param choice - Confirmation choice: "Cancel", "Ok", "Stay", or "Leave".
 */
When('I cancel minor creditor details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  flow().cancelMinorCreditorDetails(choice);
});

/**
 * @step Cancel minor creditor removal confirmation.
 * @description Cancel minor creditor removal confirmation.

 */
When('I cancel the remove minor creditor confirmation', () => {
  flow().cancelRemoveMinorCreditorConfirmation();
});

/**
 * @step Asserts minor creditor summary is absent for an imposition.
 * @description Asserts minor creditor summary is absent for an imposition.

 * @param imposition - 1-based imposition number.
 */
Then('I do not see minor creditor details for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  log('assert', 'Asserting minor creditor details are absent', { imposition });
  offenceDetails().assertMinorCreditorAbsent(index);
});

/**
 * @step Save minor creditor details (alias).
 * @description Save minor creditor details (alias).

 */
When('I save the minor creditor details', () => {
  minorCreditor().save();
});

/**
 * @step Run a11y checks on minor creditor form (individual/company) and save.
 * @description Run a11y checks on minor creditor form (individual/company) and save.

 * @param imposition - 1-based imposition number.
 * @param company - Company name to use in the company path.
 */
When(
  'I perform minor creditor accessibility checks for imposition {int} with company {string}',
  (imposition: number, company: string) => {
    setCurrentImpositionIndex(imposition - 1);
    flow().runMinorCreditorAccessibility(imposition, company);
  },
);

/**
 * @step Run a11y check on remove minor creditor confirmation and cancel.
 * @description Run a11y check on remove minor creditor confirmation and cancel.

 * @param imposition - 1-based imposition number to exercise in the a11y path.
 */
When('I perform remove minor creditor accessibility check for imposition {int}', (imposition: number) => {
  flow().runRemoveMinorCreditorAccessibility(imposition);
});
