/**
 * @file manual-account-creation.offence.steps.ts
 * @description Offence-specific step definitions for Manual Account Creation journeys.
 */
import { When, Then, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { ManualAccountCreationFlow } from '../../../e2e/functional/opal/flows/manual-account-creation.flow';
import { ManualOffenceDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/offence-details.actions';
import { ManualOffenceMinorCreditorActions } from '../../../e2e/functional/opal/actions/manual-account-creation/offence-minor-creditor.actions';
import { ManualOffenceReviewActions } from '../../../e2e/functional/opal/actions/manual-account-creation/offence-review.actions';
import { ManualOffenceSearchActions } from '../../../e2e/functional/opal/actions/manual-account-creation/offence-search.actions';
import { ManualAccountDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/account-details.actions';
import { CommonActions } from '../../../e2e/functional/opal/actions/common/common.actions';
import { ManualOffenceDetailsLocators as L } from '../../../shared/selectors/manual-account-creation/offence-details.locators';
import { calculateWeeksInFuture, calculateWeeksInPast, formatDateString } from '../../utils/dateUtils';
import { log } from '../../utils/log.helper';
import {
  ImpositionFieldKey,
  MinorCreditorFieldKey,
  OffenceFieldKey,
  SearchFieldKey,
  SearchResultColumn,
  resolveImpositionFieldKey,
  resolveMinorCreditorFieldKey,
  resolveOffenceFieldKey,
  resolveSearchFieldKey,
} from '../../utils/fieldResolvers';
import { accessibilityActions } from '../../../e2e/functional/opal/actions/accessibility/accessibility.actions';
import {
  normalizeHash,
  normalizeTableRows,
  parseWeeksValue,
  resolveRelativeDate,
} from './manual-account-creation.shared';

const flow = () => new ManualAccountCreationFlow();
const offenceDetails = () => new ManualOffenceDetailsActions();
const minorCreditor = () => new ManualOffenceMinorCreditorActions();
const offenceReview = () => new ManualOffenceReviewActions();
const offenceSearch = () => new ManualOffenceSearchActions();
const details = () => new ManualAccountDetailsActions();
const common = () => new CommonActions();
let currentImpositionIndex = 0;
let currentOffenceCode: string | null = null;

/**
 * @description Ensures the requested imposition panel exists, adding one if necessary.
 * @param index - Zero-based imposition index to work with.
 * @param attempts - Recursive guard to avoid infinite retries.
 * @returns Cypress chain resolving when the panel exists.
 */
const ensureImpositionExists = (index: number, attempts: number = 0): Cypress.Chainable => {
  if (attempts > 10) {
    throw new Error(`Unable to create imposition index ${index} after ${attempts} attempts`);
  }

  const selector = `input[id = "fm_offence_details_result_id_${index}-autocomplete"]`;

  return cy.get('body').then(($body) => {
    if ($body.find(selector).length) {
      return;
    }

    return offenceDetails()
      .getImpositionCount()
      .then((count) => {
        // If we do not yet have this panel (or it failed to render), add one and retry.
        if (count <= index + 1) {
          offenceDetails().clickAddAnotherImposition();
        }
        return ensureImpositionExists(index, attempts + 1);
      });
  });
};

/**
 * @description Shape for imposition financial input rows.
 */
type ImpositionFinancialRow = {
  imposition: number;
  resultCode?: string;
  amountImposed?: string;
  amountPaid?: string;
};

/**
 * @description Upserts imposition financial values, ensuring panels exist and tracking the current index.
 * @param rows - Collection of imposition rows to set.
 */
const upsertImpositionFinancialRows = (rows: ImpositionFinancialRow[]): void => {
  const sorted = [...rows].sort((a, b) => a.imposition - b.imposition);
  sorted.forEach(({ imposition }) => {
    if (!imposition || Number.isNaN(imposition) || imposition < 1) {
      throw new Error(`Invalid imposition value: ${imposition}`);
    }
  });
  log('type', 'Upserting imposition financial rows', { rows: sorted });

  cy.wrap(sorted).each((row: ImpositionFinancialRow) => {
    const { imposition, resultCode, amountImposed, amountPaid } = row;
    const index = imposition - 1;
    return ensureImpositionExists(index).then(() => {
      currentImpositionIndex = index;
      if (resultCode) {
        offenceDetails().setImpositionField(index, 'Result code', resultCode);
      }
      if (amountImposed) {
        offenceDetails().setImpositionField(index, 'Amount imposed', amountImposed);
      }
      if (amountPaid) {
        offenceDetails().setImpositionField(index, 'Amount paid', amountPaid);
      }
    });
  });
};

/**
 * @step Confirms the user is on the offence details page.
 */

Then('I see the offence details page with header {string} and text {string}', (header: string, text: string) => {
  log('assert', 'Asserting offence details page header and text', { header, text });
  offenceDetails().assertOnAddOffencePage(header);
  cy.contains(text).should('exist');
});

/**
 * @step Adds a single offence with imposition amounts.
 * @description Fills offence details with a relative date, offence/result codes, and amounts.
 * @param weeksInPast - Weeks before today for the offence date.
 * @param offenceCode - Offence code to enter.
 * @param resultCode - Result code to enter.
 * @param amountImposed - Amount imposed value.
 * @param amountPaid - Amount paid value.
 * @remarks Converts relative weeks to a concrete date via utilities.
 * @example
 *   When I add an offence dated 2 weeks in the past with offence code "ABC" result code "1234" amount imposed "100" and amount paid "50"
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
 * @description Navigates via Account details to Offence details and fills fields from a table.
 * @param table - DataTable containing offence date, offence code, result code, amounts.
 * @remarks Relative dates are normalised via resolveRelativeDate; unknown labels will throw.
 * @example
 *   When I have provided offence details from account details:
 *     | offence date  | 2 weeks in the past |
 *     | offence code  | ABC123              |
 *     | result code   | 4001                |
 *     | amount imposed| 100                 |
 *     | amount paid   | 50                  |
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
 * @description Clicks the review/submit button on Offence details.
 * @remarks Assumes caller has navigated to Offence details.
 * @example When I submit the offence details for review
 */
When('I submit the offence details for review', () => {
  log('navigate', 'Submitting offence details for review');
  offenceDetails().clickReviewOffence();
});

/**
 * @step Sets payment terms including collection order and pay-by date.
 * @description Fills collection order, sets past and future dates relative to today, and submits.
 * @param collectionOrder - Whether collection order is "Yes" or "No".
 * @param weeksInPast - Weeks ago for collection order date.
 * @param weeksInFuture - Weeks ahead for pay-in-full date.
 * @remarks Uses flow to assert Account details context before filling.
 * @example

/**
 * @step Provide offence code and sentence date using a relative weeks offset.
 * @param offenceCode - Offence code to enter.
 * @param weeks - Weeks in the past for the sentence date.
 */
When(
  'I provide offence details for offence code {string} with a sentence date {int} weeks in the past',
  (offenceCode: string, weeks: number) => {
    const dateOfSentence = calculateWeeksInPast(weeks);
    log('step', 'Providing offence code and sentence date', { offenceCode, weeks, dateOfSentence });
    offenceDetails().setOffenceField('Offence code', offenceCode);
    offenceDetails().setOffenceField('Date of sentence', dateOfSentence);
    currentImpositionIndex = 0;
  },
);

/**
 * @step Add an offence with impositions and cancel to test unsaved changes.
 * @description Populates offence details + impositions then cancels (choosing Cancel) and remains on the form.
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
 * @description Populates offence details and impositions (with optional creditor types/search) and stays on the form.
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
 * @param optionText - Text of the option/link that should be absent.
 */
Then('the {string} option is not available', (optionText: string) => {
  log('assert', 'Asserting option is not available', { optionText });
  cy.contains(optionText, { matchCase: false }).should('not.exist');
});

/**
 * @step Record imposition result/amount fields.
 * @description Populates Result code, Amount imposed, and Amount paid for each imposition row provided.
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
 * @description Populates imposition financials and sets creditor types/search per row.
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
    currentImpositionIndex = index;
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
 * @description Clicks Add another imposition on the offence form.
 */
When('I add another imposition to the current offence', () => {
  log('click', 'Adding another imposition to the current offence', { currentImpositionIndex });
  offenceDetails().clickAddAnotherImposition();
});

/**
 * @step Seed multiple offences for the account.
 * @description Creates offences from a table with result/amount/creditor info, navigating between add/review pages as needed.
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

  currentOffenceCode = offences[offences.length - 1]?.offenceCode ?? null;
});

/**
 * @step Seed an offence with specific impositions.
 * @description Builds an offence with multiple impositions, result/amount values, and creditor types/details from a table.
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

  Object.entries(offences).forEach(([offenceCode, impositions], index) => {
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

    offenceDetails().clickReviewOffence();
    offenceReview().assertOnReviewPage();
    currentOffenceCode = offenceCode;
  });
});

/**
 * @step Amend an offence from the review page.
 * @description Opens the offence edit form for the given offence code and tracks it for subsequent steps.
 * @param offenceCode - Offence code caption to edit.
 */
When('I choose to amend offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Amending offence from review', { offenceCode });
  offenceReview().assertOnReviewPage();
  offenceReview().clickChangeOffence(offenceCode);
  offenceDetails().assertOnAddOffencePage();
  currentOffenceCode = offenceCode;
});

/**
 * @step Update sentence date for the current offence.
 * @param weeks - Weeks in the past for the new sentence date.
 * @remarks Uses calculateWeeksInPast to derive the date string.
 */
When('I update the sentence date to {int} weeks in the past for the current offence', (weeks: number) => {
  const dateOfSentence = calculateWeeksInPast(weeks);
  log('type', 'Updating sentence date for current offence', { weeks, dateOfSentence });
  offenceDetails().setOffenceField('Date of sentence', dateOfSentence);
});

/**
 * @step Update imposition result/amount values for the current offence.
 * @description Table-driven updates for existing impositions on the active offence.
 * @param table - DataTable of imposition, result code, amount imposed/paid.
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
 * @step Submit offence form and assert review page.
 */
When('I review the offence and see the review page', () => {
  offenceDetails().clickReviewOffence();
  offenceReview().assertOnReviewPage();
});

/**
 * @step Assert offence/imposition field values from a table.
 * @param table - Table containing Field/Value and optional Imposition.
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
 * @param table - Table of Imposition/Creditor type/Creditor search.
 */
When('I set imposition creditor types:', (table: DataTable) => {
  const rows = table.hashes();
  rows.forEach((row) => {
    const index = Number(row['Imposition']) - 1;
    currentImpositionIndex = index;
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
 * @step Fill individual minor creditor form for an imposition.
 * @description Opens the minor creditor form if needed and fills individual details.
 * @param imposition - 1-based imposition number.
 * @param table - Table of minor creditor fields.
 */
When('I maintain minor creditor details for imposition {int}:', (imposition: number, table: DataTable) => {
  const data = normalizeHash(table);
  const index = imposition - 1;
  currentImpositionIndex = index;

  cy.location('pathname').then((pathname) => {
    if (!pathname.includes('minor-creditor')) {
      offenceDetails().openMinorCreditorDetails(index);
    }
    minorCreditor().assertOnMinorCreditorPage();
  });

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
 * @description Opens the minor creditor form if needed and sets company/address fields.
 */
When('I maintain company minor creditor details for imposition {int}:', (imposition: number, table: DataTable) => {
  const data = normalizeHash(table);
  const index = imposition - 1;
  currentImpositionIndex = index;

  cy.location('pathname').then((pathname) => {
    if (!pathname.includes('minor-creditor')) {
      offenceDetails().openMinorCreditorDetails(index);
    }
    minorCreditor().assertOnMinorCreditorPage();
  });

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
 * @param _imposition - 1-based imposition number (unused; kept for readability).
 * @param table - Table of BACS fields.
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
 * @param imposition - 1-based imposition number.
 * @param table - Table of individual + BACS fields.
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
 * @param imposition - 1-based imposition number.
 * @param table - Table of company + BACS fields.
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
 * @description Handles navigation back from review when needed before editing.
 * @param imposition - 1-based imposition number.
 * @param table - Table of individual + BACS fields to update.
 */
When(
  'I update individual minor creditor with BACS details for imposition {int}:',
  (imposition: number, table: DataTable) => {
    const data = normalizeHash(table);
    const index = imposition - 1;
    currentImpositionIndex = index;

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

    cy.location('pathname').then((pathname) => {
      if (pathname.includes('/offence-details/review')) {
        if (!currentOffenceCode) {
          throw new Error('Current offence code is unknown; cannot navigate to change imposition.');
        }
        offenceReview().clickChangeOffence(currentOffenceCode);
        offenceDetails().assertOnAddOffencePage();
      }

      offenceDetails().clickMinorCreditorAction(index, 'Change');
      fillMinorCreditor();
    });
  },
);

/**
 * @step Save minor creditor details for an imposition.
 * @param _imposition - 1-based imposition number (unused; kept for signature parity).
 */
When('I save the minor creditor details for imposition {int}', () => {
  minorCreditor().save();
});

/**
 * @step Assert offence review header/message/text from a table.
 * @param table - Table of Type/Value rows (Header/Message/Text).
 */
Then('I see the offence review details:', (table: DataTable) => {
  const rows = table.hashes();
  rows.forEach(({ Type, Value }) => {
    if (/header/i.test(Type)) {
      offenceReview().assertOnReviewPage(Value);
      return;
    }
    cy.contains(Value).should('exist');
  });
});

/**
 * @step Enter a value into an offence/search/minor creditor field.
 * @description Routes to offence form, search form, or minor creditor form based on the current pathname.
 * @param value - Value to enter.
 * @param fieldLabel - Label of the field to target.
 */
When('I enter {string} into the {string} field', (value: string, fieldLabel: string) => {
  log('type', 'Entering value into field', { fieldLabel, value });

  cy.location('pathname').then((pathname) => {
    if (pathname.includes('search-offences')) {
      const searchField = resolveSearchFieldKey(fieldLabel);
      offenceSearch().setSearchField(searchField, value);
      return;
    }

    try {
      const offenceField = resolveOffenceFieldKey(fieldLabel);
      offenceDetails().setOffenceField(offenceField, value);
      currentImpositionIndex = 0;
      return;
    } catch {
      // Fall through
    }

    const minorField = resolveMinorCreditorFieldKey(fieldLabel);
    minorCreditor().setField(minorField, value);
  });
});

/**
 * @step Assert a value in an offence/imposition/minor creditor field.
 * @description Detects context (offence form, search form, minor creditor form) and asserts the given value.
 */
Then('I see {string} in the {string} field', (expected: string, fieldLabel: string) => {
  log('assert', 'Asserting value in field', { fieldLabel, expected });

  cy.location('pathname').then((pathname) => {
    if (pathname.includes('search-offences')) {
      const searchField = resolveSearchFieldKey(fieldLabel);
      offenceSearch().assertSearchFieldValue(searchField, expected);
      return;
    }

    try {
      const offenceField = resolveOffenceFieldKey(fieldLabel);
      offenceDetails().assertOffenceFieldValue(offenceField, expected);
      return;
    } catch {
      // Fall through
    }

    const minorField = resolveMinorCreditorFieldKey(fieldLabel);
    minorCreditor().assertFieldValue(minorField, expected);
  });
});

/**
 * @step Enter a past date into a date field.
 * @param weeks - Weeks in the past to set.
 * @param fieldLabel - Date field label.
 */
When('I enter a date {int} weeks into the past into the {string} date field', (weeks: number, fieldLabel: string) => {
  const date = calculateWeeksInPast(weeks);
  const field = resolveOffenceFieldKey(fieldLabel);
  log('type', 'Entering past date', { weeks, date, fieldLabel });
  offenceDetails().setOffenceField(field, date);
});

/**
 * @step Enter a future date into a date field.
 * @param weeks - Weeks in the future to set.
 * @param fieldLabel - Date field label.
 */
When('I enter a date {int} weeks into the future into the {string} date field', (weeks: number, fieldLabel: string) => {
  const date = calculateWeeksInFuture(weeks);
  const field = resolveOffenceFieldKey(fieldLabel);
  log('type', 'Entering future date', { weeks, date, fieldLabel });
  offenceDetails().setOffenceField(field, date);
});

/**
 * @step Enter a value into an imposition field.
 * @description Sets Result code/Amount imposed/Amount paid for a specific imposition row.
 */
When('I enter {string} into the {string} field for imposition {int}', (value: string, field: string, row: number) => {
  const fieldKey = resolveImpositionFieldKey(field);
  const index = row - 1;
  currentImpositionIndex = index;
  log('type', 'Entering imposition value', { value, field, index });
  offenceDetails().setImpositionField(index, fieldKey, value);
});

/**
 * @step Clear an imposition field value.
 */
When('I remove the {string} for imposition {int}', (field: string, row: number) => {
  const fieldKey = resolveImpositionFieldKey(field);
  const index = row - 1;
  currentImpositionIndex = index;
  log('clear', 'Clearing imposition field', { field, index, alias: true });
  offenceDetails().clearImpositionField(index, fieldKey);
});

/**
 * @step Perform an action on an imposition.
 * @description Supports Change/Remove/Remove imposition/Show/Hide, handling navigation from review when necessary.
 */
When('I choose to {string} imposition {int}', (action: string, imposition: number) => {
  const index = imposition - 1;
  const normalized = action.toLowerCase();
  log('navigate', 'Choosing imposition action', { action, imposition });

  cy.location('pathname').then((pathname) => {
    if (pathname.includes('/offence-details/review')) {
      if (!currentOffenceCode) {
        throw new Error('Current offence code is unknown; cannot navigate to change imposition.');
      }
      offenceReview().clickChangeOffence(currentOffenceCode);
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
 * @step Seed an offence with two minor creditor impositions.
 * @description Creates one individual + one company minor creditor, then navigates to review.
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

  offence.clickReviewOffence();
  offenceReview().assertOnReviewPage();
  currentOffenceCode = offenceCode;
});

/**
 * @step Assert an imposition field value for a given row.
 */
Then('I see {string} in the {string} field for imposition {int}', (expected: string, field: string, row: number) => {
  const fieldKey = resolveImpositionFieldKey(field);
  const index = row - 1;
  currentImpositionIndex = index;
  log('assert', 'Asserting imposition field value', { expected, field, index });
  offenceDetails().assertImpositionFieldValue(index, fieldKey, expected);
});

/**
 * @step Enter text into the major creditor search for a specific imposition.
 */
When(
  'I enter {string} into the "Search using name or code" search box for imposition {int}',
  (value: string, row: number) => {
    const index = row - 1;
    currentImpositionIndex = index;
    log('type', 'Entering major creditor search value', { value, index });
    offenceDetails().setMajorCreditor(index, value);
  },
);

/**
 * @step Enter text into the current major creditor search box.
 */
When('I enter {string} into the "Search using name or code" search box', (value: string) => {
  log('type', 'Entering major creditor search value', { value, index: currentImpositionIndex });
  offenceDetails().setMajorCreditor(currentImpositionIndex, value);
});

/**
 * @step Assert the major creditor value for an imposition.
 */
Then(
  'I see {string} in the "Search using name or code" field for imposition {int}',
  (expected: string, row: number) => {
    const index = row - 1;
    currentImpositionIndex = index;
    log('assert', 'Asserting major creditor value', { expected, index });
    offenceDetails().assertMajorCreditorValue(index, expected);
  },
);

/**
 * @step Select creditor type radio for an imposition.
 */
When('I select the {string} radio button for imposition {int}', (label: string, row: number) => {
  const index = row - 1;
  currentImpositionIndex = index;
  const normalized = label.toLowerCase();
  const type = normalized.includes('minor') ? 'minor' : 'major';
  log('click', 'Selecting creditor type for imposition', { label, type, index });
  offenceDetails().selectCreditorType(index, type as 'major' | 'minor');
});

/**
 * @step Select creditor type or minor creditor type based on label.
 */
When('I select the {string} radio button', (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('minor creditor') || normalized.includes('major creditor')) {
    const type = normalized.includes('minor') ? 'minor' : 'major';
    log('click', 'Selecting creditor type (default imposition)', { label, type, index: currentImpositionIndex });
    offenceDetails().selectCreditorType(currentImpositionIndex, type as 'major' | 'minor');
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
 * @step Select a dropdown value on the minor creditor form.
 * @remarks Currently supports Title only.
 */
When('I select {string} from the {string} dropdown', (value: string, label: string) => {
  if (!/title/i.test(label)) {
    throw new Error(`Unknown dropdown label: ${label}`);
  }
  log('select', 'Selecting dropdown value', { label, value });
  minorCreditor().selectTitle(value);
});

/**
 * @step Toggle the BACS checkbox on the minor creditor form ON.
 */
When('I select the "I have BACS payment details" checkbox', () => {
  log('click', 'Selecting BACS checkbox');
  minorCreditor().togglePayByBacs(true);
});

/**
 * @step Toggle the BACS checkbox on the minor creditor form OFF.
 */
When('I unselect the "I have BACS payment details" checkbox', () => {
  log('click', 'Unselecting BACS checkbox');
  minorCreditor().togglePayByBacs(false);
});

/**
 * @step Assert which minor creditor type radio is selected.
 */
Then('I validate the {string} radio button is selected', (label: string) => {
  const normalized = label.toLowerCase();
  const type = normalized.includes('individual') ? 'Individual' : 'Company';
  log('assert', 'Asserting radio selected', { label, type });
  minorCreditor().assertCreditorTypeSelected(type as 'Individual' | 'Company');
});

/**
 * @step Add another imposition panel.
 */
When('I add another imposition', () => {
  offenceDetails().clickAddAnotherImposition();
});

/**
 * @step Add another offence from the review page.
 */
When('I add another offence', () => {
  log('navigate', 'Adding another offence');
  offenceReview().clickAddAnotherOffence();
  offenceDetails().assertOnAddOffencePage();
});

/**
 * @step Submit the current offence for review (no assertion).
 */
When('I review the offence', () => {
  offenceDetails().clickReviewOffence();
});

/**
 * @step Submit offence and assert review page (multi-offence flows).
 */
When('I review all offences', () => {
  offenceDetails().clickReviewOffence();
  offenceReview().assertOnReviewPage();
});

/**
 * @step Assert the remove imposition confirmation header.
 */
Then('I am asked to confirm removing imposition {int}', (_imposition: number) => {
  log('assert', 'Asserting remove imposition confirmation header');
  common().assertHeaderContains('Are you sure you want to remove this imposition?');
});

/**
 * @step Assert the current page header contains provided text.
 */
Then('I am on the page header {string}', (header: string) => {
  log('assert', 'Asserting page header', { header });
  common().assertHeaderContains(header);
});

// Asserts the Add an offence header is displayed (alias).
Then('I am viewing Add an Offence', () => {
  log('assert', 'Asserting Add an offence header (alias)');
  common().assertHeaderContains('Add an offence');
});

// Asserts the Offences and impositions review header is displayed (alias).
Then('I am viewing Offences and impositions', () => {
  log('assert', 'Asserting Offences and impositions header (alias)');
  common().assertHeaderContains('Offences and impositions');
});

// Asserts the offence search form header is displayed (alias).
Then('I am viewing Search offences', () => {
  log('assert', 'Asserting Search offences header (alias)');
  offenceSearch().assertOnSearchPage();
});

// Asserts the offence search results header is displayed (alias).
Then('I am viewing offence results', () => {
  log('assert', 'Asserting offence search results header (alias)');
  offenceSearch().assertOnResultsPage();
});

// Validates totals in the summary table on review.
Then('the summary table should contain the following data:', (table: DataTable) => {
  const rows = normalizeTableRows(table);
  offenceReview().assertTotals(rows);
});

// Validates totals presented as a summary list (definition list).
Then('the summary list will contain the following data:', (table: DataTable) => {
  const rows = normalizeTableRows(table);
  offenceReview().assertTotals(rows);
});

// Alias to validate totals in the summary table.
Then('the summary table contains the following data:', (table: DataTable) => {
  const rows = normalizeTableRows(table);
  offenceReview().assertTotals(rows);
});

/**
 * @step Open the minor creditor form for an imposition.
 */
When('I open minor creditor details for imposition {int}', (row: number) => {
  const index = row - 1;
  currentImpositionIndex = index;
  offenceDetails().openMinorCreditorDetails(index);
});

/**
 * @step Open company minor creditor, populate company name, cancel, and assert values persist.
 */
When(
  'I open and cancel company minor creditor for imposition {int} with company {string}',
  (imposition: number, company: string) => {
    const index = imposition - 1;
    currentImpositionIndex = index;
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
 */
When('I view minor creditor details for imposition {int}', (row: number) => {
  const index = row - 1;
  currentImpositionIndex = index;
  offenceDetails().toggleMinorCreditorDetails(index, 'Show details');
});

/**
 * @step Assert minor creditor summary details for an imposition.
 */
Then('I see the minor creditor summary for imposition {int}:', (imposition: number, table: DataTable) => {
  const expectations = normalizeHash(table);
  log('assert', 'Asserting minor creditor summary', { imposition, expectations });
  flow().assertMinorCreditorSummary(imposition, expectations);
});

/**
 * @step Assert remove imposition links exist for provided impositions.
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
 * @step Cancel minor creditor removal for an imposition.
 * @description Handles navigation from review back to edit before cancelling.
 */
When('I cancel removing the minor creditor for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  cy.location('pathname').then((pathname) => {
    if (pathname.includes('/offence-details/review')) {
      if (!currentOffenceCode) {
        throw new Error('Current offence code is unknown; cannot navigate to change imposition.');
      }
      offenceReview().clickChangeOffence(currentOffenceCode);
      offenceDetails().assertOnAddOffencePage();
    }
    offenceDetails().clickMinorCreditorAction(index, 'Remove');
    common().assertHeaderContains('Are you sure you want to remove this minor creditor?');
    offenceDetails().cancelRemoveMinorCreditor();
    offenceDetails().assertOnAddOffencePage();
  });
});

/**
 * @step Confirm minor creditor removal for an imposition.
 * @description Handles navigation from review back to edit before confirming removal.
 */
When('I confirm removing the minor creditor for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  cy.location('pathname').then((pathname) => {
    if (pathname.includes('/offence-details/review')) {
      if (!currentOffenceCode) {
        throw new Error('Current offence code is unknown; cannot navigate to change imposition.');
      }
      offenceReview().clickChangeOffence(currentOffenceCode);
      offenceDetails().assertOnAddOffencePage();
    }
    offenceDetails().clickMinorCreditorAction(index, 'Remove');
    common().assertHeaderContains('Are you sure you want to remove this minor creditor?');
    offenceDetails().confirmRemoveMinorCreditor();
    offenceDetails().assertMinorCreditorAbsent(index);
  });
});

/**
 * @step Cancels offence details and responds to the unsaved changes dialog.
 * @description Asserts the offence details page, clicks Cancel, and chooses the provided prompt option.
 * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
 * @remarks Use while on Add an offence to validate unsaved changes handling.
 * @example When I cancel offence details choosing "Cancel"
 */
When('I cancel offence details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling offence details', { choice });
  offenceDetails().assertOnAddOffencePage();
  offenceDetails().cancelOffenceDetails(choice);
});

/**
 * @step Cancels the minor creditor form and chooses a prompt response.
 * @description Guards the minor creditor page before triggering the Cancel action.
 * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
 * @remarks Use when validating unsaved changes on the minor creditor form.
 * @example When I cancel minor creditor details choosing "Ok"
 */
When('I cancel minor creditor details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling minor creditor details', { choice });
  minorCreditor().assertOnMinorCreditorPage();
  minorCreditor().cancelAndChoose(choice);
});

/**
 * @step Opens the remove offence confirmation page for the given offence code.
 * @description Guards the offence review page before selecting Remove.
 * @param offenceCode - Offence code caption to remove.
 * @remarks Keeps navigation consistent by asserting the review page before clicking Remove.
 * @example When I choose to remove offence with offence code "HY35014"
 */
When('I choose to remove offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Opening remove offence confirmation', { offenceCode });
  offenceReview().assertOnReviewPage();
  offenceReview().clickRemoveOffence(offenceCode);
});

/**
 * @step Asserts the remove offence confirmation page is displayed.
 * @description Verifies pathname/header and that the offence code caption is visible.
 * @param offenceCode - Offence code caption expected on the confirmation page.
 * @remarks Use immediately after triggering Remove to guard against stale headers.
 * @example Then I am asked to confirm removing offence with offence code "HY35014"
 */
Then('I am asked to confirm removing offence with offence code {string}', (offenceCode: string) => {
  log('assert', 'Asserting remove offence confirmation', { offenceCode });
  offenceReview().assertOnRemoveOffencePage(offenceCode);
});

/**
 * @step Cancels offence removal from the confirmation page.
 * @description Leaves the offence intact and returns to the offence review page.
 * @param offenceCode - Offence code caption shown on the confirmation page.
 * @remarks Reasserts the review page after cancelling to avoid stale state.
 * @example When I cancel removing offence with offence code "HY35014"
 */
When('I cancel removing offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Cancelling offence removal', { offenceCode });
  offenceReview().assertOnRemoveOffencePage(offenceCode);
  offenceReview().cancelRemoveOffence();
  offenceReview().assertOnReviewPage();
});

/**
 * @step Confirms offence removal from the confirmation page.
 * @description Confirms deletion and asserts the offence review page is shown again.
 * @param offenceCode - Offence code caption shown on the confirmation page.
 * @remarks Returns to the review page to continue multi-offence journeys.
 * @example When I confirm removing offence with offence code "HY35014"
 */
When('I confirm removing offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Confirming offence removal', { offenceCode });
  offenceReview().assertOnRemoveOffencePage(offenceCode);
  offenceReview().confirmRemoveOffence();
  offenceReview().assertOnReviewPage();
});

