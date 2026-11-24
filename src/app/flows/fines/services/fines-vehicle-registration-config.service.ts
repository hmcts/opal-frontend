import { Injectable, inject } from '@angular/core';
import { type ValidatorFn } from '@angular/forms';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../constants/release-feature-flags.constant';
import { type IFinesVehicleRegistrationConfig } from '../interfaces/fines-vehicle-registration-config.interface';
import { getFeatureFlagReleaseState } from '../utils/fines-section-permissions.utils';

const RELEASE_MAX_LENGTH = 7;

@Injectable({ providedIn: 'root' })
export class FinesVehicleRegistrationConfigService {
  private readonly globalStore = inject(GlobalStore);

  private isReleaseEnabled(): boolean {
    return getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true;
  }

  private createValidator(legacyMaxLength: number): ValidatorFn {
    const legacyValidator = optionalMaxLengthValidator(legacyMaxLength);
    const releaseValidator = optionalMaxLengthValidator(RELEASE_MAX_LENGTH);

    return (control) => {
      const isReleaseEnabled = this.isReleaseEnabled();
      const value = control.value;

      if (!isReleaseEnabled) return legacyValidator(control);
      if (typeof value !== 'string') return releaseValidator(control);

      // A stored VRM may contain one separator space, for example XY21 ABC.
      const length = /^\S+ \S+$/.test(value) ? value.length - 1 : value.length;
      return length > RELEASE_MAX_LENGTH
        ? { maxlength: { requiredLength: RELEASE_MAX_LENGTH, actualLength: length } }
        : null;
    };
  }

  public getConfig(registrationLabel: string, legacyMaxLength: number): IFinesVehicleRegistrationConfig {
    const isReleaseEnabled = this.isReleaseEnabled();
    const messageLength = isReleaseEnabled ? RELEASE_MAX_LENGTH : 11;

    return {
      errorMessage: `${registrationLabel} must be ${messageLength} characters or fewer`,
      validator: this.createValidator(legacyMaxLength),
    };
  }
}
