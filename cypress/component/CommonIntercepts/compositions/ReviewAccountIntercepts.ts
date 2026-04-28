import { interceptCourtsByBU } from '../referenceData/courts/CourtsIntercepts';
import { interceptLocalJusticeAreas } from '../referenceData/localJusticeAreas/LocalJusticeAreasIntercepts';
import { interceptMajorCreditorsByBU } from '../referenceData/majorCreditors/MajorCreditorsIntercepts';
import { interceptProsecutors } from '../referenceData/prosecutors/ProsecutorsIntercepts';
import { interceptResultsByIds } from '../referenceData/results/ResultsIntercepts';

const REVIEW_ACCOUNT_RESULT_IDS = ['FCOMP', 'FVS', 'FCOST', 'FCPC', 'FO', 'FCC', 'FVEBD', 'FFR'];

/**
 * Registers the reference-data intercepts needed by manual-account review-account component tests.
 *
 * @param businessUnitId - Business unit used to filter court and major-creditor reference data.
 */
export function interceptRefDataForReviewAccount(businessUnitId: number) {
  interceptCourtsByBU(businessUnitId);
  interceptMajorCreditorsByBU(businessUnitId);
  interceptLocalJusticeAreas();
  interceptResultsByIds(REVIEW_ACCOUNT_RESULT_IDS);
  interceptProsecutors();
}
