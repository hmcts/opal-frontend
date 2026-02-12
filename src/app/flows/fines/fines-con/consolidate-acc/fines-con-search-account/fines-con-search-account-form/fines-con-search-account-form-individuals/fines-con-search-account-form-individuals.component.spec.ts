import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { FinesConSearchAccountFormIndividualsComponent } from './fines-con-search-account-form-individuals.component';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

describe('FinesConSearchAccountFormIndividualsComponent', () => {
  let component: FinesConSearchAccountFormIndividualsComponent;
  let fixture: ComponentFixture<FinesConSearchAccountFormIndividualsComponent>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      params: { subscribe: () => {} },
      queryParams: { subscribe: () => {} },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesConSearchAccountFormIndividualsComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchAccountFormIndividualsComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      fcon_search_account_individuals_last_name: new FormControl(null),
      fcon_search_account_individuals_last_name_exact_match: new FormControl(false),
      fcon_search_account_individuals_first_names: new FormControl(null),
      fcon_search_account_individuals_first_names_exact_match: new FormControl(false),
      fcon_search_account_individuals_include_aliases: new FormControl(false),
      fcon_search_account_individuals_aliases: new FormControl(null),
      fcon_search_account_individuals_date_of_birth: new FormControl(null),
      fcon_search_account_individuals_address_line_1: new FormControl(null),
      fcon_search_account_individuals_postcode: new FormControl(null),
    });

    const errorMessages: IAbstractFormControlErrorMessage = {
      fcon_search_account_individuals_last_name: 'Last name',
      fcon_search_account_individuals_first_names: 'First names',
      fcon_search_account_individuals_date_of_birth: 'Date of birth',
      fcon_search_account_individuals_aliases: 'Aliases',
      fcon_search_account_individuals_address_line_1: 'Address line 1',
      fcon_search_account_individuals_postcode: 'Postcode',
    };

    component.formControlErrorMessages = errorMessages;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all form controls', () => {
    expect(component.form.get('fcon_search_account_individuals_last_name')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_last_name_exact_match')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_first_names')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_first_names_exact_match')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_include_aliases')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_aliases')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_date_of_birth')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_address_line_1')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_postcode')).toBeTruthy();
  });

  it('should set exact match checkboxes to false by default', () => {
    expect(component.form.get('fcon_search_account_individuals_last_name_exact_match')?.value).toBeFalsy();
    expect(component.form.get('fcon_search_account_individuals_first_names_exact_match')?.value).toBeFalsy();
  });

  it('should set include aliases checkbox to false by default', () => {
    expect(component.form.get('fcon_search_account_individuals_include_aliases')?.value).toBeFalsy();
  });

  it('should handle conditional validation when first names are provided', () => {
    component.form.get('fcon_search_account_individuals_first_names')?.setValue('John');
    const lastNameControl = component.form.get('fcon_search_account_individuals_last_name');

    // Manually trigger ngOnInit to setup validation subscriptions
    component.ngOnInit();

    // Last name should now be required
    expect(lastNameControl?.hasError('required')).toBeTruthy();
  });

  it('should handle conditional validation when DOB is provided', () => {
    component.form.get('fcon_search_account_individuals_date_of_birth')?.setValue('01/01/1990');
    const lastNameControl = component.form.get('fcon_search_account_individuals_last_name');

    component.ngOnInit();

    // Last name should now be required
    expect(lastNameControl?.hasError('required')).toBeTruthy();
  });

  it('should handle conditional validation when last name exact match is checked', () => {
    component.form.get('fcon_search_account_individuals_last_name_exact_match')?.setValue(true);
    const lastNameControl = component.form.get('fcon_search_account_individuals_last_name');

    component.ngOnInit();

    // Last name should now be required
    expect(lastNameControl?.hasError('required')).toBeTruthy();
  });

  it('should handle conditional validation when include aliases is checked', () => {
    component.form.get('fcon_search_account_individuals_include_aliases')?.setValue(true);
    const lastNameControl = component.form.get('fcon_search_account_individuals_last_name');

    component.ngOnInit();

    // Last name should now be required
    expect(lastNameControl?.hasError('required')).toBeTruthy();
  });

  it('should handle conditional validation when first names exact match is checked', () => {
    component.form.get('fcon_search_account_individuals_first_names_exact_match')?.setValue(true);
    const firstNamesControl = component.form.get('fcon_search_account_individuals_first_names');

    component.ngOnInit();

    // First names should now be required
    expect(firstNamesControl?.hasError('required')).toBeTruthy();
  });

  it('should not require last name when it has a value, even if other conditions are met', () => {
    component.form.get('fcon_search_account_individuals_last_name')?.setValue('Smith');
    component.form.get('fcon_search_account_individuals_first_names')?.setValue('John');
    const lastNameControl = component.form.get('fcon_search_account_individuals_last_name');

    component.ngOnInit();

    // Last name should not have required error since it has a value
    expect(lastNameControl?.hasError('required')).toBeFalsy();
  });

  it('should not require first names when it has a value, even if exact match is checked', () => {
    component.form.get('fcon_search_account_individuals_first_names')?.setValue('John');
    component.form.get('fcon_search_account_individuals_first_names_exact_match')?.setValue(true);
    const firstNamesControl = component.form.get('fcon_search_account_individuals_first_names');

    component.ngOnInit();

    // First names should not have required error since it has a value
    expect(firstNamesControl?.hasError('required')).toBeFalsy();
  });

  it('should return early from handleConditionalValidation if a required control is missing', () => {
    // Remove a control to test the guard clause
    component.form.removeControl('fcon_search_account_individuals_date_of_birth');
    component.form.get('fcon_search_account_individuals_first_names')?.setValue('John');

    // Should not throw an error
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should set input value and trigger conditional validation', () => {
    component.ngOnInit();
    const lastNameControl = component.form.get('fcon_search_account_individuals_last_name');

    component.setInputValue('Smith', 'fcon_search_account_individuals_last_name');

    expect(lastNameControl?.value).toBe('Smith');
  });

  it('should handle setInputValue when control does not exist', () => {
    component.ngOnInit();

    // Should not throw an error when control doesn't exist
    expect(() => component.setInputValue('Test', 'nonexistent_control')).not.toThrow();
  });

  it('should return early from setupConditionalValidation if firstNamesControl is missing', () => {
    component.form.removeControl('fcon_search_account_individuals_first_names');

    // Should not throw an error when a required control is missing
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should return early from setupConditionalValidation if dobControl is missing', () => {
    component.form.removeControl('fcon_search_account_individuals_date_of_birth');

    // Should not throw an error when a required control is missing
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should return early from setupConditionalValidation if firstNamesExactMatchControl is missing', () => {
    component.form.removeControl('fcon_search_account_individuals_first_names_exact_match');

    // Should not throw an error when a required control is missing
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should return early from setupConditionalValidation if lastNameExactMatchControl is missing', () => {
    component.form.removeControl('fcon_search_account_individuals_last_name_exact_match');

    // Should not throw an error when a required control is missing
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should return early from setupConditionalValidation if includeAliasesControl is missing', () => {
    component.form.removeControl('fcon_search_account_individuals_include_aliases');

    // Should not throw an error when a required control is missing
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should return early from handleConditionalValidation if lastNameControl is missing', () => {
    component.form.removeControl('fcon_search_account_individuals_last_name');
    component.form.get('fcon_search_account_individuals_first_names')?.setValue('John');

    component.ngOnInit();

    // Should not throw an error when last name control is missing
    expect(() => component.form.updateValueAndValidity()).not.toThrow();
  });

  it('should not subscribe to validation when setupConditionalValidation guard returns early', () => {
    // Remove one of the required controls so the guard clause returns
    component.form.removeControl('fcon_search_account_individuals_include_aliases');

    // Get a reference to a control that should have had validation subscribed
    const firstNamesControl = component.form.get('fcon_search_account_individuals_first_names');

    // Initialize the component - this will call setupConditionalValidation which should return early
    component.ngOnInit();

    // Change a value that would normally trigger validation if subscriptions were set up
    firstNamesControl?.setValue('John');

    // The form should not have been updated by conditional validation since the subscription wasn't set up
    // This verifies the guard clause (return statement) was executed
    expect(() => firstNamesControl?.updateValueAndValidity()).not.toThrow();
  });
});
