import { FormControl } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { beforeEach, describe, expect, it } from 'vitest';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../constants/release-feature-flags.constant';
import { FinesVehicleRegistrationConfigService } from './fines-vehicle-registration-config.service';

describe('FinesVehicleRegistrationConfigService', () => {
  let service: FinesVehicleRegistrationConfigService;
  let globalStore: InstanceType<typeof GlobalStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FinesVehicleRegistrationConfigService] });

    service = TestBed.inject(FinesVehicleRegistrationConfigService);
    globalStore = TestBed.inject(GlobalStore);
  });

  it('should validate the seven character limit and registration pattern when R1A-1-2 is enabled', () => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: true });
    const validator = service.getConfig('Registration number', 11).validator;

    expect(validator(new FormControl('AB#1234'))).toHaveProperty('alphanumericTextPattern');
    expect(validator(new FormControl('AB 1234'))).toBeNull();
    expect(validator(new FormControl('AB12345'))).toBeNull();
    expect(validator(new FormControl('AB123456'))).toHaveProperty('maxlength');
  });

  it('should preserve legacy length-only validation when R1A-1-2 is disabled', () => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: false });
    const validator = service.getConfig('Registration number', 11).validator;

    expect(validator(new FormControl('AB#1234'))).toBeNull();
    expect(validator(new FormControl('AB1234567890'))).toHaveProperty('maxlength');
  });

  it('should preserve legacy registration pattern validation when requested', () => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: false });
    const validator = service.getConfig('Registration number', 11, true).validator;

    expect(validator(new FormControl('AB#1234'))).toHaveProperty('alphanumericTextPattern');
    expect(validator(new FormControl('AB 1234'))).toBeNull();
  });
});
