/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { EnforcementOverrideResultReferenceCommon } from './opal-fines-enforcement-override-result-reference-common.interface';
import type { EnforcerReferenceCommon } from './opal-fines-enforcer-reference-common.interface';
import type { LjaReferenceCommon } from './opal-fines-lja-reference-common.interface';

export interface EnforcementOverrideCommon {
  /**
   *
   * @type {EnforcementOverrideResultReferenceCommon}
   * @memberof EnforcementOverrideCommon
   */
  enforcement_override_result: EnforcementOverrideResultReferenceCommon;
  /**
   *
   * @type {EnforcerReferenceCommon}
   * @memberof EnforcementOverrideCommon
   */
  enforcer: EnforcerReferenceCommon | null;
  /**
   *
   * @type {LjaReferenceCommon}
   * @memberof EnforcementOverrideCommon
   */
  lja: LjaReferenceCommon | null;
}
