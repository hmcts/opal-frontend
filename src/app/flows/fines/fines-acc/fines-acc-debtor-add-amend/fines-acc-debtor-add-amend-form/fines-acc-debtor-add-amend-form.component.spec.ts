import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccDebtorAddAmendFormComponent } from './fines-acc-debtor-add-amend-form.component';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import {
  MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA,
  MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA_WITH_ALIASES,
} from '../mocks/fines-acc-debtor-add-amend-form.mock';

describe('FinesAccDebtorAddAmendFormComponent', () => {
  let component: FinesAccDebtorAddAmendFormComponent;
  let fixture: ComponentFixture<FinesAccDebtorAddAmendFormComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesAccountStore: any;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj('DateService', [
      'isValidDate',
      'calculateAge',
      'getPreviousDate',
      'getAgeObject',
    ]);

    mockFinesAccountStore = jasmine.createSpyObj('FinesAccountStore', [], {
      welsh_speaking: signal('N'),
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesAccDebtorAddAmendFormComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: FinesAccountStore, useValue: mockFinesAccountStore },
        { provide: ActivatedRoute, useValue: { data: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDebtorAddAmendFormComponent);
    component = fixture.componentInstance;

    mockDateService.getPreviousDate.and.returnValue('2024-01-01');
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(25);
    mockDateService.getAgeObject.and.returnValue({ value: 25, group: 'Adult' });
  });

  it('should create', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values when no initial data provided', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    expect(component.form).toBeDefined();
    expect(component.form.get('facc_debtor_add_amend_title')?.value).toBeNull();
    expect(component.form.get('facc_debtor_add_amend_forenames')?.value).toBeNull();
    expect(component.form.get('facc_debtor_add_amend_surname')?.value).toBeNull();
  });

  it('should initialize form with provided initial data', () => {
    component.partyType = 'INDIVIDUAL';
    component.initialFormData = MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA;
    fixture.detectChanges();

    expect(component.form.get('facc_debtor_add_amend_title')?.value).toBe('Mr');
    expect(component.form.get('facc_debtor_add_amend_forenames')?.value).toBe('John');
    expect(component.form.get('facc_debtor_add_amend_surname')?.value).toBe('Doe');
    expect(component.form.get('facc_debtor_add_amend_address_line_1')?.value).toBe('123 Test Street');
    expect(component.form.get('facc_debtor_add_amend_national_insurance_number')?.value).toBe('AB123456C');
    expect(component.form.get('facc_debtor_add_amend_dob')?.value).toBe('1990-01-01');
  });

  it('should populate National Insurance number and other fields correctly', () => {
    component.partyType = 'INDIVIDUAL';
    component.initialFormData = MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA;
    fixture.detectChanges();

    expect(component.form.get('facc_debtor_add_amend_national_insurance_number')?.value).toBe('AB123456C');
    expect(component.form.get('facc_debtor_add_amend_contact_email_address_1')?.value).toBe('john@example.com');
    expect(component.form.get('facc_debtor_add_amend_contact_telephone_number_mobile')?.value).toBe('07123456789');
    expect(component.form.get('facc_debtor_add_amend_vehicle_make')?.value).toBe('Toyota Corolla');
    expect(component.form.get('facc_debtor_add_amend_vehicle_registration_mark')?.value).toBe('ABC123');
    expect(component.form.get('facc_debtor_add_amend_post_code')?.value).toBe('TE5T 1NG');
  });

  it('should set yesterday date on initialization', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBe('2024-01-01');
  });

  it('should show language preferences when welsh_speaking is Y', () => {
    mockFinesAccountStore.welsh_speaking.set('Y');
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    expect(component['showLanguagePreferences']()).toBe(true);
  });

  it('should hide language preferences when welsh_speaking is N', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    expect(component['showLanguagePreferences']()).toBe(false);
  });

  it('should hide language preferences when welsh_speaking is undefined', () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFinesAccountStore.welsh_speaking.set(undefined as any);
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    expect(component['showLanguagePreferences']()).toBe(false);
  });

  it('should calculate age when valid date of birth is provided', () => {
    mockDateService.getAgeObject.and.returnValue({ value: 30, group: 'Adult' });
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const dobControl = component.form.get('facc_debtor_add_amend_dob');
    dobControl?.setValue('1994-01-01');

    expect(mockDateService.getAgeObject).toHaveBeenCalledWith('1994-01-01');
    expect(component.age).toBe(30);
    expect(component.ageLabel).toBe('Adult');
  });

  it('should set ageLabel to "Youth" for age under 18', () => {
    mockDateService.getAgeObject.and.returnValue({ value: 16, group: 'Youth' });
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const dobControl = component.form.get('facc_debtor_add_amend_dob');
    dobControl?.setValue('2008-01-01');

    expect(component.age).toBe(16);
    expect(component.ageLabel).toBe('Youth');
  });

  it('should not calculate age for invalid date', () => {
    mockDateService.getAgeObject.and.returnValue(null);
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const dobControl = component.form.get('facc_debtor_add_amend_dob');
    dobControl?.setValue('invalid-date');

    expect(mockDateService.getAgeObject).toHaveBeenCalledWith('invalid-date');
  });

  it('should require title field', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const titleControl = component.form.get('facc_debtor_add_amend_title');
    expect(titleControl?.hasError('required')).toBe(true);

    titleControl?.setValue('Mr');
    expect(titleControl?.hasError('required')).toBe(false);
  });

  it('should require forenames field with max length validation', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const forenamesControl = component.form.get('facc_debtor_add_amend_forenames');
    expect(forenamesControl?.hasError('required')).toBe(true);

    forenamesControl?.setValue('John');
    expect(forenamesControl?.hasError('required')).toBe(false);

    forenamesControl?.setValue('a'.repeat(21));
    expect(forenamesControl?.hasError('maxlength')).toBe(true);
  });

  it('should require surname field with max length validation', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const surnameControl = component.form.get('facc_debtor_add_amend_surname');
    expect(surnameControl?.hasError('required')).toBe(true);

    surnameControl?.setValue('Doe');
    expect(surnameControl?.hasError('required')).toBe(false);

    surnameControl?.setValue('a'.repeat(31));
    expect(surnameControl?.hasError('maxlength')).toBe(true);
  });

  it('should require address line 1', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const addressControl = component.form.get('facc_debtor_add_amend_address_line_1');
    expect(addressControl?.hasError('required')).toBe(true);

    addressControl?.setValue('123 Test Street');
    expect(addressControl?.hasError('required')).toBe(false);
  });

  it('should validate email addresses', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const emailControl = component.form.get('facc_debtor_add_amend_contact_email_address_1');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('emailPattern')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('emailPattern')).toBe(false);
  });

  it('should populate existing aliases on initialization', () => {
    component.partyType = 'INDIVIDUAL';
    component.initialFormData = MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA_WITH_ALIASES;
    fixture.detectChanges();

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aliasArray = component.form.get('facc_debtor_add_amend_aliases') as any;
    expect(aliasArray.length).toBe(1);

    const addAliasControl = component.form.get('facc_debtor_add_amend_add_alias');
    expect(addAliasControl?.value).toBe(true);
  });

  it('should have alias FormArray defined', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const aliasFormArray = component.form.get('facc_debtor_add_amend_aliases');
    expect(aliasFormArray).toBeDefined();
  });

  it('should have form submission functionality', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    spyOn(component['formSubmit'], 'emit');

    component.form.patchValue({
      facc_debtor_add_amend_title: 'Mr',
      facc_debtor_add_amend_forenames: 'John',
      facc_debtor_add_amend_surname: 'Doe',
      facc_debtor_add_amend_address_line_1: '123 Test Street',
    });

    expect(component.form.valid).toBe(true);
    expect(component['formSubmit']).toBeDefined();
  });

  it('should have correct readonly properties', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    expect(component.titleOptions).toBeDefined();
    expect(component.partyTypes).toBeDefined();
    expect(component.languageOptions).toBeDefined();
    expect(component['finesAccRoutingPaths']).toBeDefined();
  });

  it('should have language options derived from constants', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    expect(Array.isArray(component.languageOptions)).toBe(true);
    expect(component.languageOptions.length).toBeGreaterThan(0);

    component.languageOptions.forEach((option) => {
      expect(option.key).toBeDefined();
      expect(option.value).toBeDefined();
    });
  });

  it('should populate form when valid formData is provided', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const mockFormData = {
      facc_debtor_add_amend_title: 'Mr',
      facc_debtor_add_amend_forenames: 'John',
      facc_debtor_add_amend_surname: 'Doe',
      facc_debtor_add_amend_address_line_1: '123 Test Street',
    };
    spyOn(component.form, 'patchValue').and.callThrough();

    component['rePopulateForm'](mockFormData);

    expect(component.form.patchValue).toHaveBeenCalledWith(mockFormData);
    expect(component.form.get('facc_debtor_add_amend_title')?.value).toBe('Mr');
    expect(component.form.get('facc_debtor_add_amend_forenames')?.value).toBe('John');
    expect(component.form.get('facc_debtor_add_amend_surname')?.value).toBe('DOE');
    expect(component.form.get('facc_debtor_add_amend_address_line_1')?.value).toBe('123 Test Street');
  });

  it('should handle formData with aliases by including them in form patch', () => {
    component.partyType = 'INDIVIDUAL';
    fixture.detectChanges();

    const mockFormData = {
      facc_debtor_add_amend_title: 'Mr',
      facc_debtor_add_amend_forenames: 'John',
      facc_debtor_add_amend_aliases: [{ facc_debtor_add_amend_alias_forenames_0: 'Johnny' }],
    };
    spyOn(component.form, 'patchValue').and.callThrough();

    component['rePopulateForm'](mockFormData);

    // Expect the form to be patched with all data including aliases
    expect(component.form.patchValue).toHaveBeenCalledWith(mockFormData);
    expect(component.form.get('facc_debtor_add_amend_title')?.value).toBe('Mr');
    expect(component.form.get('facc_debtor_add_amend_forenames')?.value).toBe('John');
  });
});
