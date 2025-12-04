/**
 * Offence detail and imposition step definitions for Manual Account Creation journeys.
 */
import { When, Then, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import {
  calculateWeeksInFuture,
  calculateWeeksInPast,
  resolveRelativeDate,
} from '../../../utils/dateUtils';
import { log } from '../../../utils/log.helper';
import { normalizeTableRows } from '../../../utils/cucumberHelpers';
import {
  resolveImpositionFieldKey,
  resolveOffenceFieldKey,
} from '../../../utils/macFieldResolvers';
import {
  common,
  details,
  ensureImpositionExists,
  flow,
  getCurrentOffenceCode,
  getCurrentImpositionIndex,
  minorCreditor,
  offenceDetails,
  offenceReview,
  setCurrentOffenceCode,
  setCurrentImpositionIndex,
  upsertImpositionFinancialRows,
} from './manual-account-creation.offence.stepshelper';

/**
 * @step Confirms the user is on the offence details page.
 * @description Confirms the user is on the offence details page.

 */
Then('I see the offence details page with header {string} and text {string}', (header: string, text: string) => {
  log('assert', 'Asserting offence details page header and text', { header, text });
  offenceDetails().assertOnAddOffencePage(header);
  cy.contains(text).should('exist');
});

/**
 * Asserts a specific offence-related text is visible on the page.
 */
Then('I see offence text {string}', (text: string) => {
  log('assert', 'Asserting offence text is visible', { text });
  cy.contains(text).should('exist');
});

/**
 * @step Adds a single offence with imposition amounts.
 * @description Adds a single offence with imposition amounts.

 */
When(
  'I add an offence dated {int} weeks in the past with offence code {string}, result code {string}, amount imposed {string}, and amount paid {string}',
  (weeksInPast: number, offenceCode: string, resultCode: string, amountImposed: string, amountPaid: string) => {
    const dateOfSentence = calculateWeeksInPast(weeksInPast);
    log('step', 'Completing offence details', {
      weeksInPast,
      offenceCode,
      resultCode,
      amountImposed,
      amountPaid,
      dateOfSentence,
    });
    details().assertOnAccountDetailsPage();
    offenceDetails().fillOffenceDetails({
      dateOfSentence,
      offenceCode,
      resultCode,
      amountImposed,
      amountPaid,
    });
  },
);

/**
 * @step Populates offence details from account details using a data table.
 * @description Populates offence details from account details using a data table.

 */
When('I have provided offence details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  const offenceDate = resolveRelativeDate(data['offence date']);
  log('step', 'Providing offence details from table', { ...data, offenceDate });
  flow().provideOffenceDetailsFromAccountDetails({
    dateOfSentence: offenceDate,
    offenceCode: data['offence code'],
    resultCode: data['result code'],
    amountImposed: data['amount imposed'],
    amountPaid: data['amount paid'],
  });
});

/**
 * @step Sends offence details for review.
 * @description Sends offence details for review.

 */
When('I submit the offence details for review', () => {
  log('navigate', 'Submitting offence details for review');
  offenceDetails().clickReviewOffence();
});

/**
 * @step Provide offence code and sentence date using a relative weeks offset.
 * @description Provide offence code and sentence date using a relative weeks offset.

 */
When(
  'I provide offence details for offence code {string} with a sentence date {int} weeks in the past',
  (offenceCode: string, weeks: number) => {
    const dateOfSentence = calculateWeeksInPast(weeks);
    log('step', 'Providing offence code and sentence date', { offenceCode, weeks, dateOfSentence });
    offenceDetails().setOffenceField('Offence code', offenceCode);
    offenceDetails().setOffenceField('Date of sentence', dateOfSentence);
    setCurrentImpositionIndex(0);
  },
);

/**
 * @step Add an offence with impositions and cancel to test unsaved changes.
 * @description Add an offence with impositions and cancel to test unsaved changes.

 */
When(
  'I add and cancel offence {string} dated {int} weeks ago with impositions:',
  (offenceCode: string, weeksAgo: number, table: DataTable) => {
    const normalize = (value?: string) => (value ?? '').toString().trim();
    const impositions = table.hashes().map((row) => ({
      imposition: Number(normalize(row['Imposition'])),
      resultCode: normalize(row['Result code']),
      amountImposed: normalize(row['Amount imposed']),
      amountPaid: normalize(row['Amount paid']),
      creditorType: normalize(row['Creditor type']),
      creditorSearch: normalize(row['Creditor search']),
    }));

    log('flow', 'Adding offence and cancelling (stay on form)', { offenceCode, weeksAgo, impositions });
    flow().addOffenceWithImpositions({ offenceCode, weeksAgo, impositions });
    offenceDetails().cancelOffenceDetails('Cancel');
    offenceDetails().assertOnAddOffencePage();
  },
);

