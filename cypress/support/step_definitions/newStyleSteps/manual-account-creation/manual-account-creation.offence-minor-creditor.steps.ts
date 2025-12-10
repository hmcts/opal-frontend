/**
 * Minor creditor step definitions for Manual Account Creation offence journeys.
 */
import { When, Then, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { calculateWeeksInPast } from '../../../utils/dateUtils';
import { normalizeHash } from '../../../utils/cucumberHelpers';
import { log } from '../../../utils/log.helper';
import { MinorCreditorFieldKey } from '../../../utils/macFieldResolvers';
import { ManualOffenceDetailsLocators as L } from '../../../../shared/selectors/manual-account-creation/offence-details.locators';
import {
  common,
  flow,
  getCurrentOffenceCode,
  getCurrentImpositionIndex,
  minorCreditor,
  offenceDetails,
  offenceReview,
  setCurrentOffenceCode,
  setCurrentImpositionIndex,
} from './manual-account-creation.offence.stepshelper';

const ensureOnMinorCreditorPage = (index: number): Cypress.Chainable => {
  return cy
    .get('body')
    .then(($body) => {
      const isMinorCreditor = $body.find(L.minorCreditorForm.saveButton).length > 0;
      if (!isMinorCreditor) {
        offenceDetails().openMinorCreditorDetails(index);
      }
    })
    .then(() => {
      minorCreditor().assertOnMinorCreditorPage();
    });
};

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
  const index = imposition - 1;
  setCurrentImpositionIndex(index);

  ensureOnMinorCreditorPage(index);

  minorCreditor().selectCreditorType('Individual');

  if (data['Title']) {
    minorCreditor().selectTitle(data['Title']);
  }

  const fieldMap: Array<{ label: string; key: MinorCreditorFieldKey }> = [
    { label: 'First name', key: 'firstNames' },
    { label: 'Last name', key: 'lastName' },
    { label: 'Address line 1', key: 'address1' },
    { label: 'Address line 2', key: 'address2' },
    { label: 'Address line 3', key: 'address3' },
    { label: 'Postcode', key: 'postcode' },
  ];

  fieldMap.forEach(({ label, key }) => {
    const value = data[label];
    if (value) {
      minorCreditor().setField(key, value);
    }
  });
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
  const index = imposition - 1;
  setCurrentImpositionIndex(index);

  ensureOnMinorCreditorPage(index);

  minorCreditor().selectCreditorType('Company');

  const fieldMap: Array<{ label: string; key: MinorCreditorFieldKey }> = [
    { label: 'Company', key: 'company' },
    { label: 'Address line 1', key: 'address1' },
    { label: 'Address line 2', key: 'address2' },
    { label: 'Address line 3', key: 'address3' },
    { label: 'Postcode', key: 'postcode' },
  ];

  fieldMap.forEach(({ label, key }) => {
    const value = data[label];
    if (value) {
      minorCreditor().setField(key, value);
    }
  });
});

/**
 * @step Populate BACS payment fields on the minor creditor form.
 * @description Populate BACS payment fields on the minor creditor form.

 * @param _imposition - 1-based imposition number (unused; retained for Gherkin clarity).
 * @param table - DataTable for accountName, sortCode, accountNumber, paymentReference.
 */
