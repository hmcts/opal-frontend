/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { LastEnforcementActionCommon } from './opal-fines-last-enforcement-action-common.interface';
import type { EnforcementOverrideCommon } from './opal-fines-enforcement-override-common.interface';

export interface EnforcementStatusSummaryCommon {
  /**
   *
   * @type {LastEnforcementActionCommon}
   * @memberof EnforcementStatusSummaryCommon
   */
  last_enforcement_action: LastEnforcementActionCommon | null;
  /**
   *
   * @type {boolean}
   * @memberof EnforcementStatusSummaryCommon
   */
  collection_order_made: boolean;
  /**
   *
   * @type {number}
   * @memberof EnforcementStatusSummaryCommon
   */
  default_days_in_jail: number | null;
  /**
   *
   * @type {EnforcementOverrideCommon}
   * @memberof EnforcementStatusSummaryCommon
   */
  enforcement_override: EnforcementOverrideCommon | null;
  /**
   *
   * @type {string}
   * @memberof EnforcementStatusSummaryCommon
   */
  last_movement_date: string | null;
}
