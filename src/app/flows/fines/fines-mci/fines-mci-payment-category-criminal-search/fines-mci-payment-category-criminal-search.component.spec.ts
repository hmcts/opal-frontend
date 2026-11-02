import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationExtras, provideRouter, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { BehaviorSubject, of } from 'rxjs';
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
  let mockOpalFines: { getDefendantAccounts: ReturnType<typeof vi.fn> };
  let fragmentSubject: BehaviorSubject<string | null>;
  let routerNavigateSpy: ReturnType<typeof vi.fn<(_: readonly unknown[], __?: NavigationExtras) => Promise<boolean>>>;

  beforeEach(async () => {
    mockOpalFines = {
      getDefendantAccounts: vi.fn().mockReturnValue(of({ count: 1, defendant_accounts: [] })),
    };
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
        { provide: OpalFines, useValue: mockOpalFines },
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
    expect(fixture.nativeElement.querySelector('a.govuk-link')?.getAttribute('href')).toBe('/fines/dashboard/finance');
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
    expect(mockOpalFines.getDefendantAccounts).toHaveBeenCalledWith(
      expect.objectContaining({
        business_unit_ids: [businessUnit.business_unit_id],
        reference_number: expect.objectContaining({ account_number: '12345678' }),
      }),
    );
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

  it('should search individual defendant accounts and navigate to the matches results page when results are returned', () => {
    routerNavigateSpy.mockClear();
    component['form'].patchValue({
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Smith',
        fsa_search_account_individuals_first_names: 'John',
        fsa_search_account_individuals_include_aliases: true,
      },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(mockOpalFines.getDefendantAccounts).toHaveBeenCalledWith(
      expect.objectContaining({
        business_unit_ids: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id],
        reference_number: null,
        defendant: expect.objectContaining({
          surname: 'Smith',
          forenames: 'John',
          include_aliases: true,
          organisation: false,
        }),
        active_accounts_only: true,
      }),
    );
    expect(routerNavigateSpy).toHaveBeenCalledWith(CRIMINAL_MATCHES_ROUTE, {
      queryParams: {
        results: 'matches',
      },
    });
  });

  it('should search company defendant accounts from the companies tab', () => {
    routerNavigateSpy.mockClear();
    fragmentSubject.next('companies');
    component['form'].patchValue({
      fsa_search_account_companies_search_criteria: {
        fsa_search_account_companies_company_name: 'Acme Ltd',
        fsa_search_account_companies_company_name_exact_match: true,
      },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(mockOpalFines.getDefendantAccounts).toHaveBeenCalledWith(
      expect.objectContaining({
        business_unit_ids: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_id],
        reference_number: null,
        defendant: expect.objectContaining({
          organisation_name: 'Acme Ltd',
          exact_match_organisation_name: true,
          organisation: true,
        }),
        active_accounts_only: true,
      }),
    );
    expect(routerNavigateSpy).toHaveBeenCalledWith(CRIMINAL_MATCHES_ROUTE, {
      queryParams: {
        results: 'matches',
      },
    });
  });

  it('should navigate to the no matches results page when the search returns no results', () => {
    routerNavigateSpy.mockClear();
    mockOpalFines.getDefendantAccounts.mockReturnValue(of({ count: 0, defendant_accounts: [] }));
    component['form'].patchValue({
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Smith',
      },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(routerNavigateSpy).toHaveBeenCalledWith(CRIMINAL_MATCHES_ROUTE, {
      queryParams: {
        results: 'no-matches',
      },
    });
  });

  it('should navigate to the too many matches results page when the search returns more than 100 results', () => {
    routerNavigateSpy.mockClear();
    mockOpalFines.getDefendantAccounts.mockReturnValue(of({ count: 101, defendant_accounts: [] }));
    component['form'].patchValue({
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Smith',
      },
    });

    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(routerNavigateSpy).toHaveBeenCalledWith(CRIMINAL_MATCHES_ROUTE, {
      queryParams: {
        results: 'too-many',
      },
    });
  });

  it('should navigate to the search criteria cannot be combined results page when account number and account information are entered together', () => {
    const preventDefault = vi.fn();
    routerNavigateSpy.mockClear();
    component['form'].patchValue({
      fsa_search_account_number: '12345678',
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: 'Smith',
      },
    });

    component.handleFormSubmit({ preventDefault } as unknown as SubmitEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(mockOpalFines.getDefendantAccounts).not.toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(CRIMINAL_MATCHES_ROUTE, {
      queryParams: {
        results: 'search-criteria-cannot-be-combined',
      },
    });
  });

  it('should not search when the form is empty', () => {
    routerNavigateSpy.mockClear();
    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(mockOpalFines.getDefendantAccounts).not.toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });
});
