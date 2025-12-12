/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { CollectionOrderCommon } from './opal-fines-collection-order-common.interface';
import type { CourtReferenceCommon } from './opal-fines-court-reference-common.interface';

export interface EnforcementOverviewDefendantAccount {
  /**
   *
   * @type {CollectionOrderCommon}
   * @memberof EnforcementOverviewDefendantAccount
   */
  collection_order: CollectionOrderCommon;
  /**
   *
   * @type {number}
   * @memberof EnforcementOverviewDefendantAccount
   */
  days_in_default: number | null;
  /**
   *
   * @type {CourtReferenceCommon}
   * @memberof EnforcementOverviewDefendantAccount
   */
  enforcement_court: CourtReferenceCommon;
}