/**
 * @step Remove an offence from review and assert it is absent.
 */
When('I remove offence with offence code {string} and confirm', (offenceCode: string) => {
  log('flow', 'Removing offence with confirmation', { offenceCode });
  offenceReview().assertOnReviewPage();
  offenceReview().clickRemoveOffence(offenceCode);
  offenceReview().assertOnRemoveOffencePage(offenceCode);
  offenceReview().confirmRemoveOffence();
  offenceReview().assertOnReviewPage();
  offenceReview().assertOffenceAbsent(offenceCode);
});

/**
 * @step Cancels imposition removal from the confirmation screen.
 * @description Assumes the remove imposition confirmation page is visible.
 * @param imposition - 1-based imposition number.
 */
When('I cancel removing imposition {int}', (imposition: number) => {
  log('navigate', 'Cancelling imposition removal', { imposition });
  offenceDetails().cancelRemoveImposition();
});

When('I cancel the remove minor creditor confirmation', () => {
  log('navigate', 'Cancelling minor creditor removal confirmation');
  offenceDetails().cancelRemoveMinorCreditor();
  offenceDetails().assertOnAddOffencePage();
});

/**
 * @step Confirms imposition removal from the confirmation screen.
 * @description Assumes the remove imposition confirmation page is visible.
 * @param imposition - 1-based imposition number.
 */
