/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { AccountStatusReferenceCommonAccountStatusCodeEnum } from '../../types/opal-fines-account-status-reference-common-account-status-code-enum.type';

export interface AccountStatusReferenceCommon {
  /**
   *
   * @type {string}
   * @memberof AccountStatusReferenceCommon
   */
  account_status_code: (typeof AccountStatusReferenceCommonAccountStatusCodeEnum)[keyof typeof AccountStatusReferenceCommonAccountStatusCodeEnum];
  /**
   *
   * @type {string}
   * @memberof AccountStatusReferenceCommon
   */
  account_status_display_name: string;
}
