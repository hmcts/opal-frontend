/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor } from './opal-fines-get-major-creditor-account-header-summary-response-major-creditor.interface';
import type { BusinessUnitSummaryCommon } from './opal-fines-business-unit-summary-common.interface';

export interface GetMajorCreditorAccountHeaderSummaryResponse {
  /**
   *
   * @type {GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor}
   * @memberof GetMajorCreditorAccountHeaderSummaryResponse
   */
  major_creditor: GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor;
  /**
   * A monetary value that is zero or positive, with up to two decimal places.
   * @type {number}
   * @memberof GetMajorCreditorAccountHeaderSummaryResponse
   */
  awaiting_payout: number | null;
  /**
   *
   * @type {BusinessUnitSummaryCommon}
   * @memberof GetMajorCreditorAccountHeaderSummaryResponse
   */
  business_unit_details: BusinessUnitSummaryCommon;
}