When('I confirm removing imposition {int}', (imposition: number) => {
  log('navigate', 'Confirming imposition removal', { imposition });
  offenceDetails().confirmRemoveImposition();
});

/**
 * @step Remove an imposition by index (confirmation path).
 * @param imposition - 1-based imposition number.
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
 * @param _row - Row number (unused, kept for readability in Gherkin).
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
 * @step Assert offence review table rows for a given offence code.
 * @param offenceCode - Offence code caption.
 * @param table - Table of expected rows (headers + values).
 */
Then(
  'the table with offence code {string} should contain the following information:',
  (offenceCode: string, table: DataTable) => {
    const rows = normalizeTableRows(table);
    currentOffenceCode = offenceCode;
    offenceReview().assertOffenceTable(offenceCode, rows);
  },
);

/**
 * @step Assert summary list values on the review page.
 * @description Validates definition list entries under the Totals section.
 */
Then('the summary list should contain the following information:', (dataTable: any) => {
  const expectedData: string[][] = dataTable.raw();

  cy.get('h1, h2')
    .contains('Totals')
    .parent()
    .parent()
    .next()
    .children()
    .children()
    .within(() => {
      expectedData.forEach((row: string[], index: number) => {
        const [term, value] = row;

        cy.get('dt').eq(index).should('contain.text', term.trim());
        cy.get('dd').eq(index).should('contain.text', value.trim());
      });
    });
});