/**
 * @step Add an offence with impositions.
 * @description Add an offence with impositions.

 */
When(
  'I add offence {string} dated {int} weeks ago with impositions:',
  (offenceCode: string, weeksAgo: number, table: DataTable) => {
    const normalize = (value?: string) => (value ?? '').toString().trim();
    const impositions = table.hashes().map((row) => ({
      imposition: Number(normalize(row['Imposition'])),
      resultCode: normalize(row['Result code']),
      amountImposed: normalize(row['Amount imposed']),
      amountPaid: normalize(row['Amount paid']),
      creditorType: normalize(row['Creditor type']),
      creditorSearch: normalize(row['Creditor search']),
    }));

    log('flow', 'Adding offence with impositions', { offenceCode, weeksAgo, impositions });
    flow().addOffenceWithImpositions({ offenceCode, weeksAgo, impositions });
  },
);

/**
 * @step Assert an option/link is not present on the page.
 * @description Assert an option/link is not present on the page.

 */
Then('the {string} option is not available', (optionText: string) => {
  log('assert', 'Asserting option is not available', { optionText });
  cy.contains(optionText, { matchCase: false }).should('not.exist');
});

/**
 * @step Record imposition result/amount fields.
 * @description Record imposition result/amount fields.

 */
When('I record imposition financial details:', (table: DataTable) => {
  const normalize = (value?: string) => (value ?? '').toString().trim();
  const rows = table.hashes().map((row) => ({
    imposition: Number(normalize(row['Imposition'])),
    resultCode: normalize(row['Result code']),
    amountImposed: normalize(row['Amount imposed']),
    amountPaid: normalize(row['Amount paid']),
  }));

  upsertImpositionFinancialRows(rows);
});

/**
 * @step Record impositions with creditor types.
 * @description Record impositions with creditor types.

 */
When('I record impositions with creditor types:', (table: DataTable) => {
  const normalize = (value?: string) => (value ?? '').toString().trim();
  const rows = table.hashes().map((row) => ({
    imposition: Number(normalize(row['Imposition'])),
    resultCode: normalize(row['Result code']),
    amountImposed: normalize(row['Amount imposed']),
    amountPaid: normalize(row['Amount paid']),
    creditorType: normalize(row['Creditor type']),
    creditorSearch: normalize(row['Creditor search']),
  }));

  rows.forEach(({ imposition }) => {
    if (!imposition || Number.isNaN(imposition)) {
      throw new Error(`Invalid imposition value: ${imposition}`);
    }
  });

  log('flow', 'Recording impositions with creditor types', { rows });

  upsertImpositionFinancialRows(
    rows.map(({ imposition, resultCode, amountImposed, amountPaid }) => ({
      imposition,
      resultCode,
      amountImposed,
      amountPaid,
    })),
  );

  rows.forEach(({ imposition, creditorType, creditorSearch }) => {
    const index = imposition - 1;
    setCurrentImpositionIndex(index);
    const type = creditorType.toLowerCase();

    if (!type) {
      return;
    }

    if (type.includes('major')) {
      offenceDetails().selectCreditorType(index, 'major');
      if (creditorSearch) {
        offenceDetails().setMajorCreditor(index, creditorSearch);
      }
      return;
    }

    if (type.includes('minor')) {
      offenceDetails().selectCreditorType(index, 'minor');
    }
  });
});

/**
 * @step Add another imposition to the current offence.
 * @description Add another imposition to the current offence.

 */
When('I add another imposition to the current offence', () => {
  log('click', 'Adding another imposition to the current offence', { currentImpositionIndex: getCurrentImpositionIndex() });
  offenceDetails().clickAddAnotherImposition();
});

/**
 * @step Seed multiple offences for the account.
 * @description Seed multiple offences for the account.

 */
