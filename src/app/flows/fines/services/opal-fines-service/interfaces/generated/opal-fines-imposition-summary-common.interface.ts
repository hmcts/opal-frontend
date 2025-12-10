/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { PostedDetailsCommon } from './opal-fines-posted-details-common.interface';
import type { ResultReferenceCommon } from './opal-fines-result-reference-common.interface';
import type { CreditorAccountTypeReferenceCommon } from './opal-fines-creditor-account-type-reference-common.interface';
import type { OffenceReferenceCommon } from './opal-fines-offence-reference-common.interface';
import type { CourtReferenceCommon } from './opal-fines-court-reference-common.interface';

export interface ImpositionSummaryCommon {
  /**
   *
   * @type {PostedDetailsCommon}
   * @memberof ImpositionSummaryCommon
   */
  posted_details: PostedDetailsCommon;
  /**
   * DB Mapping - impositions.result_id
   * @type {ResultReferenceCommon}
   * @memberof ImpositionSummaryCommon
   */
  result: ResultReferenceCommon;
  /**
   * DB Mapping - impositions.creditor_account_id
   * @type {CreditorAccountTypeReferenceCommon}
   * @memberof ImpositionSummaryCommon
   */
  creditor: CreditorAccountTypeReferenceCommon;
  /**
   * A monetary value that is zero or positive, with up to two decimal places.
   * @type {number}
   * @memberof ImpositionSummaryCommon
   */
  imposed_amount: number;
  /**
   * A monetary value that is zero or positive, with up to two decimal places.
   * @type {number}
   * @memberof ImpositionSummaryCommon
   */
  paid_amount: number;
  /**
   * A monetary value that is zero or positive, with up to two decimal places.
   * @type {number}
   * @memberof ImpositionSummaryCommon
   */
  balance: number;
  /**
   *
   * @type {string}
   * @memberof ImpositionSummaryCommon
   */
  date_imposed: string;
  /**
   *
   * @type {OffenceReferenceCommon}
   * @memberof ImpositionSummaryCommon
   */
  offence: OffenceReferenceCommon;
  /**
   * DB Mapping - impositions.imposing_court_id
   * @type {CourtReferenceCommon}
   * @memberof ImpositionSummaryCommon
   */
  imposing_court: CourtReferenceCommon | null;
  /**
   *
   * @type {number}
   * @memberof ImpositionSummaryCommon
   */
  imposition_id: number;
}