/**
 * @step Assert an offence review table matches expected rows.
 */
Then(
  'I see the offence review for offence code {string} with the following information:',
  (offenceCode: string, table: DataTable) => {
    const rows = normalizeTableRows(table);
    currentOffenceCode = offenceCode;
    offenceReview().assertOnReviewPage();
    offenceReview().assertOffenceTable(offenceCode, rows);
  },
);

/**
 * @step Assert an offence caption is present on the review page.
 */
Then('I see offence {string} on the offence review page', (offenceCode: string) => {
  log('assert', 'Asserting offence is visible on review', { offenceCode });
  offenceReview().assertOnReviewPage();
  cy.contains(L.review.offenceCaption, offenceCode, { timeout: 10_000 }).should('exist');
});

/**
 * @step Assert an offence code is absent from the review page.
 */
Then('I do not see the offence code {string}', (offenceCode: string) => {
  offenceReview().assertOffenceAbsent(offenceCode);
});

/**
 * @step Asserts minor creditor summary is absent for an imposition.
 * @description Checks the imposition card does not render minor creditor details.
 * @param imposition - 1-based imposition number.
 * @remarks Use after removals or cancelled edits to confirm the summary is cleared.
 * @example Then I do not see minor creditor details for imposition 1
 */
Then('I do not see minor creditor details for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  log('assert', 'Asserting minor creditor details are absent', { imposition });
  offenceDetails().assertMinorCreditorAbsent(index);
});