Given('the following offences exist for the account:', (table: DataTable) => {
  const normalize = (value?: string) => (value ?? '').toString().trim();
  const offences = table.hashes().map((row) => ({
    offenceCode: normalize(row['Offence code']),
    weeksAgo: Number(normalize(row['Sentence weeks ago'])) || 0,
    resultCode: normalize(row['Result code']),
    amountImposed: normalize(row['Amount imposed']),
    amountPaid: normalize(row['Amount paid']),
    creditorType: normalize(row['Creditor type'] || 'Default').toLowerCase(),
    creditorSearch: normalize(row['Creditor search']),
    creditorName: normalize(row['Creditor name']),
    minorType: normalize(row['Minor creditor type']),
  }));

  offences.forEach((offence, index) => {
    if (index === 0) {
      offenceDetails().assertOnAddOffencePage();
    } else {
      offenceReview().assertOnReviewPage();
      offenceReview().clickAddAnotherOffence();
      offenceDetails().assertOnAddOffencePage();
    }

    const dateOfSentence = calculateWeeksInPast(offence.weeksAgo);
    log('flow', 'Creating offence from table', { offenceCode: offence.offenceCode, dateOfSentence });
    offenceDetails().setOffenceField('Offence code', offence.offenceCode);
    offenceDetails().setOffenceField('Date of sentence', dateOfSentence);

    upsertImpositionFinancialRows([
      {
        imposition: 1,
        resultCode: offence.resultCode,
        amountImposed: offence.amountImposed,
        amountPaid: offence.amountPaid,
      },
    ]);

    const creditorType = offence.creditorType;
    if (creditorType.includes('major')) {
      offenceDetails().selectCreditorType(0, 'major');
      if (offence.creditorSearch) {
        offenceDetails().setMajorCreditor(0, offence.creditorSearch);
      }
    } else if (creditorType.includes('minor')) {
      offenceDetails().selectCreditorType(0, 'minor');
      offenceDetails().openMinorCreditorDetails(0);
      minorCreditor().assertOnMinorCreditorPage();

      const minorType = offence.minorType?.toLowerCase().includes('individual') ? 'Individual' : 'Company';
      minorCreditor().selectCreditorType(minorType as 'Individual' | 'Company');

      if (minorType === 'Company') {
        minorCreditor().setField('company', offence.creditorName || 'Minor Creditor');
      } else {
        minorCreditor().selectTitle('Mr');
        minorCreditor().setField('firstNames', offence.creditorName || 'Minor');
        minorCreditor().setField('lastName', 'Creditor');
      }

      minorCreditor().setField('address1', 'Addr1');
      minorCreditor().setField('postcode', 'TE12 3ST');

      minorCreditor().save();
      offenceDetails().assertOnAddOffencePage();
    }

    offenceDetails().clickReviewOffence();
    offenceReview().assertOnReviewPage();
  });

  setCurrentOffenceCode(offences[offences.length - 1]?.offenceCode ?? null);
});

/**
 * @step Seed an offence with specific impositions.
 * @description Seed an offence with specific impositions.

 */
