/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { AddressDetailsCommon } from './opal-fines-address-details-common.interface';

export interface EmployerDetailsCommon {
  /**
   *
   * @type {string}
   * @memberof EmployerDetailsCommon
   */
  employer_name: string | null;
  /**
   *
   * @type {string}
   * @memberof EmployerDetailsCommon
   */
  employer_reference: string | null;
  /**
   *
   * @type {string}
   * @memberof EmployerDetailsCommon
   */
  employer_email_address: string | null;
  /**
   *
   * @type {string}
   * @memberof EmployerDetailsCommon
   */
  employer_telephone_number: string | null;
  /**
   *
   * @type {AddressDetailsCommon}
   * @memberof EmployerDetailsCommon
   */
  employer_address: AddressDetailsCommon;
}
