import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { FinesConSearchAccountFormIndividualsComponent } from './fines-con-search-account-form-individuals.component';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { FinesConStore } from '../../../../stores/fines-con.store';
import { FinesConStoreType } from '../../../../stores/types/fines-con-store.type';
import { FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_MOCK } from '../../mocks/fines-con-search-account-form-individuals.mock';

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

    finesConStore.updateSearchAccountFormTemporary(FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_MOCK.formData);

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
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name'),
    ).toBeTruthy();
    expect(
      component.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name_exact_match',
      ),
    ).toBeTruthy();
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_first_names'),
    ).toBeTruthy();
    expect(
      component.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_first_names_exact_match',
      ),
    ).toBeTruthy();
    expect(
      component.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_include_aliases',
      ),
    ).toBeTruthy();
    expect(
      component.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_date_of_birth',
      ),
    ).toBeTruthy();
    expect(
      component.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_address_line_1',
      ),
    ).toBeTruthy();
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_post_code'),
    ).toBeTruthy();
  });

  it('should rehydrate individuals criteria values from store after control setup', () => {
    const mockData =
      FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_MOCK.formData.fcon_search_account_individuals_search_criteria!;
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name')
        ?.value,
    ).toBe(mockData.fcon_search_account_individuals_last_name);
    expect(
      component.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_date_of_birth',
      )?.value,
    ).toBe(mockData.fcon_search_account_individuals_date_of_birth);
    expect(
      component.form.get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_post_code')
        ?.value,
    ).toBe(mockData.fcon_search_account_individuals_post_code);
  });

  it('should require last name when first names are provided', () => {
    component.form
      .get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name')
      ?.setValue(null);
    component.form
      .get('fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_first_names')
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
      component.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_date_of_birth',
      )?.value,
    ).toBe('02/02/1992');
  });
});