/**
 * @step Assert date of sentence ordering for two offences.
 * @param weeksAbove - Weeks offset for the offence expected first.
 * @param weeksBelow - Weeks offset for the offence expected second.
 */
Then(
  'I see the date of sentence {int} weeks ago above the date of sentence {int} weeks ago',
  (weeksAbove: number, weeksBelow: number) => {
    const topDate = formatDateString(calculateWeeksInPast(weeksAbove));
    const bottomDate = formatDateString(calculateWeeksInPast(weeksBelow));
    offenceReview().assertDateOfSentenceOrder([topDate, bottomDate]);
  },
);

/**
 * @step Assert offences are ordered by sentence date based on offsets.
 */
Then('I see the offences ordered by sentence date:', (table: DataTable) => {
  const rows = table.hashes().sort((a, b) => Number(a['Position']) - Number(b['Position']));
  const formattedDates = rows.map(({ ['Sentence date offset']: offset }) => {
    const { weeks, direction } = parseWeeksValue(offset);
    const date = direction === 'future' ? calculateWeeksInFuture(weeks) : calculateWeeksInPast(weeks);
    return formatDateString(date);
  });
  offenceReview().assertDateOfSentenceOrder(formattedDates);
});

/**
 * @step Assert a provided header fragment is visible on the page.
 */
