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

  private isReleaseEnabled(): boolean {
    return getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true;
  }

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