Given('an offence exists with the following impositions:', (table: DataTable) => {
  const normalize = (value?: string) => (value ?? '').toString().trim();
  type Row = {
    offenceCode: string;
    sentenceWeeksAgo: number;
    imposition: number;
    resultCode: string;
    amountImposed: string;
    amountPaid: string;
    creditorType: string;
    creditorSearch?: string;
    minorType?: string;
    minorName?: string;
    minorFirstName?: string;
    minorLastName?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    postcode?: string;
    accountName?: string;
    sortCode?: string;
    accountNumber?: string;
    paymentReference?: string;
  };

  const rows: Row[] = table.hashes().map((row) => ({
    offenceCode: normalize(row['Offence code']),
    sentenceWeeksAgo: Number(normalize(row['Sentence weeks ago'])) || 0,
    imposition: Number(normalize(row['Imposition'])),
    resultCode: normalize(row['Result code']),
    amountImposed: normalize(row['Amount imposed']),
    amountPaid: normalize(row['Amount paid']),
    creditorType: normalize(row['Creditor type'] || 'Default'),
    creditorSearch: normalize(row['Creditor search']),
    minorType: normalize(row['Minor creditor type']),
    minorName: normalize(row['Minor creditor name']),
    minorFirstName: normalize(row['Minor creditor first name']),
    minorLastName: normalize(row['Minor creditor last name']),
    address1: normalize(row['Address line 1']),
    address2: normalize(row['Address line 2']),
    address3: normalize(row['Address line 3']),
    postcode: normalize(row['Postcode']),
    accountName: normalize(row['Account name']),
    sortCode: normalize(row['Sort code']),
    accountNumber: normalize(row['Account number']),
    paymentReference: normalize(row['Payment reference']),
  }));

  const offences = rows.reduce<Record<string, Row[]>>((acc, row) => {
    if (!acc[row.offenceCode]) acc[row.offenceCode] = [];
    acc[row.offenceCode].push(row);
    return acc;
  }, {});

  const offenceEntries = Object.entries(offences);

  offenceEntries.forEach(([offenceCode, impositions], index) => {
    if (index > 0) {
      offenceReview().assertOnReviewPage();
      offenceReview().clickAddAnotherOffence();
      offenceDetails().assertOnAddOffencePage();
    } else {
      offenceDetails().assertOnAddOffencePage();
    }

    const dateOfSentence = calculateWeeksInPast(impositions[0].sentenceWeeksAgo);
    log('flow', 'Creating offence with impositions table', { offenceCode, dateOfSentence, count: impositions.length });
    offenceDetails().setOffenceField('Offence code', offenceCode);
    offenceDetails().setOffenceField('Date of sentence', dateOfSentence);

    impositions
      .sort((a, b) => a.imposition - b.imposition)
      .forEach((row) => {
        const idx = row.imposition - 1;
        ensureImpositionExists(idx).then(() => {
          offenceDetails().setImpositionField(idx, 'Result code', row.resultCode);
          offenceDetails().setImpositionField(idx, 'Amount imposed', row.amountImposed);
          offenceDetails().setImpositionField(idx, 'Amount paid', row.amountPaid);

          const creditorType = row.creditorType.toLowerCase();
          if (creditorType.includes('minor')) {
            offenceDetails().selectCreditorType(idx, 'minor');
            offenceDetails().openMinorCreditorDetails(idx);
            minorCreditor().assertOnMinorCreditorPage();

            const minorType = (row.minorType || '').toLowerCase().includes('individual') ? 'Individual' : 'Company';
            minorCreditor().selectCreditorType(minorType as 'Individual' | 'Company');

            if (minorType === 'Company') {
              const company = row.minorName || `Minor Creditor ${row.imposition}`;
              minorCreditor().setField('company', company);
            } else {
              const title = row.minorFirstName ? 'Mr' : 'Mr';
              minorCreditor().selectTitle(title);
              const first = row.minorFirstName || row.minorName || 'Minor';
              const last = row.minorLastName || 'Creditor';
              minorCreditor().setField('firstNames', first);
              minorCreditor().setField('lastName', last);
            }

            minorCreditor().setField('address1', row.address1 || 'Addr1');
            if (row.address2) minorCreditor().setField('address2', row.address2);
            if (row.address3) minorCreditor().setField('address3', row.address3);
            minorCreditor().setField('postcode', row.postcode || 'TE12 3ST');

            const hasBacs = row.accountName || row.sortCode || row.accountNumber || row.paymentReference;
            if (hasBacs) {
              minorCreditor().togglePayByBacs(true);
              if (row.accountName) minorCreditor().setField('accountName', row.accountName);
              if (row.sortCode) minorCreditor().setField('sortCode', row.sortCode);
              if (row.accountNumber) minorCreditor().setField('accountNumber', row.accountNumber);
              if (row.paymentReference) minorCreditor().setField('paymentReference', row.paymentReference);
            }

            minorCreditor().save();
            offenceDetails().assertOnAddOffencePage();
          } else if (creditorType.includes('major')) {
            offenceDetails().selectCreditorType(idx, 'major');
            if (row.creditorSearch) {
              offenceDetails().setMajorCreditor(idx, row.creditorSearch);
            }
          }
        });
      });

    if (index < offenceEntries.length - 1) {
      offenceDetails().clickReviewOffence();
      offenceReview().assertOnReviewPage();
    }

    setCurrentOffenceCode(offenceCode);
  });
});

/**
 * @step Update sentence date for the current offence.
 * @description Update sentence date for the current offence.

 */
When('I update the sentence date to {int} weeks in the past for the current offence', (weeks: number) => {
  const dateOfSentence = calculateWeeksInPast(weeks);
  log('type', 'Updating sentence date for current offence', { weeks, dateOfSentence });
  offenceDetails().setOffenceField('Date of sentence', dateOfSentence);
});