Then('I see {string} on the page header', (header: string) => {
  log('assert', 'Asserting page header', { header });
  common().assertHeaderContains(header);
});

/**
 * @step Assert arbitrary text content exists on the page.
 */
Then('I see {string} text on the page', (text: string) => {
  log('assert', 'Checking text on page', { text });
  cy.contains(text).should('exist');
});

/**
 * @step Assert the empty-offence messaging is shown.
 */
Then('I see no offences messaging', () => {
  log('assert', 'Asserting no offences messaging');
  cy.contains('There are no offences').should('exist');
  cy.contains('Add another offence').should('exist');
  cy.contains('Return to account details').should('exist');
});

/**
 * @step Assert a link with given text is not present.
 */
Then('the link with text {string} should not be present', (linkText: string) => {
  log('assert', 'Ensuring link is not present', { linkText });
  cy.contains('a', linkText).should('not.exist');
});

/**
 * @step Assert a button with given text is not present.
 */
Then('the button with text {string} should not be present', (text: string) => {
  log('assert', 'Ensuring button is not present', { text });
  cy.contains('button', text).should('not.exist');
});

/**
 * @step Assert a button with given text is not present (alias).
 */
Then('I should not see the button with text {string}', (text: string) => {
  log('assert', 'Ensuring button is not present (alias)', { text });
  cy.contains('button', text).should('not.exist');
});

