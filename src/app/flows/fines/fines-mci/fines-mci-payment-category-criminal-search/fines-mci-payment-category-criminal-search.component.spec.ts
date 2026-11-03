import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import axe from 'axe-core';
import { ActivatedRoute, NavigationExtras, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { BehaviorSubject, of } from 'rxjs';
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
    expect(fixture.nativeElement.querySelector('a.govuk-link')?.getAttribute('href')).toBe(
      '/fines/manual-cash-input/create/till/details',
    );
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

  it('should require confirmation again after a search navigation is cancelled', async () => {
    component['form'].patchValue({ fsa_search_account_number: '12345678' });
    routerNavigateSpy.mockResolvedValueOnce(false);

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await fixture.whenStable();

    expect(component.canDeactivate()).toBe(false);
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

  it('returns directly to till details without a warning when no inputs are populated', async () => {
    await clickCancel();

    expect(TestBed.inject(Router).url).toBe(detailsUrl);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('retains the form, selected tab and stored criteria when leaving is declined', async () => {
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
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('clears form and stored search data after confirmed departure while preserving the business unit and till', async () => {
    enterCompanyCriteria();
    confirmSpy.mockReturnValue(true);
    const businessUnit = store.businessUnit();
    const tills = store.tills();

    await clickCancel();

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(TestBed.inject(Router).url).toBe(detailsUrl);
    expect(store.criminalSearch()).toBeNull();
    expect(
      component['form'].get('fsa_search_account_companies_search_criteria.fsa_search_account_companies_company_name')
        ?.value,
    ).toBeNull();
    expect(store.businessUnit()).toEqual(businessUnit);
    expect(store.tills()).toEqual(tills);
    expect(service.getDefendantAccounts).not.toHaveBeenCalled();
  });

  it('allows a search to reach matches without a warning or clearing the submitted criteria', async () => {
    enterCompanyCriteria();

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(matchesUrl);
    expect(confirmSpy).not.toHaveBeenCalled();
    expect(service.getDefendantAccounts).toHaveBeenCalledOnce();
    expect(
      store.criminalSearch()?.formData.fsa_search_account_companies_search_criteria
        .fsa_search_account_companies_company_name,
    ).toBe('Acme Ltd');
  });
});