/**
 * @step Update imposition result/amount values for the current offence.
 * @description Update imposition result/amount values for the current offence.

 */
When('I update imposition financial details for the current offence:', (table: DataTable) => {
  const normalize = (value?: string) => (value ?? '').toString().trim();
  const rows = table.hashes().map((row) => ({
    imposition: Number(normalize(row['Imposition'])),
    resultCode: normalize(row['Result code']),
    amountImposed: normalize(row['Amount imposed']),
    amountPaid: normalize(row['Amount paid']),
  }));

  log('type', 'Updating imposition financial details for current offence', { rows });
  upsertImpositionFinancialRows(rows);
});

/**
 * @step Assert offence/imposition field values from a table.
 * @description Assert offence/imposition field values from a table.

 */
Then('I see the following offence detail fields:', (table: DataTable) => {
  const normalize = (value?: string) => (value ?? '').toString().trim();
  const rows = table.hashes();

  rows.forEach((row) => {
    const field = normalize(row['Field']);
    const value = normalize(row['Value']);
    const impositionRaw = normalize(row['Imposition']);

    if (impositionRaw) {
      const index = Number(impositionRaw) - 1;
      const fieldKey = resolveImpositionFieldKey(field);
      log('assert', 'Asserting imposition field value (table)', { field, value, index });
      offenceDetails().assertImpositionFieldValue(index, fieldKey, value);
      return;
    }

    const offenceField = resolveOffenceFieldKey(field);
    log('assert', 'Asserting offence field value (table)', { field, value });
    offenceDetails().assertOffenceFieldValue(offenceField, value);
  });
});

/**
 * @step Set creditor types/search per imposition.
 * @description Set creditor types/search per imposition.

 */
When('I set imposition creditor types:', (table: DataTable) => {
  const rows = table.hashes();
  rows.forEach((row) => {
    const index = Number(row['Imposition']) - 1;
    setCurrentImpositionIndex(index);
    const type = (row['Creditor type'] || '').toLowerCase();
    const search = row['Creditor search'];

    if (type.includes('major')) {
      offenceDetails().selectCreditorType(index, 'major');
      if (search) {
        offenceDetails().setMajorCreditor(index, search);
      }
    } else if (type.includes('minor')) {
      offenceDetails().selectCreditorType(index, 'minor');
    }
  });
});

/**
 * @step Enter a past date into a date field.
 * @description Enter a past date into a date field.

 */
When('I enter a date {int} weeks into the past into the {string} date field', (weeks: number, fieldLabel: string) => {
  const date = calculateWeeksInPast(weeks);
  const field = resolveOffenceFieldKey(fieldLabel);
  log('type', 'Entering past date', { weeks, date, fieldLabel });
  offenceDetails().setOffenceField(field, date);
});

/**
 * @step Enter a future date into a date field.
 * @description Enter a future date into a date field.

 */
When('I enter a date {int} weeks into the future into the {string} date field', (weeks: number, fieldLabel: string) => {
  const date = calculateWeeksInFuture(weeks);
  const field = resolveOffenceFieldKey(fieldLabel);
  log('type', 'Entering future date', { weeks, date, fieldLabel });
  offenceDetails().setOffenceField(field, date);
});

/**
 * @step Enter a value into an imposition field.
 * @description Enter a value into an imposition field.

 */
When(
  'I enter {string} into the {string} field for imposition {int} in the MAC flow',
  (value: string, field: string, row: number) => {
    const fieldKey = resolveImpositionFieldKey(field);
    const index = row - 1;
    setCurrentImpositionIndex(index);
    log('type', 'Entering imposition value', { value, field, index });
    offenceDetails().setImpositionField(index, fieldKey, value);
  },
);

/**
 * @step Clear an imposition field value.
 * @description Clear an imposition field value.

 */
When('I remove the {string} for imposition {int}', (field: string, row: number) => {
  const fieldKey = resolveImpositionFieldKey(field);
  const index = row - 1;
  setCurrentImpositionIndex(index);
  log('clear', 'Clearing imposition field', { field, index, alias: true });
  offenceDetails().clearImpositionField(index, fieldKey);
});

/**
 * @step Perform an action on an imposition.
 * @description Perform an action on an imposition.

 * @param action - Supported actions: "change", "remove", "remove imposition", "show", or "hide".
 * @param imposition - 1-based imposition number to target.
 * @example
 *   When I choose to "change" imposition 1
 *   When I choose to "remove imposition" imposition 2
 *   When I choose to "show" imposition 3
 */
