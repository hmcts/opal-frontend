import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import axe from 'axe-core';
import { ActivatedRoute, NavigationExtras, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';
import { FinesMciStore } from '../stores/fines-mci.store';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, MockInstance, vi } from 'vitest';
import { IFinesMciCriminalSearch } from '../stores/interfaces/fines-mci-criminal-search.interface';
import { FinesMciPaymentCategoryCriminalSearchComponent } from './fines-mci-payment-category-criminal-search.component';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from '../fines-mci-payment-category-criminal-matches/fines-mci-payment-category-criminal-matches.component';
import { FinesMciCreateTillPaymentCategoryComponent } from '../fines-mci-create-till/fines-mci-create-till-payment-category/fines-mci-create-till-payment-category.component';
import { finesMciCriminalAccountsResolver } from '../routing/resolvers/fines-mci-criminal-accounts/fines-mci-criminal-accounts.resolver';

const CRIMINAL_MATCHES_ROUTE = ['matches'];

describe('FinesMciPaymentCategoryCriminalSearchComponent', () => {
  let component: FinesMciPaymentCategoryCriminalSearchComponent;
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalSearchComponent>;
  let fragmentSubject: BehaviorSubject<string | null>;
  let routerNavigateSpy: ReturnType<typeof vi.fn<(_: readonly unknown[], __?: NavigationExtras) => Promise<boolean>>>;

  beforeEach(async () => {
    fragmentSubject = new BehaviorSubject<string | null>(null);
    routerNavigateSpy = vi.fn<(_: readonly unknown[], __?: NavigationExtras) => Promise<boolean>>();
    routerNavigateSpy.mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalSearchComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: fragmentSubject.asObservable(),
            parent: {},
          },
        },
      ],
    }).compileComponents();

    vi.spyOn(TestBed.inject(Router), 'navigate').mockImplementation(routerNavigateSpy);
    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose typed form data matching the criminal search store', () => {
    const formData = component.form.getRawValue();

    expectTypeOf(formData).not.toBeAny();
    expectTypeOf(formData).toEqualTypeOf<IFinesMciCriminalSearch['formData']>();
  });

  it('should render the stripped down criminal account search page', () => {
    const text = fixture.nativeElement.textContent;

    expect(fixture.nativeElement.querySelector('.govuk-caption-m')?.textContent).toContain(
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name,
    );
    expect(text).toContain('Search for an account');
    expect(text).toContain('Quick search');
    expect(text).toContain('Advanced search');
    expect(text).toContain('Individuals');
    expect(text).toContain('Companies');
    expect(text).toContain('Cancel');
  });

  it('should use the current selected business unit for the caption and account number search', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1];
    TestBed.inject(FinesMciStore).setBusinessUnit(businessUnit);
    fixture.detectChanges();
    component['form'].patchValue({ fsa_search_account_number: '12345678' });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(fixture.nativeElement.querySelector('.govuk-caption-m')?.textContent).toContain(
      businessUnit.business_unit_name,
    );
    expect(TestBed.inject(FinesMciStore).criminalSearch()?.formData.fsa_search_account_number).toBe('12345678');
  });

  it('should default the tab fragment to individuals', () => {
    expect(routerNavigateSpy).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      fragment: 'individuals',
      replaceUrl: true,
    });
    expect(component['activeTab']()).toBe('individuals');
  });

  it('should update the fragment when changing tab', () => {
    routerNavigateSpy.mockClear();

    (fixture.nativeElement.querySelector('#tab-companies') as HTMLAnchorElement).click();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['./'], {
      relativeTo: TestBed.inject(ActivatedRoute),
      fragment: 'companies',
    });
  });

  it('should set companies as the active tab from the route fragment', () => {
    fragmentSubject.next('companies');
    fixture.detectChanges();

    expect(component['activeTab']()).toBe('companies');
    expect(fixture.nativeElement.textContent).toContain('Company name');
  });

  it.each(['individuals', 'companies'] as const)('should provide accessible tabs with %s selected', async (tab) => {
    fragmentSubject.next(tab);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const selectedTab = element.querySelector(`#tab-${tab}`)!;
    const otherTab = element.querySelector(`#tab-${tab === 'individuals' ? 'companies' : 'individuals'}`)!;
    const panel = element.querySelector(`#${tab}`)!;

    expect(selectedTab.getAttribute('aria-selected')).toBe('true');
    expect(selectedTab.getAttribute('tabindex')).toBe('0');
    expect(selectedTab.getAttribute('aria-controls')).toBe(panel.id);
    expect(otherTab.getAttribute('aria-selected')).toBe('false');
    expect(otherTab.getAttribute('tabindex')).toBe('-1');
    expect(panel.getAttribute('aria-labelledby')).toBe(selectedTab.id);

    const results = await axe.run(element, {
      runOnly: {
        type: 'rule',
        values: ['aria-required-children', 'aria-required-parent', 'aria-required-attr', 'aria-valid-attr-value'],
      },
    });
    expect(results.violations).toEqual([]);
  });

  it.each(['individuals', 'companies'] as const)(
    'should clear tab inputs and errors when leaving %s, preserving the account number',
    (tab) => {
      fragmentSubject.next(tab);
      const nextTab = tab === 'individuals' ? 'companies' : 'individuals';
      component['form'].patchValue({
        fsa_search_account_number: '12345678',
        fsa_search_account_individuals_search_criteria: {
          fsa_search_account_individuals_last_name: 'Smith',
          fsa_search_account_individuals_first_names: 'John',
          fsa_search_account_individuals_last_name_exact_match: true,
          fsa_search_account_individuals_first_names_exact_match: true,
          fsa_search_account_individuals_include_aliases: true,
        },
        fsa_search_account_companies_search_criteria: {
          fsa_search_account_companies_company_name: 'Acme Ltd',
          fsa_search_account_companies_company_name_exact_match: true,
          fsa_search_account_companies_include_aliases: true,
        },
      });
      component.formControlErrorMessages = { fsa_search_account_number: 'Old error' };
      component.formErrorSummaryMessage = [{ fieldId: 'fsa_search_account_number', message: 'Old error' }];

      fragmentSubject.next(nextTab);

      const formValue = component['form'].getRawValue();
      expect(formValue.fsa_search_account_number).toBe('12345678');
      expect(Object.values(formValue.fsa_search_account_individuals_search_criteria)).toEqual(Array(5).fill(null));
      expect(Object.values(formValue.fsa_search_account_companies_search_criteria)).toEqual(Array(3).fill(null));
      expect(component.formErrorSummaryMessage).toEqual([]);
      expect(Object.values(component.formControlErrorMessages).every((message) => !message)).toBe(true);

      fragmentSubject.next(tab);
      expect(component['form'].getRawValue()).toEqual(formValue);
      routerNavigateSpy.mockClear();
      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
      expect(TestBed.inject(FinesMciStore).criminalSearch()?.searchCriteriaCannotBeCombined).toBe(false);
      expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE, {
        relativeTo: TestBed.inject(ActivatedRoute).parent,
      });
    },
  );

  it('should preserve inputs when the selected tab does not change', () => {
    component['form'].patchValue({
      fsa_search_account_individuals_search_criteria: { fsa_search_account_individuals_last_name: 'Smith' },
    });

    fragmentSubject.next('individuals');

    expect(
      component['form'].get('fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_last_name')
        ?.value,
    ).toBe('Smith');
  });

  it.each(['individuals', 'companies'] as const)(
    'should reject account number combined with a checkbox on %s',
    (tab) => {
      fragmentSubject.next(tab);
      component['form'].patchValue({
        fsa_search_account_number: '12345678',
        ...(tab === 'individuals'
          ? { fsa_search_account_individuals_search_criteria: { fsa_search_account_individuals_include_aliases: true } }
          : { fsa_search_account_companies_search_criteria: { fsa_search_account_companies_include_aliases: true } }),
      });
      routerNavigateSpy.mockClear();

      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

      expect(TestBed.inject(FinesMciStore).criminalSearch()?.searchCriteriaCannotBeCombined).toBe(true);
      expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE, {
        relativeTo: TestBed.inject(ActivatedRoute).parent,
      });
    },
  );

  it('should only create form controls for the stripped down search inputs', () => {
    expect(component['form'].get('fsa_search_account_reference_case_number')).toBeNull();
    expect(component['form'].get('fsa_search_account_minor_creditors_search_criteria')).toBeNull();
    expect(component['form'].get('fsa_search_account_major_creditors_search_criteria')).toBeNull();
    expect(component['form'].get('fsa_search_account_active_accounts_only')).toBeNull();
    expect(
      component['form'].get(
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_date_of_birth',
      ),
    ).toBeNull();
    expect(
      component['form'].get(
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_address_line_1',
      ),
    ).toBeNull();
    expect(
      component['form'].get('fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_post_code'),
    ).toBeNull();
    expect(
      component['form'].get('fsa_search_account_companies_search_criteria.fsa_search_account_companies_address_line_1'),
    ).toBeNull();
    expect(
      component['form'].get('fsa_search_account_companies_search_criteria.fsa_search_account_companies_post_code'),
    ).toBeNull();
  });

  it.each(['individuals', 'companies'] as const)(
    'should store %s criteria and navigate without query parameters',
    (tab) => {
      fragmentSubject.next(tab);
      routerNavigateSpy.mockClear();
      component['form'].patchValue({
        ...(tab === 'individuals'
          ? { fsa_search_account_individuals_search_criteria: { fsa_search_account_individuals_last_name: 'Smith' } }
          : {
              fsa_search_account_companies_search_criteria: { fsa_search_account_companies_company_name: 'Acme Ltd' },
            }),
      });

      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

      const search = TestBed.inject(FinesMciStore).criminalSearch();
      expect(search?.activeTab).toBe(tab);
      expect(search?.searchCriteriaCannotBeCombined).toBe(false);
      expect(
        search?.formData.fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_last_name,
      ).toBe(tab === 'individuals' ? 'Smith' : null);
      expect(
        search?.formData.fsa_search_account_companies_search_criteria.fsa_search_account_companies_company_name,
      ).toBe(tab === 'companies' ? 'Acme Ltd' : null);
      expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE, {
        relativeTo: TestBed.inject(ActivatedRoute).parent,
      });
    },
  );

  it('should restore the submitted criteria and tab when returning to search', () => {
    fragmentSubject.next('companies');
    component['form'].patchValue({
      fsa_search_account_companies_search_criteria: { fsa_search_account_companies_company_name: 'Acme Ltd' },
    });
    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    fixture.destroy();
    fragmentSubject.next(null);

    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalSearchComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance['activeTab']()).toBe('companies');
    expect(
      fixture.componentInstance['form'].getRawValue().fsa_search_account_companies_search_criteria
        .fsa_search_account_companies_company_name,
    ).toBe('Acme Ltd');
  });

  it.each(['Anne-Marie', "O'Neill", 'Name 123, Jr.'])('should accept printable ASCII names as in MAC: %s', (name) => {
    routerNavigateSpy.mockClear();
    component['form'].patchValue({
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: name,
        fsa_search_account_individuals_first_names: name,
      },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(component['form'].valid).toBe(true);
    expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE, {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
  });

  it.each([
    ['first_names', 'First Names', 'Jos\u00e9'],
    ['last_name', 'Last Name', 'Smith\u2019'],
    ['first_names', 'First Names', 'Name\n'],
    ['last_name', 'Last Name', 'Name\t'],
  ])('should reject non-printable or non-ASCII %s with the AC message', (field, label, value) => {
    routerNavigateSpy.mockClear();
    component['form'].patchValue({
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Smith',
        fsa_search_account_individuals_first_names: 'John',
        [`fsa_search_account_individuals_${field}`]: value,
      },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    fixture.detectChanges();

    expect(component.formControlErrorMessages[`fsa_search_account_individuals_${field}`]).toBe(
      `${label} must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)`,
    );
    expect(fixture.nativeElement.textContent).toContain(
      `${label} must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)`,
    );
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(TestBed.inject(FinesMciStore).criminalSearch()).toBeNull();
  });

  it.each([
    ['first_names', 20, 'First names'],
    ['last_name', 30, 'Last name'],
  ] as const)('should retain the maximum length for %s', (field, limit, label) => {
    component['form'].patchValue({
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Smith',
        [`fsa_search_account_individuals_${field}`]: 'A'.repeat(limit + 1),
      },
    });
    routerNavigateSpy.mockClear();

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(component.formControlErrorMessages[`fsa_search_account_individuals_${field}`]).toBe(
      `${label} must be ${limit} characters or fewer`,
    );
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it.each(['Acme 123', "O'Neill-Sons Ltd.", 'Acme & Co', 'A'.repeat(50)])(
    'should accept printable ASCII company names up to 50 characters: %s',
    (name) => {
      fragmentSubject.next('companies');
      routerNavigateSpy.mockClear();
      component['form'].patchValue({
        fsa_search_account_companies_search_criteria: { fsa_search_account_companies_company_name: name },
      });

      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

      expect(component['form'].valid).toBe(true);
      expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE, {
        relativeTo: TestBed.inject(ActivatedRoute).parent,
      });
    },
  );

  it.each([
    [
      'Acme\u00e9',
      'Company Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
    ],
    [
      'Acme\tLtd',
      'Company Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
    ],
    [
      '  \tAcme\t  ',
      'Company Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
    ],
    [
      '  \u00a0Acme\u00a0  ',
      'Company Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
    ],
    ['A'.repeat(51), 'Company name must be 50 characters or fewer'],
  ])('should prevent company searches with invalid names: %s', (name, message) => {
    fragmentSubject.next('companies');
    routerNavigateSpy.mockClear();
    component['form'].patchValue({
      fsa_search_account_companies_search_criteria: { fsa_search_account_companies_company_name: name },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    fixture.detectChanges();

    expect(component.formControlErrorMessages['fsa_search_account_companies_company_name']).toBe(message);
    expect(fixture.nativeElement.textContent).toContain(message);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(TestBed.inject(FinesMciStore).criminalSearch()).toBeNull();
  });

  it.each([
    ['individuals', 'first_names', 'last_name', 'John', 'Enter last name'],
    ['individuals', 'last_name_exact_match', 'last_name', true, 'Enter last name'],
    ['individuals', 'include_aliases', 'last_name', true, 'Enter last name'],
    ['individuals', 'first_names_exact_match', 'first_names', true, 'Enter first name'],
    ['companies', 'include_aliases', 'company_name', true, 'Enter company name'],
    ['companies', 'company_name_exact_match', 'company_name', true, 'Enter company name'],
  ] as const)(
    'should apply and clear the required-field error for %s when %s changes',
    (tab, trigger, dependent, value, message) => {
      fragmentSubject.next(tab);
      routerNavigateSpy.mockClear();
      const fieldPrefix = `fsa_search_account_${tab}_`;
      const criteria = component['form'].get(`${fieldPrefix}search_criteria`)!;
      const triggerControl: AbstractControl<string | boolean | null> = criteria.get(`${fieldPrefix}${trigger}`)!;
      const dependentControl = criteria.get(`${fieldPrefix}${dependent}`)!;
      triggerControl.setValue(value);

      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
      fixture.detectChanges();

      expect(component.formControlErrorMessages[`${fieldPrefix}${dependent}`]).toBe(message);
      expect(fixture.nativeElement.textContent).toContain(message);
      expect(routerNavigateSpy).not.toHaveBeenCalled();

      triggerControl.reset();
      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

      expect(dependentControl.errors).toBeNull();
      expect(component.formControlErrorMessages[`${fieldPrefix}${dependent}`]).toBeUndefined();
      expect(routerNavigateSpy).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['individuals', 'first_names', 'last_name', 'Jim', 'Enter last name'],
    ['individuals', 'last_name_exact_match', 'last_name', true, 'Enter last name'],
    ['individuals', 'include_aliases', 'last_name', true, 'Enter last name'],
    ['individuals', 'first_names_exact_match', 'first_names', true, 'Enter first name'],
    ['companies', 'include_aliases', 'company_name', true, 'Enter company name'],
    ['companies', 'company_name_exact_match', 'company_name', true, 'Enter company name'],
  ] as const)('should reject a spaces-only %s name when %s requires it', (tab, trigger, dependent, value, message) => {
    fragmentSubject.next(tab);
    const prefix = `fsa_search_account_${tab}_`;
    const criteria = component.form.get(`${prefix}search_criteria`)!;
    const triggerControl: AbstractControl<string | boolean | null> = criteria.get(`${prefix}${trigger}`)!;
    const dependentControl: AbstractControl<string | null> = criteria.get(`${prefix}${dependent}`)!;
    triggerControl.setValue(value);
    dependentControl.setValue('   ');
    routerNavigateSpy.mockClear();

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    fixture.detectChanges();

    expect(dependentControl.value).toBe('');
    expect(component.formControlErrorMessages[`${prefix}${dependent}`]).toBe(message);
    expect(fixture.nativeElement.textContent).toContain(message);
    expect(component.form.valid).toBe(false);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(TestBed.inject(FinesMciStore).criminalSearch()).toBeNull();
  });

  it.each([
    ['individuals', 'first_names', 'Jim Davidson'],
    ['individuals', 'last_name', 'Jim Davidson'],
    ['companies', 'company_name', 'Jim Davidson Ltd'],
  ] as const)('should trim the %s %s while preserving spaces within the name', (tab, field, name) => {
    fragmentSubject.next(tab);
    const prefix = `fsa_search_account_${tab}_`;
    const criteria = component.form.get(`${prefix}search_criteria`)!;
    const nameControl: AbstractControl<string | null> = criteria.get(`${prefix}${field}`)!;
    if (field === 'first_names') {
      component.form.controls.fsa_search_account_individuals_search_criteria.patchValue({
        fsa_search_account_individuals_last_name: 'Davidson',
      });
    }
    nameControl.setValue(`  ${name}  `);
    routerNavigateSpy.mockClear();

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    fixture.detectChanges();

    expect(nameControl.value).toBe(name);
    expect(fixture.nativeElement.querySelector(`#${prefix}${field}`).value).toBe(name);
    expect(TestBed.inject(FinesMciStore).criminalSearch()?.formData).toEqual(component.form.getRawValue());
    expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE, {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
  });

  it('should ignore spaces-only names when searching by account number', () => {
    component.form.patchValue({
      fsa_search_account_number: '12345678',
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: '   ',
        fsa_search_account_individuals_first_names: '   ',
      },
    });
    routerNavigateSpy.mockClear();

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(component.form.valid).toBe(true);
    expect(TestBed.inject(FinesMciStore).criminalSearch()?.searchCriteriaCannotBeCombined).toBe(false);
    expect(routerNavigateSpy).toHaveBeenCalledOnce();
  });

  it('should not search when all name fields contain only spaces', () => {
    component.form.patchValue({
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: '   ',
        fsa_search_account_individuals_first_names: '   ',
      },
      fsa_search_account_companies_search_criteria: { fsa_search_account_companies_company_name: '   ' },
    });
    routerNavigateSpy.mockClear();

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(component.form.errors).toEqual({ formEmpty: true });
    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(TestBed.inject(FinesMciStore).criminalSearch()).toBeNull();
  });

  it('should store combined criteria for the matches resolver to handle', () => {
    routerNavigateSpy.mockClear();
    component['form'].patchValue({
      fsa_search_account_number: '12345678',
      fsa_search_account_individuals_search_criteria: { fsa_search_account_individuals_last_name: 'Smith' },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(TestBed.inject(FinesMciStore).criminalSearch()?.searchCriteriaCannotBeCombined).toBe(true);
    expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE, {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
  });

  it('should allow browser unload when the search form is empty', () => {
    const event = new Event('beforeunload', { cancelable: true });

    expect(window.dispatchEvent(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });

  it.each([
    ['fsa_search_account_number', '12345678'],
    ['fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_last_name', 'Smith'],
    ['fsa_search_account_companies_search_criteria.fsa_search_account_companies_company_name', 'Acme Ltd'],
    ['fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_include_aliases', true],
  ] as const)('should warn before browser unload when %s contains data', (path, value) => {
    const control: AbstractControl<string | boolean | null> = component.form.get(path)!;
    control.setValue(value);
    const formData = component.form.getRawValue();
    const event = new Event('beforeunload', { cancelable: true });

    expect(window.dispatchEvent(event)).toBe(false);
    expect(event.defaultPrevented).toBe(true);
    expect(component.form.getRawValue()).toEqual(formData);
  });

  it('should allow browser unload once search data has been cleared', () => {
    component.form.patchValue({ fsa_search_account_number: '12345678' });
    component.form.reset();
    component.form.controls.fsa_search_account_individuals_search_criteria.patchValue({
      fsa_search_account_individuals_include_aliases: false,
    });
    const event = new Event('beforeunload', { cancelable: true });

    expect(window.dispatchEvent(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should allow retry and require confirmation again after a search navigation is cancelled', async () => {
    component['form'].patchValue({ fsa_search_account_number: '12345678' });
    routerNavigateSpy.mockClear();
    routerNavigateSpy.mockResolvedValueOnce(false);

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await fixture.whenStable();

    expect(component.canDeactivate()).toBe(false);

    component.form.patchValue({ fsa_search_account_number: '12345679' });
    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await fixture.whenStable();

    expect(routerNavigateSpy).toHaveBeenCalledTimes(2);
    expect(TestBed.inject(FinesMciStore).criminalSearch()?.formData.fsa_search_account_number).toBe('12345679');
  });

  it.each([null, '1234567890'])(
    'should not navigate or store criteria for an empty or invalid account number: %s',
    (accountNumber) => {
      routerNavigateSpy.mockClear();
      component['form'].patchValue({ fsa_search_account_number: accountNumber });

      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

      expect(TestBed.inject(FinesMciStore).criminalSearch()).toBeNull();
      expect(routerNavigateSpy).not.toHaveBeenCalled();
    },
  );
});

@Component({ template: '<h1>Till details</h1>' })
class TillDetailsDestinationComponent {}

describe('Criminal search navigation', () => {
  const routeRoot = '/fines/manual-cash-input/create/till';
  const searchUrl = `${routeRoot}/payment/category/criminal/search`;
  const detailsUrl = `${routeRoot}/details`;
  const matchesUrl = `${routeRoot}/payment/category/criminal/matches`;
  const service = { getDefendantAccounts: vi.fn() };
  let harness: RouterTestingHarness;
  let component: FinesMciPaymentCategoryCriminalSearchComponent;
  let store: InstanceType<typeof FinesMciStore>;
  let confirmSpy: MockInstance<typeof window.confirm>;

  beforeEach(async () => {
    service.getDefendantAccounts.mockReset().mockReturnValue(of({ count: 1, defendant_accounts: [] }));
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: routeRoot.slice(1),
            children: [
              { path: 'details', component: TillDetailsDestinationComponent },
              {
                path: 'payment-category',
                component: FinesMciCreateTillPaymentCategoryComponent,
                canDeactivate: [canDeactivateGuard],
              },
              {
                path: 'payment',
                children: [
                  {
                    path: 'category',
                    children: [
                      {
                        path: 'criminal',
                        children: [
                          {
                            path: 'search',
                            component: FinesMciPaymentCategoryCriminalSearchComponent,
                            canDeactivate: [canDeactivateGuard],
                          },
                          {
                            path: 'matches',
                            component: FinesMciPaymentCategoryCriminalMatchesComponent,
                            resolve: { criminalAccounts: finesMciCriminalAccountsResolver },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]),
        { provide: OpalFines, useValue: service },
      ],
    }).compileComponents();
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    confirmSpy.mockClear();
    store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.ensureTill();
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl(`${searchUrl}#companies`, FinesMciPaymentCategoryCriminalSearchComponent);
  });

  const enterCompanyCriteria = () => {
    component['form'].patchValue({
      fsa_search_account_companies_search_criteria: {
        fsa_search_account_companies_company_name: 'Acme Ltd',
        fsa_search_account_companies_include_aliases: true,
      },
    });
    store.setCriminalSearch({
      activeTab: 'companies',
      searchCriteriaCannotBeCombined: false,
      formData: component['form'].getRawValue(),
    });
    harness.detectChanges();
  };

  afterEach(() => confirmSpy.mockRestore());

  const clickCancel = async () => {
    (harness.routeNativeElement!.querySelector('a.govuk-link') as HTMLAnchorElement).click();
    await harness.fixture.whenStable();
  };

  it('navigates from Payment Category to criminal search relative to the till', async () => {
    const category = await harness.navigateByUrl(
      `${routeRoot}/payment-category`,
      FinesMciCreateTillPaymentCategoryComponent,
    );

    category.handleSubmit({ formData: { paymentCategory: 'criminal' }, nestedFlow: false });
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(searchUrl);
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(FinesMciPaymentCategoryCriminalSearchComponent);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('returns from Payment Category to till details using the same parent route', async () => {
    const category = await harness.navigateByUrl(
      `${routeRoot}/payment-category`,
      FinesMciCreateTillPaymentCategoryComponent,
    );

    category.handleCancel();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(detailsUrl);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['individuals', 'ArrowRight', 'companies'],
    ['companies', 'ArrowLeft', 'individuals'],
    ['individuals', 'ArrowLeft', 'companies'],
    ['companies', 'ArrowRight', 'individuals'],
    ['companies', 'Home', 'individuals'],
    ['individuals', 'End', 'companies'],
    ['individuals', 'Enter', 'individuals'],
    ['companies', ' ', 'companies'],
  ] as const)('activates %s with %s and renders the %s panel', async (initialTab, key, expectedTab) => {
    await harness.navigateByUrl(`${searchUrl}#${initialTab}`, FinesMciPaymentCategoryCriminalSearchComponent);
    const element = harness.routeNativeElement!;
    const initialTabLink = element.querySelector<HTMLAnchorElement>(`#tab-${initialTab}`)!;
    initialTabLink.focus();
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

    initialTabLink.dispatchEvent(event);
    await harness.fixture.whenStable();
    harness.detectChanges();

    const selectedTab = element.querySelector<HTMLAnchorElement>(`#tab-${expectedTab}`)!;
    const otherTab = expectedTab === 'individuals' ? 'companies' : 'individuals';
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(selectedTab);
    expect(TestBed.inject(Router).url).toBe(`${searchUrl}#${expectedTab}`);
    expect(selectedTab.getAttribute('aria-selected')).toBe('true');
    expect(selectedTab.getAttribute('tabindex')).toBe('0');
    expect(element.querySelector(`#tab-${otherTab}`)?.getAttribute('tabindex')).toBe('-1');
    expect(element.querySelector(`#${expectedTab}[role="tabpanel"]`)).not.toBeNull();
    expect(element.querySelector(`#${otherTab}[role="tabpanel"]`)).toBeNull();
    expect(
      element.querySelector(
        expectedTab === 'companies'
          ? '#fsa_search_account_companies_company_name'
          : '#fsa_search_account_individuals_last_name',
      ),
    ).not.toBeNull();
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('leaves Tab navigation and arrow keys in search inputs to the browser', () => {
    const element = harness.routeNativeElement!;
    const tabLink = element.querySelector<HTMLAnchorElement>('#tab-companies')!;
    const nameInput = element.querySelector<HTMLInputElement>('#fsa_search_account_companies_company_name')!;
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    const inputEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true });
    tabLink.focus();
    tabLink.dispatchEvent(tabEvent);
    nameInput.focus();
    nameInput.dispatchEvent(inputEvent);

    expect(tabEvent.defaultPrevented).toBe(false);
    expect(inputEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(nameInput);
    expect(TestBed.inject(Router).url).toBe(`${searchUrl}#companies`);
  });

  it('returns directly to till details without a warning when no inputs are populated', async () => {
    store.setDraftJourney('criminal');
    await clickCancel();

    expect(TestBed.inject(Router).url).toBe(detailsUrl);
    expect(store.draftJourney()).toBeNull();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('retains the form, selected tab and stored criteria when leaving is declined', async () => {
    store.setDraftJourney('criminal');
    enterCompanyCriteria();
    const criteria = store.criminalSearch();
    const values = component['form'].getRawValue();

    await clickCancel();

    expect(confirmSpy).toHaveBeenCalledExactlyOnceWith(
      'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.',
    );
    expect(TestBed.inject(Router).url).toBe(`${searchUrl}#companies`);
    expect(component['activeTab']()).toBe('companies');
    expect(component['form'].getRawValue()).toEqual(values);
    expect(store.criminalSearch()).toEqual(criteria);
    expect(store.draftJourney()).toBe('criminal');
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('clears form and stored search data after confirmed departure while preserving the business unit and till', async () => {
    store.setDraftJourney('criminal');
    enterCompanyCriteria();
    confirmSpy.mockReturnValue(true);
    const businessUnit = store.businessUnit();
    const tills = store.tills();

    await clickCancel();

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(detailsUrl);
    expect(store.criminalSearch()).toBeNull();
    expect(store.draftJourney()).toBeNull();
    expect(
      component['form'].get('fsa_search_account_companies_search_criteria.fsa_search_account_companies_company_name')
        ?.value,
    ).toBeNull();
    expect(store.businessUnit()).toEqual(businessUnit);
    expect(store.tills()).toEqual(tills);
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('allows a search to reach matches without a warning or clearing the submitted criteria', async () => {
    store.setDraftJourney('criminal');
    enterCompanyCriteria();

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(matchesUrl);
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(service.getDefendantAccounts).toHaveBeenCalledOnce();
    expect(store.draftJourney()).toBe('criminal');
    expect(
      store.criminalSearch()?.formData.fsa_search_account_companies_search_criteria
        .fsa_search_account_companies_company_name,
    ).toBe('Acme Ltd');
  });

  it('preserves the category draft when returning to Payment Category after declining Cancel', async () => {
    store.setDraftJourney('criminal');
    enterCompanyCriteria();
    await clickCancel();
    expect(store.draftJourney()).toBe('criminal');
    expect(TestBed.inject(Router).url).toBe(`${searchUrl}#companies`);

    confirmSpy.mockReturnValue(true);
    await harness.navigateByUrl(`${routeRoot}/payment-category`, FinesMciCreateTillPaymentCategoryComponent);

    expect(store.draftJourney()).toBe('criminal');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('#paymentCategory')?.checked).toBe(true);
  });

  it.each(['individuals', 'companies'] as const)(
    'starts a blank Criminal search after abandoning %s results',
    async (tab) => {
      component = await harness.navigateByUrl(`${searchUrl}#${tab}`, FinesMciPaymentCategoryCriminalSearchComponent);
      const emptyFormData = component.form.getRawValue();
      const businessUnit = store.businessUnit();
      const tills = store.tills();
      component.form.patchValue(
        tab === 'individuals'
          ? {
              fsa_search_account_individuals_search_criteria: {
                fsa_search_account_individuals_last_name: 'Smith',
                fsa_search_account_individuals_last_name_exact_match: true,
                fsa_search_account_individuals_include_aliases: true,
              },
            }
          : {
              fsa_search_account_companies_search_criteria: {
                fsa_search_account_companies_company_name: 'Acme Ltd',
                fsa_search_account_companies_company_name_exact_match: true,
                fsa_search_account_companies_include_aliases: true,
              },
            },
      );
      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
      await harness.fixture.whenStable();
      expect(TestBed.inject(Router).url).toBe(matchesUrl);
      expect(store.criminalSearch()?.activeTab).toBe(tab);

      await harness.navigateByUrl(detailsUrl, TillDetailsDestinationComponent);
      const category = await harness.navigateByUrl(
        `${routeRoot}/payment-category`,
        FinesMciCreateTillPaymentCategoryComponent,
      );
      category.handleSubmit({ formData: { paymentCategory: 'criminal' }, nestedFlow: false });
      await harness.fixture.whenStable();
      harness.detectChanges();
      await harness.fixture.whenStable();

      const search = harness.routeDebugElement!.componentInstance as FinesMciPaymentCategoryCriminalSearchComponent;
      expect(TestBed.inject(Router).url).toBe(`${searchUrl}#individuals`);
      expect(search.form.getRawValue()).toEqual(emptyFormData);
      expect(search['activeTab']()).toBe('individuals');
      expect(store.criminalSearch()).toBeNull();
      expect(store.draftJourney()).toBe('criminal');
      expect(store.businessUnit()).toEqual(businessUnit);
      expect(store.tills()).toEqual(tills);
      expect(service.getDefendantAccounts).toHaveBeenCalledOnce();
      expect(confirmSpy).not.toHaveBeenCalled();
    },
  );

  it('ignores repeated Search while a request is pending and retains criteria for returning to search', async () => {
    enterCompanyCriteria();
    const response = new Subject<IOpalFinesDefendantAccountResponse>();
    service.getDefendantAccounts.mockReturnValueOnce(response);
    const submittedCriteria = component.form.getRawValue();
    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(service.getDefendantAccounts).toHaveBeenCalledOnce();
    const preventDefault = vi.fn();

    component.handleFormSubmit({ preventDefault } as unknown as SubmitEvent);

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(service.getDefendantAccounts).toHaveBeenCalledOnce();
    expect(confirmSpy).not.toHaveBeenCalled();

    response.next({ count: 1, defendant_accounts: [] });
    response.complete();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(matchesUrl);
    expect(store.criminalSearch()?.formData).toEqual(submittedCriteria);
    expect(confirmSpy).not.toHaveBeenCalled();

    const search = await harness.navigateByUrl(
      `${searchUrl}#companies`,
      FinesMciPaymentCategoryCriminalSearchComponent,
    );
    expect(search.form.getRawValue()).toEqual(submittedCriteria);
    expect(search['activeTab']()).toBe('companies');
  });

  it('allows retry when the pending resolver completes without results', async () => {
    enterCompanyCriteria();
    const response = new Subject<IOpalFinesDefendantAccountResponse>();
    service.getDefendantAccounts.mockReturnValueOnce(response);
    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await new Promise((resolve) => setTimeout(resolve, 0));

    response.complete();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(`${searchUrl}#companies`);
    expect(component.canDeactivate()).toBe(false);

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await harness.fixture.whenStable();

    expect(service.getDefendantAccounts).toHaveBeenCalledTimes(2);
    expect(TestBed.inject(Router).url).toBe(matchesUrl);
    expect(store.criminalSearch()?.activeTab).toBe('companies');
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('retains submitted criteria when returning directly from matches to amend the search', async () => {
    enterCompanyCriteria();
    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(matchesUrl);
    const submittedSearch = store.criminalSearch();

    const search = await harness.navigateByUrl(
      `${searchUrl}#companies`,
      FinesMciPaymentCategoryCriminalSearchComponent,
    );

    expect(search.form.getRawValue()).toEqual(submittedSearch?.formData);
    expect(search['activeTab']()).toBe('companies');
    expect(store.criminalSearch()).toEqual(submittedSearch);
    expect(service.getDefendantAccounts).toHaveBeenCalledOnce();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it.each(['individuals', 'companies'] as const)(
    'restores submitted %s inputs and the active tab when clicking Search again',
    async (tab) => {
      component = await harness.navigateByUrl(`${searchUrl}#${tab}`, FinesMciPaymentCategoryCriminalSearchComponent);
      const businessUnit = store.businessUnit();
      const tills = store.tills();
      store.setDraftJourney('criminal');
      component.form.patchValue(
        tab === 'individuals'
          ? {
              fsa_search_account_individuals_search_criteria: {
                fsa_search_account_individuals_last_name: 'Example',
                fsa_search_account_individuals_first_names: 'Test',
                fsa_search_account_individuals_last_name_exact_match: true,
                fsa_search_account_individuals_first_names_exact_match: true,
                fsa_search_account_individuals_include_aliases: true,
              },
            }
          : {
              fsa_search_account_companies_search_criteria: {
                fsa_search_account_companies_company_name: 'Example Ltd',
                fsa_search_account_companies_company_name_exact_match: true,
                fsa_search_account_companies_include_aliases: true,
              },
            },
      );
      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(store.criminalSearch()).not.toBeNull();
      const submittedSearch = store.criminalSearch();
      const searchResults = store.criminalSearchResults();

      const searchAgainLink = [...harness.routeNativeElement!.querySelectorAll('a')].find(
        (link) => link.textContent?.trim() === 'Search again',
      )!;
      searchAgainLink.click();
      await harness.fixture.whenStable();
      harness.detectChanges();

      const search = harness.routeDebugElement!.componentInstance as FinesMciPaymentCategoryCriminalSearchComponent;
      expect(TestBed.inject(Router).url).toBe(`${searchUrl}#${tab}`);
      expect(search.form.getRawValue()).toEqual(submittedSearch?.formData);
      expect(search['activeTab']()).toBe(tab);
      expect(store.criminalSearch()).toEqual(submittedSearch);
      expect(store.criminalSearchResults()).toEqual(searchResults);
      expect(store.selectedCriminalAccount()).toBeNull();
      expect(store.businessUnit()).toEqual(businessUnit);
      expect(store.tills()).toEqual(tills);
      expect(store.draftJourney()).toBe('criminal');
      expect(service.getDefendantAccounts).toHaveBeenCalledOnce();
    },
  );
});
