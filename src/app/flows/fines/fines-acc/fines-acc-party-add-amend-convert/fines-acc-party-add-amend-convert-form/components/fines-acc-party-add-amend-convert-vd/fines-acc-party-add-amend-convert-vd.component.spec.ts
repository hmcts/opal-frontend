import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccPartyAddAmendConvertVd } from './fines-acc-party-add-amend-convert-vd.component';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../../../constants/release-feature-flags.constant';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesAccPartyAddAmendConvertVd', () => {
  let component: FinesAccPartyAddAmendConvertVd;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertVd>;
  let globalStore: InstanceType<typeof GlobalStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertVd],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertVd);
    component = fixture.componentInstance;
    globalStore = TestBed.inject(GlobalStore);

    // Set required inputs
    component.form = new FormGroup({
      facc_party_add_amend_convert_vehicle_make: new FormControl(''),
      facc_party_add_amend_convert_vehicle_registration_mark: new FormControl(''),
    });
    component.formControlErrorMessages = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report the R1A-1-2 feature flag as enabled', () => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: true });

    expect(component.release1a1_2Enabled()).toBe(true);
  });

  it('should report the R1A-1-2 feature flag as disabled', () => {
    globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: false });

    expect(component.release1a1_2Enabled()).toBe(false);
  });
});