When('I choose to {string} imposition {int}', (action: string, imposition: number) => {
  const index = imposition - 1;
  const normalized = action.toLowerCase();
  log('navigate', 'Choosing imposition action', { action, imposition });

  cy.location('pathname').then((pathname) => {
    if (pathname.includes('/offence-details/review')) {
      if (!getCurrentOffenceCode()) {
        throw new Error('Current offence code is unknown; cannot navigate to change imposition.');
      }
      offenceReview().clickChangeOffence(getCurrentOffenceCode() as string);
      offenceDetails().assertOnAddOffencePage();
    }

    if (normalized.includes('change')) {
      offenceDetails().clickMinorCreditorAction(index, 'Change');
      return;
    }

    if (normalized.includes('remove imposition')) {
      offenceDetails().clickRemoveImposition(index);
      return;
    }

    if (normalized.includes('remove')) {
      offenceDetails().clickMinorCreditorAction(index, 'Remove');
      return;
    }

    if (normalized.includes('show')) {
      offenceDetails().toggleMinorCreditorDetails(index, 'Show details');
      return;
    }

    if (normalized.includes('hide')) {
      offenceDetails().toggleMinorCreditorDetails(index, 'Hide details');
      return;
    }

    throw new Error(`Unknown imposition action: ${action}`);
  });
});

/**
 * @step Assert an imposition field value for a given row.
 * @description Assert an imposition field value for a given row.

 */
Then(
  'I see {string} in the {string} field for imposition {int} in the MAC flow',
  (expected: string, field: string, row: number) => {
    const fieldKey = resolveImpositionFieldKey(field);
    const index = row - 1;
    setCurrentImpositionIndex(index);
    log('assert', 'Asserting imposition field value', { expected, field, index });
    offenceDetails().assertImpositionFieldValue(index, fieldKey, expected);
  },
);

/**
 * @step Enter text into the major creditor search for a specific imposition.
 * @description Enter text into the major creditor search for a specific imposition.

 */
When(
  'I enter {string} into the "Search using name or code" search box for imposition {int}',
  (value: string, row: number) => {
    const index = row - 1;
    setCurrentImpositionIndex(index);
    log('type', 'Entering major creditor search value', { value, index });
    offenceDetails().setMajorCreditor(index, value);
  },
);

/**
 * @step Enter text into the current major creditor search box.
 * @description Enter text into the current major creditor search box.

 */
When('I enter {string} into the "Search using name or code" search box', (value: string) => {
  log('type', 'Entering major creditor search value', { value, index: getCurrentImpositionIndex() });
  offenceDetails().setMajorCreditor(getCurrentImpositionIndex(), value);
});

/**
 * @step Assert the major creditor value for an imposition.
 * @description Assert the major creditor value for an imposition.

 */
Then(
  'I see {string} in the "Search using name or code" field for imposition {int}',
  (expected: string, row: number) => {
    const index = row - 1;
    setCurrentImpositionIndex(index);
    log('assert', 'Asserting major creditor value', { expected, index });
    offenceDetails().assertMajorCreditorValue(index, expected);
  },
);

/**
 * @step Select creditor type radio for an imposition.
 * @description Select creditor type radio for an imposition.

 */
When('I select the {string} radio button for imposition {int}', (label: string, row: number) => {
  const index = row - 1;
  setCurrentImpositionIndex(index);
  const normalized = label.toLowerCase();
  const type = normalized.includes('minor') ? 'minor' : 'major';
  log('click', 'Selecting creditor type for imposition', { label, type, index });
  offenceDetails().selectCreditorType(index, type as 'major' | 'minor');
});

/**
 * @step Add another imposition panel.
 * @description Add another imposition panel.

 */
When('I add another imposition', () => {
  offenceDetails().clickAddAnotherImposition();
});

/**
 * @step Assert the remove imposition confirmation header.
 * @description Assert the remove imposition confirmation header.

 */
Then('I am asked to confirm removing imposition {int}', (_imposition: number) => {
  log('assert', 'Asserting remove imposition confirmation header');
  common().assertHeaderContains('Are you sure you want to remove this imposition?');
});

/**
 * @step Assert remove imposition links exist for provided impositions.
 * @description Assert remove imposition links exist for provided impositions.

 */