/**
 * @step Assert arbitrary text is visible (alias).
 */
Then('I should see the text {string}', (text: string) => {
  log('assert', 'Asserting text is visible', { text });
  cy.contains(text).should('exist');
});

/**
 * @step Return to Account details from offence details/review depending on current route.
 */
When('I return to account details from offence details', () => {
  cy.location('pathname').then((pathname) => {
    if (pathname.includes('offence-details/review')) {
      offenceReview().returnToAccountDetails();
      return;
    }
    offenceDetails().clickReturnToAccountDetails();
  });
});

/**
 * @step Save minor creditor details (alias).
 */
When('I save the minor creditor details', () => {
  minorCreditor().save();
});

/**
 * @step Assert a task status on Account details.
 * @param taskName - Task name (e.g., Offence details).
 * @param status - Expected status text.
 */
// Alias handled in manual-account-creation.steps.ts to keep status checks in one place.

/**
 * @step Navigate from offence review to Payment terms using the CTA.
 * @description Guards the review page before clicking Add payment terms.
 */
When('I continue to payment terms from offence review', () => {
  log('navigate', 'Continuing to payment terms from offence review');
  offenceReview().assertOnReviewPage();
  offenceReview().clickAddPaymentTerms();
});

/**
 * @step Open the offence search link in the same tab.
 */
When('I follow the offence search link in the same tab', () => {
  offenceDetails().openOffenceSearchLink();
});

/**
 * @step Submits the offence search form.
 * @description Asserts the offence search page before clicking Search.
 * @remarks Keeps the search flow guarded to avoid stale DOM interactions.
 * @example When I submit the offence search
 */
When('I submit the offence search', () => {
  log('action', 'Submitting offence search form');
  offenceSearch().assertOnSearchPage();
  offenceSearch().submitSearch();
});

/**
 * @step Returns to the offence search form from results.
 * @description Guards the results page, selects Back, and asserts the search form is shown.
 * @remarks Use to verify search field persistence after viewing results.
 * @example When I return to the offence search form
 */
When('I return to the offence search form', () => {
  log('navigate', 'Returning to offence search form');
  offenceSearch().assertOnResultsPage();
  offenceSearch().clickBackLink();
  offenceSearch().assertOnSearchPage();
});

/**
 * @step Assert offence search form values.
 */
