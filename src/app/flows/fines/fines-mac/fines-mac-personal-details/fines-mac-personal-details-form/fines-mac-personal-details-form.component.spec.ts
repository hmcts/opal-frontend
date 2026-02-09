import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPersonalDetailsFormComponent } from './fines-mac-personal-details-form.component';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { IFinesMacPersonalDetailsForm } from '../interfaces/fines-mac-personal-details-form.interface';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS } from '../constants/fines-mac-personal-details-alias';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../mocks/fines-mac-personal-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS as FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS } from '../constants/fines-mac-personal-details-vehicle-details-fields';
import { of } from 'rxjs';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj';

describe('FinesMacPersonalDetailsFormComponent', () => {
  let component: FinesMacPersonalDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacPersonalDetailsFormComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;

  let formSubmit: IFinesMacPersonalDetailsForm;
  let finesMacStore: FinesMacStoreType;
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
    mockDateService = createSpyObj(DateService, ['isValidDate', 'calculateAge', 'getPreviousDate']);

    formSubmit = structuredClone(FINES_MAC_PERSONAL_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacPersonalDetailsFormComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacPersonalDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.form.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should set up the personal details form', () => {
    component['setupPersonalDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('fm_personal_details_title')).toBeTruthy();
    expect(component.form.get('fm_personal_details_forenames')).toBeTruthy();
    expect(component.form.get('fm_personal_details_surname')).toBeTruthy();
    expect(component.form.get('fm_personal_details_add_alias')).toBeTruthy();
    expect(component.form.get('fm_personal_details_aliases')).toBeTruthy();
    expect(component.form.get('fm_personal_details_dob')).toBeTruthy();
    expect(component.form.get('fm_personal_details_national_insurance_number')).toBeTruthy();
    expect(component.form.get('fm_personal_details_address_line_1')).toBeTruthy();
    expect(component.form.get('fm_personal_details_address_line_2')).toBeTruthy();
    expect(component.form.get('fm_personal_details_address_line_3')).toBeTruthy();
    expect(component.form.get('fm_personal_details_post_code')).toBeTruthy();
  });

  it('should set up the alias configuration for the personal details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(FINES_MAC_PERSONAL_DETAILS_ALIAS.map((item) => item.controlName));
    expect(component.aliasControlsValidation).toEqual(FINES_MAC_PERSONAL_DETAILS_ALIAS);
  });

  it('should call dateOfBirthListener on DOB value changes Adult', () => {
    const dateOfBirth = '01/01/1990';
    mockDateService.isValidDate.mockReturnValue(true);
    mockDateService.calculateAge.mockReturnValue(34);

    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.isValidDate).toHaveBeenCalledWith(dateOfBirth);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
    const { formData: paymentTermsFormData } = finesMacStore.paymentTerms();
    expect(paymentTermsFormData.fm_payment_terms_has_days_in_default).toBeFalsy();
    expect(paymentTermsFormData.fm_payment_terms_default_days_in_jail).toBeNull();
    expect(paymentTermsFormData.fm_payment_terms_suspended_committal_date).toBeNull();
  });

  it('should call dateOfBirthListener on DOB value changes Youth', () => {
    const dateOfBirth = '01/01/2014';
    mockDateService.isValidDate.mockReturnValue(true);
    mockDateService.calculateAge.mockReturnValue(10);

    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(10);
    expect(component.ageLabel).toEqual('Youth');
    const { formData: paymentTermsFormData } = finesMacStore.paymentTerms();
    expect(paymentTermsFormData.fm_payment_terms_has_days_in_default).toBeFalsy();
    expect(paymentTermsFormData.fm_payment_terms_default_days_in_jail).toBeNull();
    expect(paymentTermsFormData.fm_payment_terms_suspended_committal_date).toBeNull();
  });

  it('should call dateOfBirthListener on DOB value changes Adult', () => {
    const dateOfBirth = '01/01/1990';
    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);
    mockDateService.isValidDate.mockReturnValue(true);
    mockDateService.calculateAge.mockReturnValue(34);

    component['dateOfBirthListener']();

    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
    const { formData: paymentTermsFormData } = finesMacStore.paymentTerms();
    expect(paymentTermsFormData.fm_payment_terms_has_days_in_default).toBeFalsy();
    expect(paymentTermsFormData.fm_payment_terms_default_days_in_jail).toBeNull();
    expect(paymentTermsFormData.fm_payment_terms_suspended_committal_date).toBeNull();
  });

  it('should call the necessary setup methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'addVehicleDetailsControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.mockReturnValue('19/08/2024');

    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(finesMacStore.personalDetails().formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    expect(component['addVehicleDetailsControls']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.personalDetails().formData);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith(
      'fm_personal_details_add_alias',
      'fm_personal_details_aliases',
    );
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should call the necessary setup methods - parent/guardian', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'addVehicleDetailsControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.mockReturnValue('19/08/2024');

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.pgToPay;
    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(finesMacStore.personalDetails().formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    expect(component['addVehicleDetailsControls']).not.toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(finesMacStore.personalDetails().formData);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith(
      'fm_personal_details_add_alias',
      'fm_personal_details_aliases',
    );
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should add vehicle details controls', () => {
    component['addVehicleDetailsControls']();

    FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS.forEach((control) => {
      expect(component.form.get(control.controlName)).toBeTruthy();
    });
  });
});