When('I maintain BACS payment details for imposition {int}:', (_imposition: number, table: DataTable) => {
  const data = normalizeHash(table);
  minorCreditor().togglePayByBacs(true);

  const fieldMap: Array<{ label: string; key: MinorCreditorFieldKey }> = [
    { label: 'Name on the account', key: 'accountName' },
    { label: 'Sort code', key: 'sortCode' },
    { label: 'Account number', key: 'accountNumber' },
    { label: 'Payment reference', key: 'paymentReference' },
  ];

  fieldMap.forEach(({ label, key }) => {
    const value = data[label];
    if (value) {
      minorCreditor().setField(key, value);
    }
  });
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
    const payload = {
      title: data['Title'],
      firstNames: data['First name'],
      lastName: data['Last name'],
      address1: data['Address line 1'],
      address2: data['Address line 2'],
      address3: data['Address line 3'],
      postcode: data['Postcode'],
      accountName: data['Account name'],
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
    const payload = {
      company: data['Company'],
      address1: data['Address line 1'],
      address2: data['Address line 2'],
      address3: data['Address line 3'],
      postcode: data['Postcode'],
      accountName: data['Account name'],
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
    const index = imposition - 1;
    setCurrentImpositionIndex(index);

    const fillMinorCreditor = () => {
      minorCreditor().assertOnMinorCreditorPage();
      minorCreditor().selectCreditorType('Individual');
      if (data['Title']) {
        minorCreditor().selectTitle(data['Title']);
      }

      const fieldMap: Array<{ label: string; key: MinorCreditorFieldKey }> = [
        { label: 'First name', key: 'firstNames' },
        { label: 'Last name', key: 'lastName' },
        { label: 'Address line 1', key: 'address1' },
        { label: 'Address line 2', key: 'address2' },
        { label: 'Address line 3', key: 'address3' },
        { label: 'Postcode', key: 'postcode' },
      ];

      fieldMap.forEach(({ label, key }) => {
        const value = data[label];
        if (value) {
          minorCreditor().setField(key, value);
        }
      });

      const hasBacs = data['Account name'] || data['Sort code'] || data['Account number'] || data['Payment reference'];
      if (hasBacs) {
        minorCreditor().togglePayByBacs(true);
        if (data['Account name']) minorCreditor().setField('accountName', data['Account name']);
        if (data['Sort code']) minorCreditor().setField('sortCode', data['Sort code']);
        if (data['Account number']) minorCreditor().setField('accountNumber', data['Account number']);
        if (data['Payment reference']) minorCreditor().setField('paymentReference', data['Payment reference']);
      }

      minorCreditor().save();
      offenceDetails().assertOnAddOffencePage();
    };

    ensureOnOffenceDetailsFromReview().then(() => {
      offenceDetails().clickMinorCreditorAction(index, 'Change');
      fillMinorCreditor();
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
  const offence = offenceDetails();
  const creditor = minorCreditor();
  const date = calculateWeeksInPast(9);

  log('flow', 'Creating offence with two minor creditors', { offenceCode, date });
  offence.assertOnAddOffencePage();
  offence.setOffenceField('Offence code', offenceCode);
  offence.setOffenceField('Date of sentence', date);

  // Imposition 1 – Individual minor creditor with BACS
  offence.setImpositionField(0, 'Result code', 'Compensation (FCOMP)');
  offence.setImpositionField(0, 'Amount imposed', '200');
  offence.setImpositionField(0, 'Amount paid', '100');
  offence.selectCreditorType(0, 'minor');
  offence.openMinorCreditorDetails(0);
  creditor.assertOnMinorCreditorPage();
  creditor.selectCreditorType('Individual');
  creditor.selectTitle('Mr');
  creditor.setField('firstNames', 'FNAME');
  creditor.setField('lastName', 'LNAME');
  creditor.setField('address1', 'Addr1');
  creditor.setField('address2', 'Addr2');
  creditor.setField('address3', 'Addr3');
  creditor.setField('postcode', 'TE12 3ST');
  creditor.togglePayByBacs(true);
  creditor.setField('accountName', 'F LNAME');
  creditor.setField('sortCode', '123456');
  creditor.setField('accountNumber', '12345678');
  creditor.setField('paymentReference', 'REF');
  creditor.save();
  offence.assertOnAddOffencePage();

  // Imposition 2 – Company minor creditor with BACS
  offence.clickAddAnotherImposition();
  offence.setImpositionField(1, 'Result code', 'Compensation (FCOMP)');
  offence.setImpositionField(1, 'Amount imposed', '200');
  offence.setImpositionField(1, 'Amount paid', '100');
  offence.selectCreditorType(1, 'minor');
  offence.openMinorCreditorDetails(1);
  creditor.assertOnMinorCreditorPage();
  creditor.selectCreditorType('Company');
  creditor.setField('company', 'CNAME');
  creditor.setField('address1', 'Addr1');
  creditor.setField('address2', 'Addr2');
  creditor.setField('address3', 'Addr3');
  creditor.setField('postcode', 'TE12 3ST');
  creditor.togglePayByBacs(true);
  creditor.setField('accountName', 'F LNAME');
  creditor.setField('sortCode', '123456');
  creditor.setField('accountNumber', '12345678');
  creditor.setField('paymentReference', 'REF');
  creditor.save();
  offence.assertOnAddOffencePage();

  setCurrentOffenceCode(offenceCode);
});

/**
 * @step Select creditor type or minor creditor type based on label.
 * @description Select creditor type or minor creditor type based on label.

 * @param label - Text containing "major/minor creditor" or "Individual/Company".
 * @example When I select the "Minor creditor" radio button
 */
When('I select the minor creditor radio option {string}', (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('minor creditor') || normalized.includes('major creditor')) {
    const type = normalized.includes('minor') ? 'minor' : 'major';
    log('click', 'Selecting creditor type (default imposition)', { label, type, index: getCurrentImpositionIndex() });
    offenceDetails().selectCreditorType(getCurrentImpositionIndex(), type as 'major' | 'minor');
    return;
  }

  if (normalized.includes('individual') || normalized.includes('company')) {
    const type = normalized.includes('individual') ? 'Individual' : 'Company';
    log('click', 'Selecting minor creditor type', { label, type });
    minorCreditor().selectCreditorType(type as 'Individual' | 'Company');
    return;
  }

  throw new Error(`Unknown radio button label: ${label}`);
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
    const index = imposition - 1;
    setCurrentImpositionIndex(index);
    log('flow', 'Opening company minor creditor and cancelling with data preserved', { imposition, company });
    offenceDetails().openMinorCreditorDetails(index);
    minorCreditor().assertOnMinorCreditorPage();
    minorCreditor().selectCreditorType('Company');
    minorCreditor().setField('company', company);
    minorCreditor().cancelAndChoose('Cancel');
    minorCreditor().assertOnMinorCreditorPage();
    minorCreditor().assertCreditorTypeSelected('Company');
    minorCreditor().assertFieldValue('company', company);
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
 * @step Cancel minor creditor removal for an imposition.
 * @description Cancel minor creditor removal for an imposition.

 * @param imposition - 1-based imposition number to cancel removal for.
 */
When('I cancel removing the minor creditor for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  ensureOnOffenceDetailsFromReview().then(() => {
    offenceDetails().clickMinorCreditorAction(index, 'Remove');
    common().assertHeaderContains('Are you sure you want to remove this minor creditor?');
    offenceDetails().cancelRemoveMinorCreditor();
    offenceDetails().assertOnAddOffencePage();
  });
});

/**
 * @step Confirm minor creditor removal for an imposition.
 * @description Confirm minor creditor removal for an imposition.

 * @param imposition - 1-based imposition number to confirm removal for.
 */
When('I confirm removing the minor creditor for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  ensureOnOffenceDetailsFromReview().then(() => {
    offenceDetails().clickMinorCreditorAction(index, 'Remove');
    common().assertHeaderContains('Are you sure you want to remove this minor creditor?');
    offenceDetails().confirmRemoveMinorCreditor();
    offenceDetails().assertMinorCreditorAbsent(index);
  });
});

/**
 * @step Cancels the minor creditor form and chooses a prompt response.
 * @description Cancels the minor creditor form and chooses a prompt response.

 * @param choice - Confirmation choice: "Cancel", "Ok", "Stay", or "Leave".
 */
When('I cancel minor creditor details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling minor creditor details', { choice });
  minorCreditor().assertOnMinorCreditorPage();
  minorCreditor().cancelAndChoose(choice);
});

/**
 * @step Cancel minor creditor removal confirmation.
 * @description Cancel minor creditor removal confirmation.

 */
When('I cancel the remove minor creditor confirmation', () => {
  log('navigate', 'Cancelling minor creditor removal confirmation');
  offenceDetails().cancelRemoveMinorCreditor();
  offenceDetails().assertOnAddOffencePage();
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
