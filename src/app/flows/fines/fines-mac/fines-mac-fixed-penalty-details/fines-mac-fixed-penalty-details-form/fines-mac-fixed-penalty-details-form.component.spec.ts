import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesMacFixedPenaltyDetailsFormComponent } from './fines-mac-fixed-penalty-details-form.component';
import { FINES_MAC_FIXED_PENALTY_DETAILS_FORM_MOCK } from '../mocks/fines-mac-fixed-penalty-details-form.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacOffenceDetailsService } from '../../fines-mac-offence-details/services/fines-mac-offence-details.service';
import { OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-autocomplete-items.mock';
import { FormControl, Validators } from '@angular/forms';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../../fines-mac-offence-details/constants/fines-mac-offence-details-default-values.constant';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { FINES_MAC_FIXED_PENALTY_DETAILS_FORM_VALIDATORS } from '../validators/fines-mac-fixed-penalty-details-form-validators';
import { OPAL_FINES_ISSUING_AUTHORITY_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-issuing-authority-autocomplete-items.mock';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesMacFixedPenaltyFormComponent', () => {
  let component: FinesMacFixedPenaltyDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacFixedPenaltyDetailsFormComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockTransformationService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any; // Replace with actual service type if available
  let finesMacStore: FinesMacStoreType;
  let originalConfigureDatePicker: () => void;
  let originalInitOuterRadios: () => void;

  beforeAll(() => {
    originalConfigureDatePicker = MojDatePickerComponent.prototype.configureDatePicker;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(MojDatePickerComponent.prototype, 'configureDatePicker').mockImplementation(() => {});
    originalInitOuterRadios = GovukRadioComponent.prototype['initOuterRadios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(GovukRadioComponent.prototype, 'initOuterRadios').mockImplementation(() => {});
  });

  afterAll(() => {
    MojDatePickerComponent.prototype.configureDatePicker = originalConfigureDatePicker;
    GovukRadioComponent.prototype['initOuterRadios'] = originalInitOuterRadios;
  });

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
    mockDateService = createSpyObj(DateService, ['isValidDate', 'calculateAge', 'getPreviousDate', 'getAgeObject']);
    mockOpalFinesService = createSpyObj(OpalFines, ['getOffenceByCjsCode']);
    mockTransformationService = createSpyObj(TransformationService, ['replaceKeys']);

    await TestBed.configureTestingModule({
      imports: [FinesMacFixedPenaltyDetailsFormComponent],
      providers: [
        {
          provide: FinesMacOffenceDetailsService,
          useClass: FinesMacOffenceDetailsService,
        },
        {
          provide: UtilsService,
          useClass: UtilsService,
        },
        {
          provide: OpalFines,
          useValue: mockOpalFinesService,
        },
        {
          provide: TransformationService,
          useValue: mockTransformationService,
        },
        {
          provide: FinesMacStore,
          useClass: FinesMacStore,
        },
        { provide: DateService, useValue: mockDateService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacFixedPenaltyDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.enforcingCourtAutoCompleteItems = OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK;
    component.issuingAuthorityAutoCompleteItems = OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with the correct controls', () => {
    component['setupFixedPenaltyDetailsForm']();
    Object.keys(FINES_MAC_FIXED_PENALTY_DETAILS_FORM_MOCK.formData).forEach((key) => {
      expect(component.form.contains(key)).toBe(true);
    });
  });

  it('should add validators to the form controls', () => {
    component['setupFixedPenaltyDetailsForm']();
    component['offenceTypeListener']();
    component.form.get('fm_fp_offence_details_offence_type')?.setValue('vehicle');

    expect(
      component.form.get('fm_fp_offence_details_vehicle_registration_number')?.hasValidator(Validators.required),
    ).toBe(true);
    expect(component.form.get('fm_fp_offence_details_driving_licence_number')?.hasValidator(Validators.required)).toBe(
      true,
    );
  });

  it('should remove validators from the form controls', () => {
    component['setupFixedPenaltyDetailsForm']();
    component['offenceTypeListener']();
    component.form.get('fm_fp_offence_details_offence_type')?.setValue('non-vehicle');

    expect(
      component.form.get('fm_fp_offence_details_vehicle_registration_number')?.hasValidator(Validators.required),
    ).toBe(false);
    expect(component.form.get('fm_fp_offence_details_driving_licence_number')?.hasValidator(Validators.required)).toBe(
      false,
    );
    expect(component.form.get('fm_fp_offence_details_vehicle_registration_number')?.disabled).toBe(true);
    expect(component.form.get('fm_fp_offence_details_driving_licence_number')?.disabled).toBe(true);
  });

  it('should toggle the vehicle conditional panel and controls', async () => {
    await fixture.whenStable();
    const conditional = fixture.nativeElement.querySelector(`#${component.vehicleOffenceConditionalId}`);
    expect(conditional.classList.contains('govuk-radios__conditional--hidden')).toBe(true);

    const vehicleInput = fixture.nativeElement.querySelector(
      `input[aria-controls="${component.vehicleOffenceConditionalId}"]`,
    );
    vehicleInput.click();
    fixture.detectChanges();

    expect(component.form.get('fm_fp_offence_details_vehicle_registration_number')?.enabled).toBe(true);
    expect(component.form.get('fm_fp_offence_details_driving_licence_number')?.enabled).toBe(true);
  });

  it('should listen to changes in the dob and update the dateObject', () => {
    mockDateService.getAgeObject.mockReturnValue({ value: 46, group: 'Adult' });
    component['setupFixedPenaltyDetailsForm']();
    component['dateOfBirthListener']();
    const dobControl = component.form.controls['fm_fp_personal_details_dob'];
    dobControl?.setValue('01-01-1979');

    expect(component.age).toEqual({ value: 46, group: 'Adult' });
  });

  it('should generate languageOptions from FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS', () => {
    const expectedOptions = [
      { key: 'CY', value: 'Welsh and English' },
      { key: 'EN', value: 'English only' },
    ];

    expect(component.languageOptions).toEqual(expectedOptions);
  });

  it('should perform the initial setup for the fixed penalty details form', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupFixedPenaltyDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'dateOfBirthListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'offenceTypeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupOffenceCodeListener');

    component['initialFixedPenaltyDetailsSetup']();

    expect(component['transformationService']['replaceKeys']).toHaveBeenCalled();
    expect(component['setupFixedPenaltyDetailsForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalled();
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(component['offenceTypeListener']).toHaveBeenCalled();
    expect(component['setupOffenceCodeListener']).toHaveBeenCalled();
  });

  it('should update offenceCode$ and selectedOffenceConfirmation when callbacks are invoked', () => {
    vi.useFakeTimers();
    mockOpalFinesService.getOffenceByCjsCode.mockReturnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK));

    component['setupFixedPenaltyDetailsForm']();
    component.form.addControl('fm_fp_offence_details_offence_id', new FormControl(''));
    component.form.addControl('fm_fp_offence_details_offence_cjs_code', new FormControl(''));

    // Act
    component['setupOffenceCodeListener']();

    component.form.get('fm_fp_offence_details_offence_cjs_code')?.setValue('AK123456');

    vi.advanceTimersByTime(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

    // Assert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any;
    component.offenceCode$.subscribe((v) => (value = v));
    expect(value).toEqual(OPAL_FINES_OFFENCES_REF_DATA_MOCK);
    expect(component.selectedOffenceConfirmation).toBe(true);
    vi.useRealTimers();
  });

  it('should set offenceCodeValidationPending immediately when lookup-length offence code changes', () => {
    vi.useFakeTimers();
    component['setupFixedPenaltyDetailsForm']();
    component['setupOffenceCodeListener']();
    component.form.get('fm_fp_offence_details_offence_id')?.setValue(314441);

    component.form.get('fm_fp_offence_details_offence_cjs_code')?.setValue('AK12345');

    expect(component.form.get('fm_fp_offence_details_offence_id')?.value).toBeNull();
    expect(component.form.get('fm_fp_offence_details_offence_cjs_code')?.errors).toEqual({
      offenceCodeValidationPending: true,
    });
    vi.useRealTimers();
  });

  it('should set initial value if dob value already exists', () => {
    component['setupFixedPenaltyDetailsForm']();
    component.form.get('fm_fp_personal_details_dob')?.setValue('01-01-1979');
    component['dateOfBirthListener']();
    expect(component.form.get('fm_fp_personal_details_dob')?.value).toBe('01-01-1979');
  });

  it('should add validators to the specified form control', () => {
    // Arrange
    component['setupFixedPenaltyDetailsForm']();
    const controlName =
      'fm_fp_offence_details_notice_number' as keyof typeof FINES_MAC_FIXED_PENALTY_DETAILS_FORM_VALIDATORS;
    const control = component.form.controls[controlName];

    // Precondition: Remove validators to ensure the test is valid
    control.clearValidators();
    control.updateValueAndValidity();

    expect(control.validator).toBeNull();

    // Act
    component['addValidatorsToControl'](controlName);

    // Assert
    expect(control.validator).toBeDefined();
  });

  it('should do nothing if control does not exist when trying to add validators', () => {
    // Arrange
    const controlName = 'non_existent_control' as keyof typeof FINES_MAC_FIXED_PENALTY_DETAILS_FORM_VALIDATORS;

    // Act & Assert (should not throw)
    expect(() => component['addValidatorsToControl'](controlName)).not.toThrow();
  });

  it('should set validators to the correct fields when defendant type is adult or youth only', () => {
    // Arrange
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    const personalDetailsAddressLine1Control = component.form.get('fm_fp_personal_details_address_line_1');
    const companyDetailsAddressLine1Control = component.form.get('fm_fp_company_details_address_line_1');
    personalDetailsAddressLine1Control?.clearValidators();
    personalDetailsAddressLine1Control?.updateValueAndValidity();
    companyDetailsAddressLine1Control?.clearValidators();
    companyDetailsAddressLine1Control?.updateValueAndValidity();

    // Act
    component['setValidators']();

    // Assert
    expect(personalDetailsAddressLine1Control?.hasValidator(Validators.required)).toBe(true);
    expect(companyDetailsAddressLine1Control?.hasValidator(Validators.required)).toBe(false);
  });

  it('should set validators to the correct fields when defendant type is company', () => {
    // Arrange
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;
    const personalDetailsAddressLine1Control = component.form.get('fm_fp_personal_details_address_line_1');
    const companyDetailsAddressLine1Control = component.form.get('fm_fp_company_details_address_line_1');
    personalDetailsAddressLine1Control?.clearValidators();
    personalDetailsAddressLine1Control?.updateValueAndValidity();
    companyDetailsAddressLine1Control?.clearValidators();
    companyDetailsAddressLine1Control?.updateValueAndValidity();

    // Act
    component['setValidators']();

    // Assert
    expect(personalDetailsAddressLine1Control?.hasValidator(Validators.required)).toBe(false);
    expect(companyDetailsAddressLine1Control?.hasValidator(Validators.required)).toBe(true);
  });

  it('should set prosecutor name when handleFormSubmit is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setProsecutorName');
    const event = new SubmitEvent('submit');
    component.handleFormSubmit(event);
    expect(component['setProsecutorName']).toHaveBeenCalled();
  });

  it('should get prosecutor from supplied ID', () => {
    const prosecutorId = '4821';
    const expectedProsecutor = {
      value: '4821',
      name: 'Crown Prosecution Service (CPS)',
    };
    component.issuingAuthorityAutoCompleteItems = [expectedProsecutor];

    const result = component['getProsecutorFromId'](prosecutorId);
    expect(result).toEqual(expectedProsecutor);
  });

  it('should return null if no prosecutor found for the given ID', () => {
    const prosecutorId = '9999'; // Non-existent ID
    component.issuingAuthorityAutoCompleteItems = OPAL_FINES_ISSUING_AUTHORITY_AUTOCOMPLETE_ITEMS_MOCK;

    const result = component['getProsecutorFromId'](prosecutorId);
    expect(result).toBeNull();
  });

  it('should set the prosecutor name in the form control', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutorFromId').mockReturnValue({
      value: '101',
      name: 'Police force',
    });
    component.form.controls['fm_fp_court_details_originator_id'].setValue('101');
    component.issuingAuthorityAutoCompleteItems = OPAL_FINES_ISSUING_AUTHORITY_AUTOCOMPLETE_ITEMS_MOCK;

    // Call the method to set the prosecutor name
    component['setProsecutorName']();

    expect(component.form.get('fm_fp_court_details_originator_name')?.value).toBe('Police force');
  });

  it('should clear the prosecutor name in the form control if the prosecutor is not found', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutorFromId').mockReturnValue(null);
    component.form.controls['fm_fp_court_details_originator_id'].setValue('101');
    component.issuingAuthorityAutoCompleteItems = OPAL_FINES_ISSUING_AUTHORITY_AUTOCOMPLETE_ITEMS_MOCK;

    // Call the method to set the prosecutor name
    component['setProsecutorName']();

    expect(component.form.get('fm_fp_court_details_originator_name')?.value).toBe('');
  });

  it('should clear the prosecutor name in the form control if the prosecutor id is not set', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getProsecutorFromId').mockReturnValue(null);
    component.form.controls['fm_fp_court_details_originator_id'].setValue(null);
    component.issuingAuthorityAutoCompleteItems = OPAL_FINES_ISSUING_AUTHORITY_AUTOCOMPLETE_ITEMS_MOCK;

    // Call the method to set the prosecutor name
    component['setProsecutorName']();

    expect(component.form.get('fm_fp_court_details_originator_name')?.value).toBe('');
  });
});
