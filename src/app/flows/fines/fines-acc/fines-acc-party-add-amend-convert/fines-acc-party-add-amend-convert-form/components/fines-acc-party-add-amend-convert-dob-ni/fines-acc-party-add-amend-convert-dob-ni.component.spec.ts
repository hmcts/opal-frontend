import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { FinesAccPartyAddAmendConvertDobNi } from './fines-acc-party-add-amend-convert-dob-ni.component';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccPartyAddAmendConvertDobNi', () => {
  let component: FinesAccPartyAddAmendConvertDobNi;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertDobNi>;
  let originalConfigureDatePicker: () => void;

  beforeAll(() => {
    originalConfigureDatePicker = MojDatePickerComponent.prototype.configureDatePicker;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(MojDatePickerComponent.prototype, 'configureDatePicker').mockImplementation(() => {});
  });

  afterAll(() => {
    MojDatePickerComponent.prototype.configureDatePicker = originalConfigureDatePicker;
  });

  beforeEach(() => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvertDobNi],
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

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertDobNi);
    component = fixture.componentInstance;

    // Set required inputs
    component.form = new FormGroup({
      facc_party_add_amend_convert_dob: new FormControl(''),
      facc_party_add_amend_convert_national_insurance_number: new FormControl(''),
    });
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
