/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { GetCentralFundByBusinessUnitResponseMajorCreditor } from './opal-fines-get-central-fund-by-business-unit-response-major-creditor.interface';
import type { BusinessUnitSummaryCommon } from './opal-fines-business-unit-summary-common.interface';

export interface GetCentralFundByBusinessUnitResponse {
  /**
   *
   * @type {GetCentralFundByBusinessUnitResponseMajorCreditor}
   * @memberof GetCentralFundByBusinessUnitResponse
   */
  major_creditor: GetCentralFundByBusinessUnitResponseMajorCreditor;
  /**
   *
   * @type {BusinessUnitSummaryCommon}
   * @memberof GetCentralFundByBusinessUnitResponse
   */
  business_unit_details: BusinessUnitSummaryCommon;
}
