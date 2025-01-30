import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPersonalDetailsFormComponent } from './fines-mac-personal-details-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { IFinesMacPersonalDetailsForm } from '../interfaces/fines-mac-personal-details-form.interface';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS } from '../constants/fines-mac-personal-details-alias';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../mocks/fines-mac-personal-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS as FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS } from '../constants/fines-mac-personal-details-vehicle-details-fields';
import { of } from 'rxjs';

describe('FinesMacPersonalDetailsFormComponent', () => {
  let component: FinesMacPersonalDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacPersonalDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockDateService: jasmine.SpyObj<DateService>;

  let formSubmit: IFinesMacPersonalDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockDateService = jasmine.createSpyObj(DateService, ['isValidDate', 'calculateAge', 'getPreviousDate']);

    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    formSubmit = { ...FINES_MAC_PERSONAL_DETAILS_FORM_MOCK };

    await TestBed.configureTestingModule({
      imports: [FinesMacPersonalDetailsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
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

    component.defendantType = 'adultOrYouthOnly';

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
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
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
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(34);

    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.isValidDate).toHaveBeenCalledWith(dateOfBirth);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
    const { formData: paymentTermsFormData } = mockFinesService.finesMacState.paymentTerms;
    expect(paymentTermsFormData['fm_payment_terms_has_days_in_default']).toBeFalsy();
    expect(paymentTermsFormData['fm_payment_terms_default_days_in_jail']).toBeNull();
    expect(paymentTermsFormData['fm_payment_terms_suspended_committal_date']).toBeNull();
  });

  it('should call dateOfBirthListener on DOB value changes Youth', () => {
    const dateOfBirth = '01/01/2014';
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(10);

    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(10);
    expect(component.ageLabel).toEqual('Youth');
    const { formData: paymentTermsFormData } = mockFinesService.finesMacState.paymentTerms;
    expect(paymentTermsFormData['fm_payment_terms_has_days_in_default']).toBeFalsy();
    expect(paymentTermsFormData['fm_payment_terms_default_days_in_jail']).toBeNull();
    expect(paymentTermsFormData['fm_payment_terms_suspended_committal_date']).toBeNull();
  });

  it('should call dateOfBirthListener on DOB value changes Adult', () => {
    const dateOfBirth = '01/01/1990';
    component.form.controls['fm_personal_details_dob'].setValue(dateOfBirth);
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(34);

    component['dateOfBirthListener']();

    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
    const { formData: paymentTermsFormData } = mockFinesService.finesMacState.paymentTerms;
    expect(paymentTermsFormData['fm_payment_terms_has_days_in_default']).toBeFalsy();
    expect(paymentTermsFormData['fm_payment_terms_default_days_in_jail']).toBeNull();
    expect(paymentTermsFormData['fm_payment_terms_suspended_committal_date']).toBeNull();
  });

  it('should call the necessary setup methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addVehicleDetailsControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.and.returnValue('19/08/2024');

    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    expect(component['addVehicleDetailsControls']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockFinesService.finesMacState.personalDetails.formData);
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
    spyOn<any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addVehicleDetailsControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.and.returnValue('19/08/2024');

    component.defendantType = 'parentOrGuardianToPay';
    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(mockFinesService.finesMacState.personalDetails.formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    expect(component['addVehicleDetailsControls']).not.toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockFinesService.finesMacState.personalDetails.formData);
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
