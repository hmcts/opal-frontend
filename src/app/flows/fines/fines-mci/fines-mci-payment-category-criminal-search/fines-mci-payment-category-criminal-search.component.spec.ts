import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationExtras, provideRouter, Router } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciPaymentCategoryCriminalSearchComponent } from './fines-mci-payment-category-criminal-search.component';

const CRIMINAL_MATCHES_ROUTE = [
  '/',
  'fines',
  'manual-cash-input',
  'create',
  'till',
  'payment',
  'category',
  'criminal',
  'matches',
];

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

    component['setActiveTab']('companies', { preventDefault: vi.fn() } as unknown as Event);

    expect(routerNavigateSpy).toHaveBeenCalledWith([], {
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
        fsa_search_account_individuals_search_criteria: { fsa_search_account_individuals_last_name: 'Smith' },
        fsa_search_account_companies_search_criteria: { fsa_search_account_companies_company_name: 'Acme Ltd' },
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
      expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE);
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
    expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE);
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
      `${label} must only include letters a to z, hyphens, spaces and apostrophes`,
    );
    expect(fixture.nativeElement.textContent).toContain(
      `${label} must only include letters a to z, hyphens, spaces and apostrophes`,
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
      expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE);
    },
  );

  it.each([
    ['Acme\u00e9', 'Company Name must only include letters a to z, numbers, hyphens, spaces and apostrophes'],
    ['Acme\tLtd', 'Company Name must only include letters a to z, numbers, hyphens, spaces and apostrophes'],
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

  it.each(['fsa_search_account_companies_include_aliases', 'fsa_search_account_companies_company_name_exact_match'])(
    'should still require company name when %s is selected',
    (field) => {
      fragmentSubject.next('companies');
      routerNavigateSpy.mockClear();
      component['form'].patchValue({ fsa_search_account_companies_search_criteria: { [field]: true } });

      component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

      expect(component.formControlErrorMessages['fsa_search_account_companies_company_name']).toBe(
        'Enter company name',
      );
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
    expect(routerNavigateSpy).toHaveBeenCalledExactlyOnceWith(CRIMINAL_MATCHES_ROUTE);
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