Then('I see the offence search form with:', (table: DataTable) => {
  const data = table.rowsHash();
  log('assert', 'Asserting offence search form values', { data });
  offenceSearch().assertOnSearchPage();

  Object.entries(data).forEach(([fieldLabel, expected]) => {
    const searchField = resolveSearchFieldKey(fieldLabel);
    offenceSearch().assertSearchFieldValue(searchField, expected.toString().trim());
  });
});

Then(
  'I see {string} in the Search results table in the {string} column',
  (value: string, column: SearchResultColumn) => {
    offenceSearch().assertResultContains(column, value);
  },
);

/**
 * @step Select the include inactive offence codes checkbox.
 */
When('I select the "Include inactive offence codes" checkbox', () => {
  log('click', 'Selecting include inactive offences checkbox');
  offenceSearch().toggleIncludeInactive(true);
});

/**
 * @step Unselect the include inactive offence codes checkbox.
 */
When('I unselect the "Include inactive offence codes" checkbox', () => {
  log('click', 'Unselecting include inactive offences checkbox');
  offenceSearch().toggleIncludeInactive(false);
});

/**
 * @step Search offences using a data table of field/value pairs.
 */
When('I search offences with:', (table: DataTable) => {
  offenceSearch().assertOnSearchPage();
  const data = table.rowsHash();

  Object.entries(data).forEach(([fieldLabel, value]) => {
    if (!value) return;
    const searchField = resolveSearchFieldKey(fieldLabel);
    offenceSearch().setSearchField(searchField, value.toString().trim());
  });

  offenceSearch().submitSearch();
});

/**
 * @step Run a11y checks on minor creditor form (individual/company) and save.
 */
When(
  'I perform minor creditor accessibility checks for imposition {int} with company {string}',
  (imposition: number, company: string) => {
    const index = imposition - 1;
    currentImpositionIndex = index;
    log('a11y', 'Running minor creditor accessibility checks', { imposition, company });

    offenceDetails().openMinorCreditorDetails(index);
    minorCreditor().assertOnMinorCreditorPage();
    minorCreditor().selectCreditorType('Individual');
    accessibilityActions().checkAccessibilityOnly();

    minorCreditor().selectCreditorType('Company');
    minorCreditor().setField('company', company);
    minorCreditor().togglePayByBacs(true);
    accessibilityActions().checkAccessibilityOnly();
    minorCreditor().togglePayByBacs(false);
    minorCreditor().save();
    offenceDetails().assertOnAddOffencePage();
  },
);

/**
 * @step Run a11y check on remove minor creditor confirmation and cancel.
 */
When('I perform remove minor creditor accessibility check for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  log('a11y', 'Running remove minor creditor accessibility check', { imposition });
  offenceDetails().clickMinorCreditorAction(index, 'Remove');
  common().assertHeaderContains('Are you sure you want to remove this minor creditor?');
  accessibilityActions().checkAccessibilityOnly();
  offenceDetails().cancelRemoveMinorCreditor();
  offenceDetails().assertOnAddOffencePage();
});

/**
 * @step Run a11y check on remove imposition confirmation and cancel.
 */
When('I perform remove imposition accessibility check for imposition {int}', (imposition: number) => {
  const index = imposition - 1;
  log('a11y', 'Running remove imposition accessibility check', { imposition });
  offenceDetails().clickRemoveImposition(index);
  common().assertHeaderContains('Are you sure you want to remove this imposition?');
  accessibilityActions().checkAccessibilityOnly();
  offenceDetails().cancelRemoveImposition();
  offenceDetails().assertOnAddOffencePage();
});

/**
 * @step Run a11y checks around offence removal (confirm).
 */
When('I perform offence removal accessibility check for offence code {string}', (offenceCode: string) => {
  log('a11y', 'Running offence removal accessibility check', { offenceCode });
  offenceReview().assertOnReviewPage();
  offenceReview().clickRemoveOffence(offenceCode);
  offenceReview().assertOnRemoveOffencePage(offenceCode);
  accessibilityActions().checkAccessibilityOnly();
  offenceReview().confirmRemoveOffence();
  offenceReview().assertOnReviewPage();
  common().assertHeaderContains('Offences and impositions');
  accessibilityActions().checkAccessibilityOnly();
});

// Asserts offence review tables for a given offence code using raw table data (legacy helper).
Then(
  'the table with offence code {string} will contain the following data:',
  (offenceCode: string, dataTable: DataTable) => {
    // Extract expected rows from the data table
    const expectedRows = dataTable.raw();

    // Locate the table by finding the offence code in the caption
    cy.get('span.govuk-caption-m')
      .contains(offenceCode)
      .parentsUntil('app-fines-mac-offence-details-review-offence')
      .parent()
      .next('app-fines-mac-offence-details-review-offence-imposition')
      .within(() => {
        // Verify table headers
        cy.get('thead th').each((header, headerIndex) => {
          // Check if each header matches the expected header text
          cy.wrap(header).should('contain.text', expectedRows[0][headerIndex].trim());
        });

        // Verify table rows
        cy.get('tbody tr').each((row, rowIndex) => {
          // Get the expected data for the current row
          const expectedRowData = expectedRows[rowIndex + 1];
          cy.wrap(row).within(() => {
            // Verify each cell in the row
            cy.get('td, th').each((cell, colIndex) => {
              // Adjust column index if the row has a specific class
              if (row.hasClass('govuk-light-grey-background-color')) {
                if (colIndex >= 1 && colIndex <= 3) {
                  colIndex += 1;
                }
              }
              // Check if each cell matches the expected cell text
              cy.wrap(cell).should('contain.text', expectedRowData[colIndex].trim());
            });
          });
        });
      });
  },
);
