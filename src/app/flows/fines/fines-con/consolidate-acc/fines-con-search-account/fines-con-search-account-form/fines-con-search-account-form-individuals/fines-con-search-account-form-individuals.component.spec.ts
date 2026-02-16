import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { FinesConSearchAccountFormIndividualsComponent } from './fines-con-search-account-form-individuals.component';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FinesConStore } from '../../../../stores/fines-con.store';
import { FinesConStoreType } from '../../../../stores/types/fines-con-store.type';

describe('FinesConSearchAccountFormIndividualsComponent', () => {
  let component: FinesConSearchAccountFormIndividualsComponent;
  let fixture: ComponentFixture<FinesConSearchAccountFormIndividualsComponent>;
  let finesConStore: InstanceType<FinesConStoreType>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      params: { subscribe: () => {} },
      queryParams: { subscribe: () => {} },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesConSearchAccountFormIndividualsComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchAccountFormIndividualsComponent);
    component = fixture.componentInstance;
    finesConStore = TestBed.inject(FinesConStore);

    finesConStore.updateSearchAccountFormTemporary({
      fcon_search_account_number: null,
      fcon_search_account_national_insurance_number: null,
      fcon_search_account_individuals_search_criteria: {
        fcon_search_account_individuals_last_name: 'Smith',
        fcon_search_account_individuals_last_name_exact_match: true,
        fcon_search_account_individuals_first_names: 'John',
        fcon_search_account_individuals_first_names_exact_match: false,
        fcon_search_account_individuals_include_aliases: false,
        fcon_search_account_individuals_date_of_birth: '01/01/1990',
        fcon_search_account_individuals_address_line_1: '123 Main Street',
        fcon_search_account_individuals_post_code: 'SW1A 1AA',
      },
    });

    component.form = new FormGroup({
      fcon_search_account_individuals_search_criteria: new FormGroup({}),
    });
    component.formControlErrorMessages = {} as IAbstractFormControlErrorMessage;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all individuals nested form controls', () => {
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name_exact_match')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_first_names')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_first_names_exact_match')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_include_aliases')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_date_of_birth')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_address_line_1')).toBeTruthy();
    expect(component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_post_code')).toBeTruthy();
  });

  it('should rehydrate individuals criteria values from store after control setup', () => {
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name')?.value,
    ).toBe('Smith');
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_date_of_birth')
        ?.value,
    ).toBe('01/01/1990');
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_post_code')
        ?.value,
    ).toBe('SW1A 1AA');
  });

  it('should require last name when first names are provided', () => {
    component
      .form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name')
      ?.setValue(null);
    component
      .form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_first_names')
      ?.setValue('Jane');

    expect(
      component.form
        .get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name')
        ?.hasError('required'),
    ).toBe(true);
  });

  it('should set input value and trigger conditional validation for nested control path', () => {
    component.setInputValue(
      '02/02/1992',
      'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_date_of_birth',
    );

    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_date_of_birth')
        ?.value,
    ).toBe('02/02/1992');
  });

});
