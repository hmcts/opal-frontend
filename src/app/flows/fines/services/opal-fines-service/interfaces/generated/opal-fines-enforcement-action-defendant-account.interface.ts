/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { ResultReferenceCommon } from './opal-fines-result-reference-common.interface';
import type { EnforcerReferenceCommon } from './opal-fines-enforcer-reference-common.interface';
import type { ResultResponsesCommon } from './opal-fines-result-responses-common.interface';

export interface EnforcementActionDefendantAccount {
  /**
   *
   * @type {ResultReferenceCommon}
   * @memberof EnforcementActionDefendantAccount
   */
  enforcement_action: ResultReferenceCommon;
  /**
   *
   * @type {string}
   * @memberof EnforcementActionDefendantAccount
   */
  reason: string | null;
  /**
   *
   * @type {EnforcerReferenceCommon}
   * @memberof EnforcementActionDefendantAccount
   */
  enforcer: EnforcerReferenceCommon | null;
  /**
   *
   * @type {string}
   * @memberof EnforcementActionDefendantAccount
   */
  warrant_number: string | null;
  /**
   *
   * @type {string}
   * @memberof EnforcementActionDefendantAccount
   */
  date_added: string;
  /**
   *
   * @type {Array<ResultResponsesCommon>}
   * @memberof EnforcementActionDefendantAccount
   */
  result_responses: Array<ResultResponsesCommon> | null;
}
