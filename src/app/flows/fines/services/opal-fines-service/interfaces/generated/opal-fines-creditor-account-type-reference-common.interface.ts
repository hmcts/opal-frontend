/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { CreditorAccountTypeReferenceCommonAccountTypeEnum } from '../../types/opal-fines-creditor-account-type-reference-common-account-type-enum.type';
import type { CreditorAccountTypeReferenceCommonDisplayNameEnum } from '../../types/opal-fines-creditor-account-type-reference-common-display-name-enum.type';

export interface CreditorAccountTypeReferenceCommon {
  /**
   * DB Mapping - creditor_accounts.creditor_account_type
   * @type {string}
   * @memberof CreditorAccountTypeReferenceCommon
   */
  account_type:
    | (typeof CreditorAccountTypeReferenceCommonAccountTypeEnum)[keyof typeof CreditorAccountTypeReferenceCommonAccountTypeEnum]
    | null;
  /**
   * Converts the short hand code of creditor_accounts.creditor_account_type into a display name.
   * Mapping:
   *   'MN' becomes 'Minor Creditor'
   *   'MJ' becomes 'Major Creditor'
   *   'CF' becomes 'Central Fund'
   *
   * @type {string}
   * @memberof CreditorAccountTypeReferenceCommon
   */
  display_name:
    | (typeof CreditorAccountTypeReferenceCommonDisplayNameEnum)[keyof typeof CreditorAccountTypeReferenceCommonDisplayNameEnum]
    | null;
}
