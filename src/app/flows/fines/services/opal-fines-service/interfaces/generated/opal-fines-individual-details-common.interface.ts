/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { IndividualAliasCommon } from './opal-fines-individual-alias-common.interface';

export interface IndividualDetailsCommon {
  /**
   *
   * @type {string}
   * @memberof IndividualDetailsCommon
   */
  title: string | null;
  /**
   *
   * @type {string}
   * @memberof IndividualDetailsCommon
   */
  forenames: string | null;
  /**
   *
   * @type {string}
   * @memberof IndividualDetailsCommon
   */
  surname: string;
  /**
   *
   * @type {string}
   * @memberof IndividualDetailsCommon
   */
  date_of_birth: string | null;
  /**
   *
   * @type {string}
   * @memberof IndividualDetailsCommon
   */
  age: string | null;
  /**
   *
   * @type {string}
   * @memberof IndividualDetailsCommon
   */
  national_insurance_number: string | null;
  /**
   *
   * @type {Array<IndividualAliasCommon>}
   * @memberof IndividualDetailsCommon
   */
  individual_aliases: Array<IndividualAliasCommon> | null;
}
