/**
 * Auto-generated from OpenAPI specification
 * Do not edit manually - regenerate using 'yarn generate:openapi'
 */

import type { LanguagePreferenceCommonLanguageCodeEnum } from '../../types/opal-fines-language-preference-common-language-code-enum.type';

export interface LanguagePreferenceCommon {
  /**
   *
   * @type {string}
   * @memberof LanguagePreferenceCommon
   */
  language_code: (typeof LanguagePreferenceCommonLanguageCodeEnum)[keyof typeof LanguagePreferenceCommonLanguageCodeEnum];
}