Then('I see remove imposition links for:', (table: DataTable) => {
  const rows = normalizeTableRows(table);
  const impositions = rows
    .filter((row, index) => !(row[0].toLowerCase() === 'imposition' && index === 0))
    .map((row) => Number(row[0]))
    .filter((value) => !Number.isNaN(value));

  if (!impositions.length) {
    throw new Error('No imposition values provided for remove link assertion');
  }

  flow().assertRemoveImpositionLinks(impositions, true);
});

/**
 * @step Cancels offence details and responds to the unsaved changes dialog.
 * @description Cancels offence details and responds to the unsaved changes dialog.

 * @param choice - Confirmation choice: "Cancel" (close dialog), "Ok"/"Leave" (exit without saving), or "Stay" (remain).
 * @example When I cancel offence details choosing "Cancel"
 * @example When I cancel offence details choosing "Stay"
 */
When('I cancel offence details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling offence details', { choice });
  offenceDetails().assertOnAddOffencePage();
  offenceDetails().cancelOffenceDetails(choice);
});

/**
 * @step Cancels imposition removal from the confirmation screen.
 * @description Cancels imposition removal from the confirmation screen.

 */
When('I cancel removing imposition {int}', (imposition: number) => {
  log('navigate', 'Cancelling imposition removal', { imposition });
  offenceDetails().cancelRemoveImposition();
});

/**
 * @step Confirms imposition removal from the confirmation screen.
 * @description Confirms imposition removal from the confirmation screen.

 * @param imposition - 1-based imposition number being confirmed for removal.
 * @example When I confirm removing imposition 1
 */
When('I confirm removing imposition {int}', (imposition: number) => {
  log('navigate', 'Confirming imposition removal', { imposition });
  offenceDetails().confirmRemoveImposition();
});

/**
 * @step Remove an imposition by index (confirmation path).
 * @description Remove an imposition by index (confirmation path).

 * @param imposition - 1-based imposition number to remove.
 * @example When I remove imposition 2
 */
When('I remove imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  log('navigate', 'Removing imposition', { imposition });
  offenceDetails().clickRemoveImposition(index);
  common().assertHeaderContains('Are you sure you want to remove this imposition?');
  offenceDetails().confirmRemoveImposition();
  offenceDetails().assertOnAddOffencePage();
});

/**
 * @step Remove multiple impositions from the offence form.
 * @description Remove multiple impositions from the offence form.

 * @param table - DataTable containing imposition numbers (first row can be a header).
 * @example
 *   When I remove these impositions:
 *     | Imposition |
 *     | 1          |
 *     | 3          |
 */
When('I remove these impositions:', (table: DataTable) => {
  const rows = normalizeTableRows(table);
  const values = Array.isArray(rows[0]) ? rows.slice(1).map((row) => row[0]) : rows;
  values.forEach((impositionValue) => {
    const imposition = Number(impositionValue);
    if (Number.isNaN(imposition)) {
      throw new Error(`Invalid imposition value: ${impositionValue}`);
    }
    const index = imposition - 1;
    log('navigate', 'Removing imposition', { imposition });
    offenceDetails().clickRemoveImposition(index);
    common().assertHeaderContains('Are you sure you want to remove this imposition?');
    offenceDetails().confirmRemoveImposition();
    offenceDetails().assertOnAddOffencePage();
  });
});

/**
 * @step Assert remove-imposition confirmation table contents.
 * @description Assert remove-imposition confirmation table contents.

 * @param _row - Row number (unused; kept for Gherkin readability).
 * @param table - DataTable containing the expected header/value pairs.
 */
Then('row number {int} has the following data:', (_row: number, table: DataTable) => {
  const [headers, values] = normalizeTableRows(table);
  const expectations = headers.reduce<Record<string, string>>((acc, header, idx) => {
    acc[header] = values[idx];
    return acc;
  }, {});

  log('assert', 'Asserting remove imposition table data', { expectations });
  offenceDetails().assertRemoveImpositionTable(expectations);
});

/**
 * @step Perform a11y checks on the remove imposition confirmation flow.
 * @description Perform a11y checks on the remove imposition confirmation flow.

 * @param imposition - 1-based imposition number to exercise in the a11y path.
 * @example When I perform remove imposition accessibility check for imposition 1
 */
When('I perform remove imposition accessibility check for imposition {int}', (imposition: number) => {
  flow().runRemoveImpositionAccessibility(imposition);
});
