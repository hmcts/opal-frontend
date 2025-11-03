import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccPartyAddAmendConvertFormComponent } from './fines-acc-party-add-amend-convert-form.component';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import {
  MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA,
  MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA_WITH_ALIASES,
} from '../mocks/fines-acc-party-add-amend-convert-form.mock';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM } from '../constants/fines-acc-party-add-amend-convert-form.constant';

describe('FinesAccPartyAddAmendConvertFormComponent', () => {
  let component: FinesAccPartyAddAmendConvertFormComponent;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvertFormComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockFinesAccountStore: {
    welsh_speaking: ReturnType<typeof signal>;
    account_number: ReturnType<typeof signal>;
    party_name: ReturnType<typeof signal>;
  };

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj('DateService', [
      'isValidDate',
      'calculateAge',
      'getPreviousDate',
      'getAgeObject',
    ]);

    mockFinesAccountStore = jasmine.createSpyObj('FinesAccountStore', [], {
      welsh_speaking: signal('N'),
      account_number: signal('1234567890'),
      party_name: signal('Test Party Name'),
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesAccPartyAddAmendConvertFormComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: FinesAccountStore, useValue: mockFinesAccountStore },
        { provide: ActivatedRoute, useValue: { data: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvertFormComponent);
    component = fixture.componentInstance;

    mockDateService.getPreviousDate.and.returnValue('2024-01-01');
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(25);
    mockDateService.getAgeObject.and.returnValue({ value: 25, group: 'Adult' });
  });

  it('should create', () => {
    component.partyType = 'individual';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values when no initial data provided', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    expect(component.form).toBeDefined();
    expect(component.form.get('facc_party_add_amend_convert_title')?.value).toBeNull();
    expect(component.form.get('facc_party_add_amend_convert_forenames')?.value).toBeNull();
    expect(component.form.get('facc_party_add_amend_convert_surname')?.value).toBeNull();
  });

  it('should initialize form with provided initial data', () => {
    component.partyType = 'individual';
    component.initialFormData = MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA;
    fixture.detectChanges();

    expect(component.form.get('facc_party_add_amend_convert_title')?.value).toBe('Mr');
    expect(component.form.get('facc_party_add_amend_convert_forenames')?.value).toBe('John');
    expect(component.form.get('facc_party_add_amend_convert_surname')?.value).toBe('Doe');
    expect(component.form.get('facc_party_add_amend_convert_address_line_1')?.value).toBe('123 Test Street');
    expect(component.form.get('facc_party_add_amend_convert_national_insurance_number')?.value).toBe('AB123456C');
    expect(component.form.get('facc_party_add_amend_convert_dob')?.value).toBe('1990-01-01');
  });

  it('should set initialFormData to default constant when initialFormData is undefined', () => {
    component.partyType = 'individual';
    component.isDebtor = true;
    // Explicitly set initialFormData to undefined to test the fallback
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.initialFormData = undefined as any;
    fixture.detectChanges();

    // After ngOnInit, initialFormData should be set to the default constant
    expect(component.initialFormData).toBeDefined();
    expect(component.initialFormData).toEqual(FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM);
    expect(component.initialFormData.nestedFlow).toBe(false);
  });

  it('should populate National Insurance number and other fields correctly', () => {
    component.partyType = 'individual';
    component.initialFormData = MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA;
    fixture.detectChanges();

    expect(component.form.get('facc_party_add_amend_convert_national_insurance_number')?.value).toBe('AB123456C');
    expect(component.form.get('facc_party_add_amend_convert_contact_email_address_1')?.value).toBe('john@example.com');
    expect(component.form.get('facc_party_add_amend_convert_contact_telephone_number_mobile')?.value).toBe(
      '07123456789',
    );
    expect(component.form.get('facc_party_add_amend_convert_vehicle_make')?.value).toBe('Toyota Corolla');
    expect(component.form.get('facc_party_add_amend_convert_vehicle_registration_mark')?.value).toBe('ABC123');
    expect(component.form.get('facc_party_add_amend_convert_post_code')?.value).toBe('TE5T 1NG');
  });

  it('should set yesterday date on initialization', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBe('2024-01-01');
  });

  it('should show language preferences when welsh_speaking is Y', () => {
    mockFinesAccountStore.welsh_speaking.set('Y');
    component.partyType = 'individual';
    fixture.detectChanges();

    expect(component['showLanguagePreferences']()).toBe(true);
  });

  it('should hide language preferences when welsh_speaking is N', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    expect(component['showLanguagePreferences']()).toBe(false);
  });

  it('should hide language preferences when welsh_speaking is undefined', () => {
    mockFinesAccountStore.welsh_speaking.set(undefined);
    component.partyType = 'individual';
    fixture.detectChanges();

    expect(component['showLanguagePreferences']()).toBe(false);
  });

  it('should calculate age when valid date of birth is provided', () => {
    mockDateService.getAgeObject.and.returnValue({ value: 30, group: 'Adult' });
    component.partyType = 'individual';
    fixture.detectChanges();

    const dobControl = component.form.get('facc_party_add_amend_convert_dob');
    dobControl?.setValue('1994-01-01');

    expect(mockDateService.getAgeObject).toHaveBeenCalledWith('1994-01-01');
    expect(component.age).toBe(30);
    expect(component.ageLabel).toBe('Adult');
  });

  it('should set ageLabel to "Youth" for age under 18', () => {
    mockDateService.getAgeObject.and.returnValue({ value: 16, group: 'Youth' });
    component.partyType = 'individual';
    fixture.detectChanges();

    const dobControl = component.form.get('facc_party_add_amend_convert_dob');
    dobControl?.setValue('2008-01-01');

    expect(component.age).toBe(16);
    expect(component.ageLabel).toBe('Youth');
  });

  it('should not calculate age for invalid date', () => {
    mockDateService.getAgeObject.and.returnValue(null);
    component.partyType = 'individual';
    fixture.detectChanges();

    const dobControl = component.form.get('facc_party_add_amend_convert_dob');
    dobControl?.setValue('invalid-date');

    expect(mockDateService.getAgeObject).toHaveBeenCalledWith('invalid-date');
  });

  it('should not set up dateOfBirthListener for company party type', () => {
    component.partyType = 'company';
    fixture.detectChanges();

    mockDateService.getAgeObject.calls.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['dateOfBirthListener']();
    expect(mockDateService.getAgeObject).not.toHaveBeenCalled();
  });

  it('should handle missing DOB control gracefully', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    component.form.removeControl('facc_party_add_amend_convert_dob');
    mockDateService.getAgeObject.calls.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['dateOfBirthListener']();
    expect(mockDateService.getAgeObject).not.toHaveBeenCalled();
  });

  it('should require title field', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const titleControl = component.form.get('facc_party_add_amend_convert_title');
    // Ensure the control value is null/empty to trigger required validation
    titleControl?.setValue(null);
    titleControl?.markAsTouched();
    titleControl?.updateValueAndValidity();
    expect(titleControl?.hasError('required')).toBe(true);

    titleControl?.setValue('Mr');
    expect(titleControl?.hasError('required')).toBe(false);
  });

  it('should require forenames field with max length validation', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const forenamesControl = component.form.get('facc_party_add_amend_convert_forenames');
    // Ensure the control value is null/empty to trigger required validation
    forenamesControl?.setValue(null);
    forenamesControl?.markAsTouched();
    forenamesControl?.updateValueAndValidity();
    expect(forenamesControl?.hasError('required')).toBe(true);

    forenamesControl?.setValue('John');
    expect(forenamesControl?.hasError('required')).toBe(false);

    forenamesControl?.setValue('a'.repeat(21));
    expect(forenamesControl?.hasError('maxlength')).toBe(true);
  });

  it('should require surname field with max length validation', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const surnameControl = component.form.get('facc_party_add_amend_convert_surname');
    // Ensure the control value is null/empty to trigger required validation
    surnameControl?.setValue(null);
    surnameControl?.markAsTouched();
    surnameControl?.updateValueAndValidity();
    expect(surnameControl?.hasError('required')).toBe(true);

    surnameControl?.setValue('Doe');
    expect(surnameControl?.hasError('required')).toBe(false);

    surnameControl?.setValue('a'.repeat(31));
    expect(surnameControl?.hasError('maxlength')).toBe(true);
  });

  it('should require address line 1', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const addressControl = component.form.get('facc_party_add_amend_convert_address_line_1');
    expect(addressControl?.hasError('required')).toBe(true);

    addressControl?.setValue('123 Test Street');
    expect(addressControl?.hasError('required')).toBe(false);
  });

  it('should validate email addresses', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const emailControl = component.form.get('facc_party_add_amend_convert_contact_email_address_1');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('emailPattern')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('emailPattern')).toBe(false);
  });

  it('should populate existing aliases on initialization', () => {
    component.partyType = 'individual';
    component.initialFormData = MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA_WITH_ALIASES;
    fixture.detectChanges();

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['rePopulateForm'](component.initialFormData?.formData || null);

    const aliasArray = component.form.get('facc_party_add_amend_convert_individual_aliases') as FormArray;
    // The form sets up the correct number of alias controls based on the mock data
    expect(aliasArray.length).toBeGreaterThanOrEqual(1);

    const addAliasControl = component.form.get('facc_party_add_amend_convert_add_alias');
    expect(addAliasControl?.value).toBe(true);
  });

  it('should have alias FormArray defined', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const individualAliasFormArray = component.form.get('facc_party_add_amend_convert_individual_aliases');
    expect(individualAliasFormArray).toBeDefined();

    const organisationAliasFormArray = component.form.get('facc_party_add_amend_convert_organisation_aliases');
    expect(organisationAliasFormArray).toBeDefined();
  });

  it('should have form submission functionality', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    spyOn(component['formSubmit'], 'emit');

    component.form.patchValue({
      facc_party_add_amend_convert_title: 'Mr',
      facc_party_add_amend_convert_forenames: 'John',
      facc_party_add_amend_convert_surname: 'Doe',
      facc_party_add_amend_convert_address_line_1: '123 Test Street',
    });

    expect(component.form.valid).toBe(true);
    expect(component['formSubmit']).toBeDefined();
  });

  it('should have correct readonly properties', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    expect(component.titleOptions).toBeDefined();
    expect(component.partyTypes).toBeDefined();
    expect(component.languageOptions).toBeDefined();
    expect(component['finesAccRoutingPaths']).toBeDefined();
  });

  it('should have language options derived from constants', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    expect(Array.isArray(component.languageOptions)).toBe(true);
    expect(component.languageOptions.length).toBeGreaterThan(0);

    component.languageOptions.forEach((option) => {
      expect(option.key).toBeDefined();
      expect(option.value).toBeDefined();
    });
  });

  it('should populate form when valid formData is provided', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const mockFormData = {
      facc_party_add_amend_convert_title: 'Mr',
      facc_party_add_amend_convert_forenames: 'John',
      facc_party_add_amend_convert_surname: 'DOE',
      facc_party_add_amend_convert_address_line_1: '123 Test Street',
    };
    spyOn(component.form, 'patchValue').and.callThrough();

    component['rePopulateForm'](mockFormData);

    expect(component.form.patchValue).toHaveBeenCalledWith(mockFormData);
    expect(component.form.get('facc_party_add_amend_convert_title')?.value).toBe('Mr');
    expect(component.form.get('facc_party_add_amend_convert_forenames')?.value).toBe('John');
    expect(component.form.get('facc_party_add_amend_convert_surname')?.value).toBe('DOE');
    expect(component.form.get('facc_party_add_amend_convert_address_line_1')?.value).toBe('123 Test Street');
  });

  it('should handle formData with aliases by including them in form patch', () => {
    component.partyType = 'individual';
    fixture.detectChanges();

    const mockFormData = {
      facc_party_add_amend_convert_title: 'Mr',
      facc_party_add_amend_convert_forenames: 'John',
      facc_party_add_amend_convert_individual_aliases: [{ facc_party_add_amend_convert_alias_forenames_0: 'Johnny' }],
      facc_party_add_amend_convert_organisation_aliases: [],
    };
    spyOn(component.form, 'patchValue').and.callThrough();

    component['rePopulateForm'](mockFormData);

    // Expect the form to be patched with all data including aliases
    expect(component.form.patchValue).toHaveBeenCalledWith(mockFormData);
    expect(component.form.get('facc_party_add_amend_convert_title')?.value).toBe('Mr');
    expect(component.form.get('facc_party_add_amend_convert_forenames')?.value).toBe('John');
  });

  describe('Employer fields validation', () => {
    it('should not require employer company name and reference when no employer fields are filled', () => {
      component.partyType = 'individual';
      fixture.detectChanges();

      const companyNameControl = component.form.get('facc_party_add_amend_convert_employer_company_name');
      const referenceControl = component.form.get('facc_party_add_amend_convert_employer_reference');

      expect(companyNameControl?.valid).toBe(true);
      expect(referenceControl?.valid).toBe(true);
    });

    it('should require employer company name when employer email is provided but company name is empty', () => {
      component.partyType = 'individual';
      fixture.detectChanges();

      const emailControl = component.form.get('facc_party_add_amend_convert_employer_email_address');
      const companyNameControl = component.form.get('facc_party_add_amend_convert_employer_company_name');

      emailControl?.setValue('test@company.com');
      companyNameControl?.setValue('');

      expect(companyNameControl?.hasError('required')).toBe(true);
    });

    it('should require employer reference when employer telephone is provided but reference is empty', () => {
      component.partyType = 'individual';
      fixture.detectChanges();

      const telephoneControl = component.form.get('facc_party_add_amend_convert_employer_telephone_number');
      const referenceControl = component.form.get('facc_party_add_amend_convert_employer_reference');

      telephoneControl?.setValue('01234567890');
      referenceControl?.setValue('');

      expect(referenceControl?.hasError('required')).toBe(true);
    });

    it('should require both employer company name and reference when any employer address field is provided', () => {
      component.partyType = 'individual';
      fixture.detectChanges();

      const addressControl = component.form.get('facc_party_add_amend_convert_employer_address_line_1');
      const companyNameControl = component.form.get('facc_party_add_amend_convert_employer_company_name');
      const referenceControl = component.form.get('facc_party_add_amend_convert_employer_reference');

      addressControl?.setValue('123 Business Street');
      companyNameControl?.setValue('');
      referenceControl?.setValue('');

      expect(companyNameControl?.hasError('required')).toBe(true);
      expect(referenceControl?.hasError('required')).toBe(true);
    });

    it('should not show validation errors when both company name and reference are provided with other employer fields', () => {
      component.partyType = 'individual';
      fixture.detectChanges();

      const emailControl = component.form.get('facc_party_add_amend_convert_employer_email_address');
      const companyNameControl = component.form.get('facc_party_add_amend_convert_employer_company_name');
      const referenceControl = component.form.get('facc_party_add_amend_convert_employer_reference');

      emailControl?.setValue('test@company.com');
      companyNameControl?.setValue('Test Company Ltd');
      referenceControl?.setValue('EMP123');

      expect(companyNameControl?.hasError('required')).toBe(false);
      expect(referenceControl?.hasError('required')).toBe(false);
    });

    it('should trigger validation when employer post code is provided', () => {
      component.partyType = 'individual';
      fixture.detectChanges();

      const postCodeControl = component.form.get('facc_party_add_amend_convert_employer_post_code');
      const companyNameControl = component.form.get('facc_party_add_amend_convert_employer_company_name');
      const referenceControl = component.form.get('facc_party_add_amend_convert_employer_reference');

      postCodeControl?.setValue('SW1A 1AA');
      companyNameControl?.setValue('');
      referenceControl?.setValue('');

      expect(companyNameControl?.hasError('required')).toBe(true);
      expect(referenceControl?.hasError('required')).toBe(true);
    });

    it('should require employer address line 1 when other employer fields are provided but address line 1 is empty', () => {
      component.partyType = 'individual';
      fixture.detectChanges();

      const emailControl = component.form.get('facc_party_add_amend_convert_employer_email_address');
      const addressLine1Control = component.form.get('facc_party_add_amend_convert_employer_address_line_1');

      emailControl?.setValue('test@company.com');
      addressLine1Control?.setValue('');

      expect(addressLine1Control?.hasError('required')).toBe(true);
    });
  });

  describe('Company party type tests', () => {
    beforeEach(() => {
      component.partyType = 'company';
      fixture.detectChanges();
    });

    it('should require organisation_name for company party type', () => {
      const organisationNameControl = component.form.get('facc_party_add_amend_convert_organisation_name');

      organisationNameControl?.setValue('');
      organisationNameControl?.markAsTouched();

      expect(organisationNameControl?.hasError('required')).toBe(true);
      expect(organisationNameControl?.valid).toBe(false);
    });

    it('should accept valid organisation_name for company party type', () => {
      const organisationNameControl = component.form.get('facc_party_add_amend_convert_organisation_name');

      organisationNameControl?.setValue('Test Company Ltd');
      organisationNameControl?.markAsTouched();

      expect(organisationNameControl?.hasError('required')).toBe(false);
      expect(organisationNameControl?.valid).toBe(true);
    });

    it('should not have individual fields for company party type', () => {
      const titleControl = component.form.get('facc_party_add_amend_convert_title');
      const forenamesControl = component.form.get('facc_party_add_amend_convert_forenames');
      const surnameControl = component.form.get('facc_party_add_amend_convert_surname');

      expect(titleControl).toBeNull();
      expect(forenamesControl).toBeNull();
      expect(surnameControl).toBeNull();
    });

    it('should initialize organization aliases form array for company party type', () => {
      const organisationAliasesFormArray = component.form.get(
        'facc_party_add_amend_convert_organisation_aliases',
      ) as FormArray;

      expect(organisationAliasesFormArray).toBeDefined();
      expect(organisationAliasesFormArray.length).toBe(0);
    });

    it('should not have individual aliases form array for company party type', () => {
      const individualAliasesFormArray = component.form.get(
        'facc_party_add_amend_convert_individual_aliases',
      ) as FormArray;

      expect(individualAliasesFormArray).toBeNull();
    });

    it('should populate form with company data when valid formData is provided', () => {
      const mockFormData = {
        facc_party_add_amend_convert_organisation_name: 'Test Company Ltd',
        facc_party_add_amend_convert_address_line_1: '123 Business Park',
        facc_party_add_amend_convert_address_line_2: 'Suite 100',
        facc_party_add_amend_convert_address_line_3: 'Business District',
        facc_party_add_amend_convert_post_code: 'B12 3CD',
      };

      spyOn(component.form, 'patchValue').and.callThrough();

      component['rePopulateForm'](mockFormData);

      expect(component.form.patchValue).toHaveBeenCalledWith(mockFormData);
      expect(component.form.get('facc_party_add_amend_convert_organisation_name')?.value).toBe('Test Company Ltd');
      expect(component.form.get('facc_party_add_amend_convert_address_line_1')?.value).toBe('123 Business Park');
    });

    it('should handle formData with organization aliases for company party type', () => {
      const mockFormData = {
        facc_party_add_amend_convert_organisation_name: 'Main Company Ltd',
        facc_party_add_amend_convert_individual_aliases: [],
        facc_party_add_amend_convert_organisation_aliases: [
          { facc_party_add_amend_convert_alias_organisation_name_0: 'Alias Company Name' },
        ],
      };

      spyOn(component.form, 'patchValue').and.callThrough();

      component['rePopulateForm'](mockFormData);

      expect(component.form.patchValue).toHaveBeenCalledWith(mockFormData);
      expect(component.form.get('facc_party_add_amend_convert_organisation_name')?.value).toBe('Main Company Ltd');
    });

    it('should require address line 1 for company party type', () => {
      const addressLine1Control = component.form.get('facc_party_add_amend_convert_address_line_1');

      addressLine1Control?.setValue('');
      addressLine1Control?.markAsTouched();

      expect(addressLine1Control?.hasError('required')).toBe(true);
      expect(addressLine1Control?.valid).toBe(false);
    });

    it('should not require post code for company party type', () => {
      const postCodeControl = component.form.get('facc_party_add_amend_convert_post_code');

      postCodeControl?.setValue('');
      postCodeControl?.markAsTouched();

      expect(postCodeControl?.hasError('required')).toBe(false);
      expect(postCodeControl?.valid).toBe(true);
    });
    it('should have isCompanyPartyType getter return true for company party type', () => {
      expect(component.isCompanyPartyType).toBe(true);
    });

    it('should have isIndividualPartyType getter return false for company party type', () => {
      expect(component.isIndividualPartyType).toBe(false);
    });

    it('should validate form as invalid when required company fields are missing', () => {
      const organisationNameControl = component.form.get('facc_party_add_amend_convert_organisation_name');
      const addressLine1Control = component.form.get('facc_party_add_amend_convert_address_line_1');

      organisationNameControl?.setValue('');
      addressLine1Control?.setValue('');

      organisationNameControl?.markAsTouched();
      addressLine1Control?.markAsTouched();

      expect(component.form.invalid).toBe(true);
    });

    it('should validate form as valid when required company fields are provided', () => {
      const organisationNameControl = component.form.get('facc_party_add_amend_convert_organisation_name');
      const addressLine1Control = component.form.get('facc_party_add_amend_convert_address_line_1');

      organisationNameControl?.setValue('Test Company Ltd');
      addressLine1Control?.setValue('123 Business Street');

      expect(organisationNameControl?.valid).toBe(true);
      expect(addressLine1Control?.valid).toBe(true);
    });
  });

  describe('Parent/Guardian party type tests', () => {
    beforeEach(() => {
      component.partyType = 'parentGuardian';
      fixture.detectChanges();
    });

    it('should have isIndividualPartyType getter return true for parent/guardian party type', () => {
      expect(component.isIndividualPartyType).toBe(true);
    });

    it('should return correct heading text for parent/guardian party type', () => {
      expect(component.headingText).toBe('Parent or guardian details');
    });

    it('should have individual form controls for parent/guardian party type', () => {
      // Check individual fields exist
      expect(component.form.get('facc_party_add_amend_convert_title')).toBeDefined();
      expect(component.form.get('facc_party_add_amend_convert_forenames')).toBeDefined();
      expect(component.form.get('facc_party_add_amend_convert_surname')).toBeDefined();
      expect(component.form.get('facc_party_add_amend_convert_dob')).toBeDefined();
      expect(component.form.get('facc_party_add_amend_convert_individual_aliases')).toBeDefined();

      // Check company fields don't exist
      expect(component.form.get('facc_party_add_amend_convert_organisation_name')).toBeNull();
      expect(component.form.get('facc_party_add_amend_convert_organisation_aliases')).toBeNull();
    });

    it('should require title, forenames and surname for parent/guardian party type', () => {
      const titleControl = component.form.get('facc_party_add_amend_convert_title');
      const forenamesControl = component.form.get('facc_party_add_amend_convert_forenames');
      const surnameControl = component.form.get('facc_party_add_amend_convert_surname');

      expect(titleControl?.hasError('required')).toBe(true);
      expect(forenamesControl?.hasError('required')).toBe(true);
      expect(surnameControl?.hasError('required')).toBe(true);

      titleControl?.setValue('Mrs');
      forenamesControl?.setValue('Jane');
      surnameControl?.setValue('Smith');

      expect(titleControl?.hasError('required')).toBe(false);
      expect(forenamesControl?.hasError('required')).toBe(false);
      expect(surnameControl?.hasError('required')).toBe(false);
    });

    it('should use parent/guardian specific error messages', () => {
      // Call the setup method to ensure error messages are configured
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any)['setupPartySpecificErrorMessages']();

      const forenamesErrors = component.fieldErrors['facc_party_add_amend_convert_forenames'];
      const surnameErrors = component.fieldErrors['facc_party_add_amend_convert_surname'];

      expect(forenamesErrors?.['required']?.message).toBe('Enter parent or guardian first name(s)');
      expect(surnameErrors?.['required']?.message).toBe('Enter parent or guardian last name');
    });
  });

  it('should create base form group with shared fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();

    // Check shared fields exist
    expect(baseForm.get('facc_party_add_amend_convert_add_alias')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_address_line_1')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_address_line_2')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_address_line_3')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_post_code')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_contact_email_address_1')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_contact_email_address_2')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_contact_telephone_number_mobile')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_contact_telephone_number_home')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_contact_telephone_number_business')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_vehicle_make')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_vehicle_registration_mark')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_language_preferences_document_language')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_language_preferences_hearing_language')).toBeDefined();

    // Check individual-specific fields don't exist
    expect(baseForm.get('facc_party_add_amend_convert_title')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_forenames')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_surname')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_dob')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_individual_aliases')).toBeNull();

    // Check company-specific fields don't exist
    expect(baseForm.get('facc_party_add_amend_convert_organisation_name')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_organisation_aliases')).toBeNull();
  });

  it('should set required validation on address line 1', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();
    const addressLine1Control = baseForm.get('facc_party_add_amend_convert_address_line_1');

    expect(addressLine1Control?.hasError('required')).toBe(true);

    addressLine1Control?.setValue('123 Test Street');
    expect(addressLine1Control?.hasError('required')).toBe(false);
  });

  it('should add individual-specific form controls to base form', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['addIndividualFormControls'](baseForm);

    // Check individual fields exist
    expect(baseForm.get('facc_party_add_amend_convert_title')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_forenames')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_surname')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_dob')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_national_insurance_number')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_individual_aliases')).toBeDefined();

    // Check employer fields exist
    expect(baseForm.get('facc_party_add_amend_convert_employer_company_name')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_employer_reference')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_employer_email_address')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_employer_telephone_number')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_employer_address_line_1')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_employer_post_code')).toBeDefined();

    // Check company fields don't exist
    expect(baseForm.get('facc_party_add_amend_convert_organisation_name')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_organisation_aliases')).toBeNull();
  });

  it('should set required validation on individual fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['addIndividualFormControls'](baseForm);

    const titleControl = baseForm.get('facc_party_add_amend_convert_title');
    const forenamesControl = baseForm.get('facc_party_add_amend_convert_forenames');
    const surnameControl = baseForm.get('facc_party_add_amend_convert_surname');

    expect(titleControl?.hasError('required')).toBe(true);
    expect(forenamesControl?.hasError('required')).toBe(true);
    expect(surnameControl?.hasError('required')).toBe(true);

    titleControl?.setValue('Mr');
    forenamesControl?.setValue('John');
    surnameControl?.setValue('Doe');

    expect(titleControl?.hasError('required')).toBe(false);
    expect(forenamesControl?.hasError('required')).toBe(false);
    expect(surnameControl?.hasError('required')).toBe(false);
  });

  it('should initialize individual aliases as empty FormArray', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['addIndividualFormControls'](baseForm);

    const aliasesControl = baseForm.get('facc_party_add_amend_convert_individual_aliases') as FormArray;
    expect(aliasesControl).toBeDefined();
    expect(aliasesControl.length).toBe(0);
  });

  it('should add company-specific form controls to base form', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['addCompanyFormControls'](baseForm);

    // Check company fields exist
    expect(baseForm.get('facc_party_add_amend_convert_organisation_name')).toBeDefined();
    expect(baseForm.get('facc_party_add_amend_convert_organisation_aliases')).toBeDefined();

    // Check individual fields don't exist
    expect(baseForm.get('facc_party_add_amend_convert_title')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_forenames')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_surname')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_dob')).toBeNull();
    expect(baseForm.get('facc_party_add_amend_convert_individual_aliases')).toBeNull();
  });

  it('should set required validation on organisation name', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['addCompanyFormControls'](baseForm);

    const organisationNameControl = baseForm.get('facc_party_add_amend_convert_organisation_name');
    expect(organisationNameControl?.hasError('required')).toBe(true);

    organisationNameControl?.setValue('Test Company Ltd');
    expect(organisationNameControl?.hasError('required')).toBe(false);
  });

  it('should initialize organisation aliases as empty FormArray', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseForm = (component as any)['createBaseFormGroup']();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['addCompanyFormControls'](baseForm);

    const aliasesControl = baseForm.get('facc_party_add_amend_convert_organisation_aliases') as FormArray;
    expect(aliasesControl).toBeDefined();
    expect(aliasesControl.length).toBe(0);
  });

  it('should create form with individual controls for individual party type', () => {
    component.partyType = 'individual';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['setupPartyAddAmendConvertForm']();

    // Check base fields exist
    expect(component.form.get('facc_party_add_amend_convert_address_line_1')).toBeDefined();

    // Check individual fields exist
    expect(component.form.get('facc_party_add_amend_convert_title')).toBeDefined();
    expect(component.form.get('facc_party_add_amend_convert_forenames')).toBeDefined();
    expect(component.form.get('facc_party_add_amend_convert_individual_aliases')).toBeDefined();

    // Check company fields don't exist
    expect(component.form.get('facc_party_add_amend_convert_organisation_name')).toBeNull();
    expect(component.form.get('facc_party_add_amend_convert_organisation_aliases')).toBeNull();
  });

  it('should create form with company controls for company party type', () => {
    component.partyType = 'company';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['setupPartyAddAmendConvertForm']();

    // Check base fields exist
    expect(component.form.get('facc_party_add_amend_convert_address_line_1')).toBeDefined();

    // Check company fields exist
    expect(component.form.get('facc_party_add_amend_convert_organisation_name')).toBeDefined();
    expect(component.form.get('facc_party_add_amend_convert_organisation_aliases')).toBeDefined();

    // Check individual fields don't exist
    expect(component.form.get('facc_party_add_amend_convert_title')).toBeNull();
    expect(component.form.get('facc_party_add_amend_convert_forenames')).toBeNull();
    expect(component.form.get('facc_party_add_amend_convert_individual_aliases')).toBeNull();
  });
});
