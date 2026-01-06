/**
 * Shared helpers and state for manual account creation offence step definitions.
 */
import { ManualAccountCreationFlow } from '../../../../e2e/functional/opal/flows/manual-account-creation.flow';
import { ManualOffenceDetailsActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/offence-details.actions';
import { ManualOffenceMinorCreditorActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/offence-minor-creditor.actions';
import { ManualOffenceReviewActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/offence-review.actions';
import { ManualOffenceSearchActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/offence-search.actions';
import { ManualAccountDetailsActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/account-details.actions';
import { CommonActions } from '../../../../e2e/functional/opal/actions/common/common.actions';
import { log } from '../../../utils/log.helper';

export const flow = () => new ManualAccountCreationFlow();
export const offenceDetails = () => new ManualOffenceDetailsActions();
export const minorCreditor = () => new ManualOffenceMinorCreditorActions();
export const offenceReview = () => new ManualOffenceReviewActions();
export const offenceSearch = () => new ManualOffenceSearchActions();
export const details = () => new ManualAccountDetailsActions();
export const common = () => new CommonActions();

let currentImpositionIndex = 0;
let currentOffenceCode: string | null = null;

export const getCurrentImpositionIndex = (): number => currentImpositionIndex;
export const setCurrentImpositionIndex = (index: number): void => {
  currentImpositionIndex = index;
};

export const getCurrentOffenceCode = (): string | null => currentOffenceCode;
export const setCurrentOffenceCode = (code: string | null): void => {
  currentOffenceCode = code;
};

export type ImpositionFinancialRow = {
  imposition: number;
  resultCode?: string;
  amountImposed?: string;
  amountPaid?: string;
};

/**
 * Ensures the requested imposition panel exists, adding one if necessary.
 * @param index Zero-based imposition index to ensure is present.
 * @param attempts Internal retry counter to avoid infinite recursion.
 * @returns Cypress chainable that resolves when the panel exists.
 */
export const ensureImpositionExists = (index: number, attempts: number = 0): Cypress.Chainable => {
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
        if (count <= index + 1) {
          offenceDetails().clickAddAnotherImposition();
        }
        return ensureImpositionExists(index, attempts + 1);
      });
  });
};

/**
 * Upserts imposition financial values, ensuring panels exist and tracking the current index.
 * @param rows Array of imposition rows to insert/update.
 */
export const upsertImpositionFinancialRows = (rows: ImpositionFinancialRow[]): void => {
  const sorted = [...rows].sort((a, b) => a.imposition - b.imposition);
  sorted.forEach(({ imposition }) => {
    if (!imposition || Number.isNaN(imposition) || imposition < 1) {
      throw new Error(`Invalid imposition value: ${imposition}`);
    }
  });
  log('type', 'Upserting imposition financial rows', { rows: sorted });

  sorted
    .reduce((chain, row: ImpositionFinancialRow) => {
      const { imposition, resultCode, amountImposed, amountPaid } = row;
      const index = imposition - 1;
      return chain
        .then(() => ensureImpositionExists(index))
        .then(() => {
          setCurrentImpositionIndex(index);
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
    }, cy.wrap(null))
    .then(() => undefined);
};
