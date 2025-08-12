import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaSearchAccountFormMinorCreditorsComponent } from './fines-sa-search-account-form-minor-creditors.component';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

describe('FinesSaSearchAccountFormMinorCreditorsComponent', () => {
  let component: FinesSaSearchAccountFormMinorCreditorsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormMinorCreditorsComponent>;

  const createTestForm = () =>
    new FormGroup({
      fsa_search_account_minor_creditors_minor_creditor_type: new FormControl(''),
      fsa_search_account_minor_creditors_individual: new FormGroup({
        fsa_search_account_minor_creditors_first_names: new FormControl(''),
        fsa_search_account_minor_creditors_last_name: new FormControl(''),
      }),
      fsa_search_account_minor_creditors_company: new FormGroup({
        company_name: new FormControl(''),
      }),
    });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormMinorCreditorsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('minor-creditors'),
            parent: { url: of([{ path: 'search' }]) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormMinorCreditorsComponent);
    component = fixture.componentInstance;
    component.form = createTestForm();
    component.formControlErrorMessages = {} as IAbstractFormControlErrorMessage;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Getters', () => {
    it('should return individual form group', () => {
      const individualGroup = component.individualGroup;
      expect(individualGroup).toBeInstanceOf(FormGroup);
      expect(individualGroup.get('fsa_search_account_minor_creditors_first_names')).toBeTruthy();
      expect(individualGroup.get('fsa_search_account_minor_creditors_last_name')).toBeTruthy();
    });

    it('should return company form group', () => {
      const companyGroup = component.companyGroup;
      expect(companyGroup).toBeInstanceOf(FormGroup);
      expect(companyGroup.get('company_name')).toBeTruthy();
    });

    it('should return minor creditor types options', () => {
      expect(component.minorCreditorTypes).toEqual([
        { key: 'individual', value: 'Individual' },
        { key: 'company', value: 'Company' },
      ]);
    });
  });

  describe('Form Lifecycle', () => {
    it('should initialize form listeners on ngOnInit', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const setupSpy = spyOn<any>(component, 'setupMinorCreditorTypeListener');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conditionalSpy = spyOn<any>(component, 'setupConditionalLastNameValidation');

      component.ngOnInit();

      expect(setupSpy).toHaveBeenCalled();
      expect(conditionalSpy).toHaveBeenCalled();
    });
  });

  describe('Minor Creditor Type Validation', () => {
    it('should reset company group when individual is selected', () => {
      const companyGroup = component.companyGroup;
      const resetSpy = spyOn(companyGroup, 'reset');
      const pristineSpy = spyOn(companyGroup, 'markAsPristine');
      const untouchedSpy = spyOn(companyGroup, 'markAsUntouched');
      const validitySpy = spyOn(companyGroup, 'updateValueAndValidity');

      // Set initial company value
      companyGroup.get('company_name')?.setValue('Test Company');

      // Change to individual
      component['minorCreditorType'].setValue('individual');

      // Manually trigger the subscription for testing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).resetAndValidateFormGroup(companyGroup);

      expect(resetSpy).toHaveBeenCalledWith(undefined, { emitEvent: false });
      expect(pristineSpy).toHaveBeenCalled();
      expect(untouchedSpy).toHaveBeenCalled();
      expect(validitySpy).toHaveBeenCalledWith({ onlySelf: true, emitEvent: false });
    });

    it('should reset individual group when company is selected', () => {
      const individualGroup = component.individualGroup;
      const resetSpy = spyOn(individualGroup, 'reset');
      const pristineSpy = spyOn(individualGroup, 'markAsPristine');
      const untouchedSpy = spyOn(individualGroup, 'markAsUntouched');
      const validitySpy = spyOn(individualGroup, 'updateValueAndValidity');

      // Set initial individual values
      individualGroup.get('fsa_search_account_minor_creditors_first_names')?.setValue('John');
      individualGroup.get('fsa_search_account_minor_creditors_last_name')?.setValue('Doe');

      // Change to company
      component['minorCreditorType'].setValue('company');

      // Manually trigger the subscription for testing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).resetAndValidateFormGroup(individualGroup);

      expect(resetSpy).toHaveBeenCalledWith(undefined, { emitEvent: false });
      expect(pristineSpy).toHaveBeenCalled();
      expect(untouchedSpy).toHaveBeenCalled();
      expect(validitySpy).toHaveBeenCalledWith({ onlySelf: true, emitEvent: false });
    });
  });

  describe('Conditional Last Name Validation', () => {
    beforeEach(() => {
      component['minorCreditorType'].setValue('individual');
    });

    it('should add required validator to last name when first names is populated', () => {
      const firstNamesControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_first_names',
      ) as FormControl;
      const lastNameControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_last_name',
      ) as FormControl;

      // Set first names with value
      firstNamesControl.setValue('John');
      lastNameControl.setValue('');

      // Trigger validation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).handleLastNameConditionalValidation();

      expect(lastNameControl.hasValidator(Validators.required)).toBe(true);
    });

    it('should remove required validator from last name when first names is empty', () => {
      const firstNamesControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_first_names',
      ) as FormControl;
      const lastNameControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_last_name',
      ) as FormControl;

      // Add required validator first
      lastNameControl.addValidators(Validators.required);

      // Clear first names
      firstNamesControl.setValue('');
      lastNameControl.setValue('');

      // Trigger validation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).handleLastNameConditionalValidation();

      expect(lastNameControl.hasValidator(Validators.required)).toBe(false);
    });

    it('should not require last name when both first names and last name have values', () => {
      const firstNamesControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_first_names',
      ) as FormControl;
      const lastNameControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_last_name',
      ) as FormControl;

      // Set both values
      firstNamesControl.setValue('John');
      lastNameControl.setValue('Doe');

      // Trigger validation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).handleLastNameConditionalValidation();

      expect(lastNameControl.hasValidator(Validators.required)).toBe(false);
    });

    it('should handle whitespace-only values correctly', () => {
      const firstNamesControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_first_names',
      ) as FormControl;
      const lastNameControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_last_name',
      ) as FormControl;

      // Set first names with only whitespace
      firstNamesControl.setValue('   ');
      lastNameControl.setValue('');

      // Trigger validation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).handleLastNameConditionalValidation();

      expect(lastNameControl.hasValidator(Validators.required)).toBe(false);
    });

    it('should not apply validation when minor creditor type is not individual', () => {
      component['minorCreditorType'].setValue('company');

      const firstNamesControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_first_names',
      ) as FormControl;
      const lastNameControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_last_name',
      ) as FormControl;

      firstNamesControl.setValue('John');
      lastNameControl.setValue('');

      // Trigger validation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).handleLastNameConditionalValidation();

      expect(lastNameControl.hasValidator(Validators.required)).toBe(false);
    });
  });

  describe('Form Group Reset', () => {
    it('should properly reset form group with correct options', () => {
      const testGroup = new FormGroup({
        testField: new FormControl('test value'),
      });

      const resetSpy = spyOn(testGroup, 'reset');
      const pristineSpy = spyOn(testGroup, 'markAsPristine');
      const untouchedSpy = spyOn(testGroup, 'markAsUntouched');
      const validitySpy = spyOn(testGroup, 'updateValueAndValidity');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).resetAndValidateFormGroup(testGroup);

      expect(resetSpy).toHaveBeenCalledWith(undefined, { emitEvent: false });
      expect(pristineSpy).toHaveBeenCalled();
      expect(untouchedSpy).toHaveBeenCalled();
      expect(validitySpy).toHaveBeenCalledWith({ onlySelf: true, emitEvent: false });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing form controls gracefully', () => {
      // Create form without required controls
      const incompleteForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl('individual'),
      });

      component.form = incompleteForm;

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).handleLastNameConditionalValidation();
      }).not.toThrow();
    });

    it('should handle null values in form controls', () => {
      const firstNamesControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_first_names',
      ) as FormControl;
      const lastNameControl = component.individualGroup.get(
        'fsa_search_account_minor_creditors_last_name',
      ) as FormControl;

      component['minorCreditorType'].setValue('individual');
      firstNamesControl.setValue(null);
      lastNameControl.setValue(null);

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).handleLastNameConditionalValidation();
      }).not.toThrow();
    });

    it('should handle missing individual form controls gracefully', () => {
      // Create form with individual group but missing the required controls
      const incompleteForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl('individual'),
        fsa_search_account_minor_creditors_individual: new FormGroup({
          // Missing the required controls: first_names and last_name
          some_other_control: new FormControl('test'),
        }),
      });

      component.form = incompleteForm;

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).handleLastNameConditionalValidation();
      }).not.toThrow();
    });

    it('should handle missing first names control in setupConditionalLastNameValidation', () => {
      // Create form with individual group but missing the first_names control
      const incompleteForm = new FormGroup({
        fsa_search_account_minor_creditors_minor_creditor_type: new FormControl('individual'),
        fsa_search_account_minor_creditors_individual: new FormGroup({
          // Missing the first_names control
          fsa_search_account_minor_creditors_last_name: new FormControl(''),
        }),
      });

      component.form = incompleteForm;

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (component as any).setupConditionalLastNameValidation();
      }).not.toThrow();
    });
  });

  describe('setupMinorCreditorTypeListener', () => {
    it('should update typeControl validity when individualGroup changes and typeControl is dirty', () => {
      const typeControl = component['minorCreditorType'];
      const updateValiditySpy = spyOn(typeControl, 'updateValueAndValidity');

      // Make the typeControl dirty
      typeControl.markAsDirty();

      // Trigger the individual group value change
      component.individualGroup.get('fsa_search_account_minor_creditors_first_names')?.setValue('John');

      expect(updateValiditySpy).toHaveBeenCalledWith({ onlySelf: true, emitEvent: false });
    });

    it('should update typeControl validity when companyGroup changes and typeControl is dirty', () => {
      const typeControl = component['minorCreditorType'];
      const updateValiditySpy = spyOn(typeControl, 'updateValueAndValidity');

      // Make the typeControl dirty
      typeControl.markAsDirty();

      // Trigger the company group value change
      component.companyGroup.get('company_name')?.setValue('Test Company');

      expect(updateValiditySpy).toHaveBeenCalledWith({ onlySelf: true, emitEvent: false });
    });

    it('should not update typeControl validity when individualGroup changes and typeControl is not dirty', () => {
      const typeControl = component['minorCreditorType'];
      const updateValiditySpy = spyOn(typeControl, 'updateValueAndValidity');

      // Ensure the typeControl is not dirty (pristine)
      typeControl.markAsPristine();

      // Trigger the individual group value change
      component.individualGroup.get('fsa_search_account_minor_creditors_first_names')?.setValue('John');

      expect(updateValiditySpy).not.toHaveBeenCalled();
    });

    it('should not update typeControl validity when companyGroup changes and typeControl is not dirty', () => {
      const typeControl = component['minorCreditorType'];
      const updateValiditySpy = spyOn(typeControl, 'updateValueAndValidity');

      // Ensure the typeControl is not dirty (pristine)
      typeControl.markAsPristine();

      // Trigger the company group value change
      component.companyGroup.get('company_name')?.setValue('Test Company');

      expect(updateValiditySpy).not.toHaveBeenCalled();
    });
  });
});
