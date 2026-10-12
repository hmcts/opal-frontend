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
import { FINES_CON_SEARCH_ACCOUNT_STATE } from '../../constants/fines-con-search-account-state.constant';

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

  it('should return early when individuals group is missing', () => {
    component.form = new FormGroup({});

    expect(() => component['setupIndividualForm']()).not.toThrow();
    expect(component.form.get('fcon_search_account_individuals_search_criteria')).toBeNull();
  });

  it('should patch an empty object when no individual criteria are stored', () => {
    finesConStore.updateSearchAccountFormTemporary({
      ...FINES_CON_SEARCH_ACCOUNT_STATE,
      fcon_search_account_individuals_search_criteria: undefined as never,
    });

    const blankFixture = TestBed.createComponent(FinesConSearchAccountFormIndividualsComponent);
    const blankComponent = blankFixture.componentInstance;
    blankComponent.form = new FormGroup({
      fcon_search_account_individuals_search_criteria: new FormGroup({}),
    });
    blankComponent.formControlErrorMessages = {} as IAbstractFormControlErrorMessage;

    blankFixture.detectChanges();

    expect(
      blankComponent.form.get(
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_last_name',
      )?.value,
    ).toBeNull();
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

  it('should validate postcode pattern on the individuals postcode control', () => {
    const postcodeControl = component.form.get(
      'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_post_code',
    );

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(false);

    postcodeControl?.setValue('SW1A:1AA');
    expect(postcodeControl?.hasError('alphanumericTextPattern')).toBe(true);
  });

  it('should validate address line 1 with the single ASCII characters pattern', () => {
    const addressControl = component.form.get(
      'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_address_line_1',
    );

    addressControl?.setValue('Flat @ 2');
    expect(addressControl?.hasError('singleAsciiCharacters')).toBe(false);

    addressControl?.setValue('Café');
    expect(addressControl?.hasError('singleAsciiCharacters')).toBe(true);
  });

  it('should validate postcode max length after stripping whitespace on the individuals postcode control', () => {
    const postcodeControl = component.form.get(
      'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_post_code',
    );

    postcodeControl?.setValue('SW1A 1AA');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('AB12 3CD');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);

    postcodeControl?.setValue('AB12 3CDA');
    expect(postcodeControl?.hasError('maxlength')).toBe(true);
  });

  it('should trim only surrounding whitespace from the postcode input on focusout', () => {
    const postcodeInput = fixture.nativeElement.querySelector(
      'input[name="fcon_search_account_individuals_post_code"]',
    ) as HTMLInputElement | null;
    if (!postcodeInput) throw new Error('Postcode input not found');

    const postcodeControl = component.form.get(
      'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_post_code',
    );

    postcodeControl?.setValue('  AB1  3CD ');
    postcodeInput.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();

    expect(postcodeControl?.value).toBe('AB1  3CD');
    expect(postcodeControl?.hasError('maxlength')).toBe(false);
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

  it('should ignore setInputValue calls when the target control is missing', () => {
    expect(() =>
      component.setInputValue(
        '02/02/1992',
        'fcon_search_account_individuals_search_criteria.fcon_search_account_individuals_missing',
      ),
    ).not.toThrow();
  });
});
