import { Injectable, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../constants/release-feature-flags.constant';
import { type IFinesVehicleRegistrationConfig } from '../interfaces/fines-vehicle-registration-config.interface';
import { getFeatureFlagReleaseState } from './fines-section-permissions.utils';

@Injectable({ providedIn: 'root' })
export class FinesVehicleRegistrationConfigService {
  private readonly globalStore = inject(GlobalStore);

  public getConfig(registrationLabel: string, legacyMaxLength: number): IFinesVehicleRegistrationConfig {
    const isReleaseEnabled =
      getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true;
    const maxLength = isReleaseEnabled ? 7 : legacyMaxLength;
    const messageLength = isReleaseEnabled ? 7 : 11;

    return {
      maxLength,
      errorMessage: `${registrationLabel} must be ${messageLength} characters or fewer`,
    };
  }
}
