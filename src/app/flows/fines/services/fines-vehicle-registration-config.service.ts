import { Injectable, inject } from '@angular/core';
import { type ValidatorFn } from '@angular/forms';
import { ALPHANUMERIC_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../constants/release-feature-flags.constant';
import { type IFinesVehicleRegistrationConfig } from '../interfaces/fines-vehicle-registration-config.interface';
import { getFeatureFlagReleaseState } from '../utils/fines-section-permissions.utils';

const RELEASE_MAX_LENGTH = 7;
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);

@Injectable({ providedIn: 'root' })
export class FinesVehicleRegistrationConfigService {
  private readonly globalStore = inject(GlobalStore);

  /** Returns whether the R1A-1-2 release flag is enabled. */
  private isReleaseEnabled(): boolean {
    return getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true;
  }

  /**
   * Builds a registration validator that switches between legacy and R1A-1-2 rules.
   * @param legacyMaxLength - Maximum registration length while R1A-1-2 is disabled.
   * @param validateLegacyPattern - Whether to retain the legacy pattern check when disabled; defaults to false.
   * @returns A validator using the rules for the current release flag state.
   */
  private createValidator(legacyMaxLength: number, validateLegacyPattern: boolean): ValidatorFn {
    const legacyValidator = optionalMaxLengthValidator(legacyMaxLength);
    const releaseValidator = optionalMaxLengthValidator(RELEASE_MAX_LENGTH);

    return (control) => {
      const isReleaseEnabled = this.isReleaseEnabled();

      if (!isReleaseEnabled) {
        const lengthError = legacyValidator(control);
        const legacyPatternError = validateLegacyPattern ? ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR(control) : null;

        return lengthError || legacyPatternError ? { ...lengthError, ...legacyPatternError } : null;
      }

      const lengthError = releaseValidator(control);
      const patternError = ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR(control);

      return lengthError || patternError ? { ...lengthError, ...patternError } : null;
    };
  }

  /**
   * Returns the registration length message and validator for the current release state.
   * @param registrationLabel - Field label used in the length error message.
   * @param legacyMaxLength - Maximum registration length while R1A-1-2 is disabled.
   * @param validateLegacyPattern - Whether to retain the legacy pattern check when disabled; defaults to false.
   * @returns The error message and feature-aware validator for the registration field.
   */
  public getConfig(
    registrationLabel: string,
    legacyMaxLength: number,
    validateLegacyPattern = false,
  ): IFinesVehicleRegistrationConfig {
    const isReleaseEnabled = this.isReleaseEnabled();
    const messageLength = isReleaseEnabled ? RELEASE_MAX_LENGTH : 11;

    return {
      errorMessage: `${registrationLabel} must be ${messageLength} characters or fewer`,
      validator: this.createValidator(legacyMaxLength, validateLegacyPattern),
    };
  }
}
