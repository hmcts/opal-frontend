import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationExtras, provideRouter, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { BehaviorSubject, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciPaymentCategoryCriminalSearchComponent } from './fines-mci-payment-category-criminal-search.component';

describe('FinesMciPaymentCategoryCriminalSearchComponent', () => {
  let component: FinesMciPaymentCategoryCriminalSearchComponent;
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalSearchComponent>;
  let mockOpalFines: { getDefendantAccounts: ReturnType<typeof vi.fn> };
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let fragmentSubject: BehaviorSubject<string | null>;
  let routerNavigateSpy: ReturnType<typeof vi.fn<(_: readonly unknown[], __?: NavigationExtras) => Promise<boolean>>>;

  beforeEach(async () => {
    mockOpalFines = {
      getDefendantAccounts: vi.fn().mockReturnValue(of({ count: 1, defendant_accounts: [] })),
    };
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
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

    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the stripped down criminal account search page', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Avon and Somerset');
    expect(text).toContain('Search for an account');
    expect(text).toContain('Quick search');
    expect(text).toContain('Advanced search');
    expect(text).toContain('Individuals');
    expect(text).toContain('Companies');
    expect(text).toContain('Cancel');
    expect(fixture.nativeElement.querySelector('a.govuk-link')?.getAttribute('href')).toBe('/fines/dashboard/finance');
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

  it('should search individual defendant accounts and log the response count', () => {
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
        business_unit_ids: [65, 66, 73, 77, 80, 78],
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
    expect(consoleLogSpy).toHaveBeenCalledWith('Manual cash input criminal account search response count', 1);
  });

  it('should search company defendant accounts from the companies tab', () => {
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
        business_unit_ids: [65, 66, 73, 77, 80, 78],
        reference_number: null,
        defendant: expect.objectContaining({
          organisation_name: 'Acme Ltd',
          exact_match_organisation_name: true,
          organisation: true,
        }),
        active_accounts_only: true,
      }),
    );
  });

  it('should not search when the form is empty', () => {
    component.handleFormSubmit({ preventDefault: vi.fn() } as unknown as SubmitEvent);

    expect(mockOpalFines.getDefendantAccounts).not.toHaveBeenCalled();
  });
});
