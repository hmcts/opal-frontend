import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccDebtorAddAmendFormComponent } from './fines-acc-debtor-add-amend-form.component';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IFinesAccDebtorAddAmendFormData } from '../interfaces/fines-acc-debtor-add-amend-form.interface';
import {
  MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA,
  MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA_WITH_ALIASES,
} from '../mocks/fines-acc-debtor-add-amend-form.mock';

describe('FinesAccDebtorAddAmendFormComponent', () => {
  let component: FinesAccDebtorAddAmendFormComponent;
  let fixture: ComponentFixture<FinesAccDebtorAddAmendFormComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockFinesAccountStore: any;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj('DateService', [
      'isValidDate',
      'calculateAge',
      'getPreviousDate',
      'getAgeObject',
    ]);

    // Create a mock store with signal methods
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
  });

  describe('Component Initialization', () => {
    beforeEach(() => {
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
    });

    it('should set yesterday date on initialization', () => {
      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();

      expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
      expect(component.yesterday).toBe('2024-01-01');
    });
  });

  describe('Language Preferences Computed Signal', () => {
    it('should show language preferences when welsh_speaking is Y', () => {
      // Update the signal to return 'Y'
      mockFinesAccountStore.welsh_speaking.set('Y');

      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();

      expect(component['showLanguagePreferences']()).toBe(true);
    });

    it('should hide language preferences when welsh_speaking is N', () => {
      // Signal already set to 'N' in beforeEach
      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();

      expect(component['showLanguagePreferences']()).toBe(false);
    });

    it('should hide language preferences when welsh_speaking is undefined', () => {
      mockFinesAccountStore.welsh_speaking.set(undefined as any);

      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();

      expect(component['showLanguagePreferences']()).toBe(false);
    });
  });

  describe('Date of Birth and Age Calculation', () => {
    beforeEach(() => {
      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();
    });

    it('should calculate age when valid date of birth is provided', () => {
      mockDateService.getAgeObject.and.returnValue({ value: 30, group: 'Adult' });

      const dobControl = component.form.get('facc_debtor_add_amend_dob');
      dobControl?.setValue('1994-01-01');

      expect(mockDateService.getAgeObject).toHaveBeenCalledWith('1994-01-01');
      expect(component.age).toBe(30);
      expect(component.ageLabel).toBe('Adult');
    });

    it('should set ageLabel to "Youth" for age under 18', () => {
      mockDateService.getAgeObject.and.returnValue({ value: 16, group: 'Youth' });

      const dobControl = component.form.get('facc_debtor_add_amend_dob');
      dobControl?.setValue('2008-01-01');

      expect(component.age).toBe(16);
      expect(component.ageLabel).toBe('Youth');
    });

    it('should not calculate age for invalid date', () => {
      mockDateService.getAgeObject.and.returnValue(null);

      const dobControl = component.form.get('facc_debtor_add_amend_dob');
      dobControl?.setValue('invalid-date');

      expect(mockDateService.getAgeObject).toHaveBeenCalledWith('invalid-date');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();
    });

    it('should require title field', () => {
      const titleControl = component.form.get('facc_debtor_add_amend_title');
      expect(titleControl?.hasError('required')).toBe(true);

      titleControl?.setValue('Mr');
      expect(titleControl?.hasError('required')).toBe(false);
    });

    it('should require forenames field with max length validation', () => {
      const forenamesControl = component.form.get('facc_debtor_add_amend_forenames');
      expect(forenamesControl?.hasError('required')).toBe(true);

      forenamesControl?.setValue('John');
      expect(forenamesControl?.hasError('required')).toBe(false);

      // Test max length (20 characters)
      forenamesControl?.setValue('a'.repeat(21));
      expect(forenamesControl?.hasError('maxlength')).toBe(true);
    });

    it('should require surname field with max length validation', () => {
      const surnameControl = component.form.get('facc_debtor_add_amend_surname');
      expect(surnameControl?.hasError('required')).toBe(true);

      surnameControl?.setValue('Doe');
      expect(surnameControl?.hasError('required')).toBe(false);

      // Test max length (30 characters)
      surnameControl?.setValue('a'.repeat(31));
      expect(surnameControl?.hasError('maxlength')).toBe(true);
    });

    it('should require address line 1', () => {
      const addressControl = component.form.get('facc_debtor_add_amend_address_line_1');
      expect(addressControl?.hasError('required')).toBe(true);

      addressControl?.setValue('123 Test Street');
      expect(addressControl?.hasError('required')).toBe(false);
    });

    it('should validate email addresses', () => {
      const emailControl = component.form.get('facc_debtor_add_amend_contact_email_address_1');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('emailPattern')).toBe(true);

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.hasError('emailPattern')).toBe(false);
    });
  });

  describe('Alias Management', () => {
    beforeEach(() => {
      component.partyType = 'INDIVIDUAL';
      component.initialFormData = MOCK_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA_WITH_ALIASES;
      fixture.detectChanges();
    });

    it('should populate existing aliases on initialization', () => {
      const aliasArray = component.form.get('facc_debtor_add_amend_aliases') as any;
      expect(aliasArray.length).toBe(1);

      const addAliasControl = component.form.get('facc_debtor_add_amend_add_alias');
      expect(addAliasControl?.value).toBe(true);
    });

    it('should have alias FormArray defined', () => {
      const aliasFormArray = component.form.get('facc_debtor_add_amend_aliases');
      expect(aliasFormArray).toBeDefined();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();
    });

    it('should have form submission functionality', () => {
      spyOn(component['formSubmit'], 'emit');

      // Fill required fields
      component.form.patchValue({
        facc_debtor_add_amend_title: 'Mr',
        facc_debtor_add_amend_forenames: 'John',
        facc_debtor_add_amend_surname: 'Doe',
        facc_debtor_add_amend_address_line_1: '123 Test Street',
      });

      expect(component.form.valid).toBe(true);
      expect(component['formSubmit']).toBeDefined();
    });
  });

  describe('Component Properties', () => {
    beforeEach(() => {
      component.partyType = 'INDIVIDUAL';
      fixture.detectChanges();
    });

    it('should have correct readonly properties', () => {
      expect(component.titleOptions).toBeDefined();
      expect(component.partyTypes).toBeDefined();
      expect(component.languageOptions).toBeDefined();
      expect(component['finesAccRoutingPaths']).toBeDefined();
    });

    it('should have language options derived from constants', () => {
      expect(Array.isArray(component.languageOptions)).toBe(true);
      expect(component.languageOptions.length).toBeGreaterThan(0);

      // Check structure
      component.languageOptions.forEach((option) => {
        expect(option.key).toBeDefined();
        expect(option.value).toBeDefined();
      });
    });
  });
});
