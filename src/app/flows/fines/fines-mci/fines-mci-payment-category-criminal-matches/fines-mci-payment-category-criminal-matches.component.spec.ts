import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getState } from '@ngrx/signals';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { BehaviorSubject, EMPTY, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesMciCriminalAccountsResult } from '../interfaces/fines-mci-criminal-accounts-result.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { IFinesMciCriminalSearch } from '../stores/interfaces/fines-mci-criminal-search.interface';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from './fines-mci-payment-category-criminal-matches.component';
import { IFinesMciCriminalAccount } from '../interfaces/fines-mci-criminal-account.interface';
import { RouterTestingHarness } from '@angular/router/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesMciPaymentCategoryCriminalAccountComponent } from '../fines-mci-payment-category-criminal-account/fines-mci-payment-category-criminal-account.component';

describe('FinesMciPaymentCategoryCriminalMatchesComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalMatchesComponent>;
  let routeDataSubject: BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>;
  let finesMciStore: InstanceType<typeof FinesMciStore>;
  const criminalSearchPath = '/fines/manual-cash-input/create/till/payment/category/criminal/search';
  let opalFines: {
    clearCache: ReturnType<typeof vi.fn>;
    getDefendantAccountAtAGlance: ReturnType<typeof vi.fn>;
    getDefendantAccountHeadingData: ReturnType<typeof vi.fn>;
  };
  let navigateSpy: MockInstance<Router['navigate']>;
  let scrollToTopSpy: MockInstance<UtilsService['scrollToTop']>;
  const submittedSearch: IFinesMciCriminalSearch = {
    activeTab: 'individuals',
    searchCriteriaCannotBeCombined: false,
    formData: {
      fsa_search_account_number: '12345678',
      fsa_search_account_individuals_search_criteria: {
        fsa_search_account_individuals_last_name: null,
        fsa_search_account_individuals_first_names: null,
        fsa_search_account_individuals_last_name_exact_match: false,
        fsa_search_account_individuals_first_names_exact_match: false,
        fsa_search_account_individuals_include_aliases: false,
      },
      fsa_search_account_companies_search_criteria: {
        fsa_search_account_companies_company_name: null,
        fsa_search_account_companies_company_name_exact_match: false,
        fsa_search_account_companies_include_aliases: false,
      },
    },
  };

  beforeEach(async () => {
    opalFines = {
      clearCache: vi.fn(),
      getDefendantAccountHeadingData: vi.fn().mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK)),
      getDefendantAccountAtAGlance: vi.fn().mockReturnValue(of(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK)),
    };
    routeDataSubject = new BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>({
      criminalAccounts: { results: 'matches', response: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK },
    });

    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalMatchesComponent],
      providers: [
        provideRouter([]),
        { provide: OpalFines, useValue: opalFines },
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeDataSubject.asObservable(),
            parent: {},
          },
        },
      ],
    }).compileComponents();
    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    scrollToTopSpy = vi.spyOn(TestBed.inject(UtilsService), 'scrollToTop').mockImplementation(() => {});

    finesMciStore = TestBed.inject(FinesMciStore);
    finesMciStore.resetCriminalSearch();
    finesMciStore.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalMatchesComponent);
    fixture.detectChanges();
  });

  it('should render matching criminal accounts as selectable search results', () => {
    const text = fixture.nativeElement.textContent;
    const accountCheckboxes = fixture.nativeElement.querySelectorAll('input[name="fines-mci-criminal-account"]');

    expect(text).toContain(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name);
    expect(text).toContain('Search results');
    expect(text).toContain('Select 1 account to continue');
    expect(text).toContain('130001BU');
    expect(text).toContain('SMITH_1, John Michael_1');
    expect(text).toContain('1 High Street');
    expect(text).toContain('BWTD');
    expect(text).toContain('Continue');
    expect(text).toContain('Search again');
    expect(text).toContain('Cancel');
    expect(accountCheckboxes.length).toBe(30);
    const accountLink = fixture.nativeElement.querySelector('#criminalAccountNumber a') as HTMLAnchorElement;
    expect(accountLink.getAttribute('href')).toBe('/fines/account/defendant/1/details');
    expect(accountLink.target).toBe('_blank');
    expect(accountLink.rel).toBe('noopener noreferrer');
    expect(finesMciStore.criminalSearchResults()).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    const searchAgainLink = [...fixture.nativeElement.querySelectorAll('a')].find(
      (link) => link.textContent?.trim() === 'Search again',
    ) as HTMLAnchorElement;
    expect(searchAgainLink.getAttribute('href')).toBe(
      '/fines/manual-cash-input/create/till/payment/category/criminal/search#individuals',
    );
  });

  it('should render the supplied individual response fields and sort aliases by alias number', () => {
    const account: IFinesMciCriminalAccount = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: '9007199254740993',
      organisation: false,
      organisation_flag: true,
      defendant_surname: 'Example',
      defendant_firstnames: 'Test',
      birth_date: '2001-01-02',
      account_balance: 0,
      has_collection_order: true,
      last_enforcement_action: 'bwtd',
      aliases: [
        { alias_number: 2, surname: 'SECOND', forenames: 'Alias', organisation_name: null },
        { alias_number: 1, surname: 'FIRST', forenames: 'Alias', organisation_name: null },
      ],
    };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('#criminalAccountName')?.textContent?.trim()).toBe('EXAMPLE, Test');
    expect(element.querySelector('#criminalAccountDateOfBirth')?.textContent?.trim()).toBe('02 Jan 2001');
    expect(element.querySelector('#criminalAccountBalance')?.textContent).toContain('\u00a30.00');
    expect(element.querySelector('#criminalAccountEnf')?.textContent?.trim()).toBe('BWTD');
    expect(element.querySelector('#criminalAccountCo')?.textContent?.trim()).toBe('Y');
    expect(
      [...element.querySelectorAll('#criminalAccountAliases div')].map((alias) => alias.textContent?.trim()),
    ).toEqual(['FIRST, Alias', 'SECOND, Alias']);
    expect(account.aliases?.map((alias) => alias.alias_number)).toEqual([2, 1]);
    expect(element.querySelector('#criminalAccountNumber a')?.getAttribute('href')).toBe(
      '/fines/account/defendant/9007199254740993/details',
    );

    (element.querySelector('#fines-mci-criminal-account-9007199254740993') as HTMLInputElement).click();
    fixture.detectChanges();
    (element.querySelector('button.govuk-button') as HTMLButtonElement).click();
    expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledExactlyOnceWith('9007199254740993');
    expect(navigateSpy).toHaveBeenCalledExactlyOnceWith(['account', '9007199254740993', 'individual'], {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
  });

  it('should display company names, company aliases in sequence, and an em dash for company birth dates', () => {
    const account: IFinesMciCriminalAccount = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      organisation_flag: undefined,
      defendant_account_id: '99000000000010',
      organisation: true,
      organisation_name: 'Example Ltd',
      birth_date: '2001-01-02',
      has_collection_order: false,
      aliases: [
        { alias_number: 2, organisation_name: 'Second Ltd', surname: null, forenames: null },
        { alias_number: 1, organisation_name: 'First Ltd', surname: null, forenames: null },
      ],
    };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('#criminalAccountName')?.textContent?.trim()).toBe('Example Ltd');
    expect(element.querySelector('#criminalAccountDateOfBirth')?.textContent).toContain('\u2014');
    expect(element.querySelector('#criminalAccountCo')?.textContent).toContain('\u2014');
    expect(
      [...element.querySelectorAll('#criminalAccountAliases div')].map((alias) => alias.textContent?.trim()),
    ).toEqual(['First Ltd', 'Second Ltd']);
    (element.querySelector('#fines-mci-criminal-account-99000000000010') as HTMLInputElement).click();
    fixture.detectChanges();
    (element.querySelector('button.govuk-button') as HTMLButtonElement).click();
    expect(navigateSpy).toHaveBeenCalledExactlyOnceWith(['account', '99000000000010', 'company'], {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
  });

  it.each([null, []])('should display an em dash when there are no aliases: %s', (aliases) => {
    const account = { ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0], aliases };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#criminalAccountAliases').textContent).toContain('\u2014');
  });

  it.each([
    { description: 'no name', surname: null, firstnames: null, expectedName: '\u2014' },
    { description: 'a surname only', surname: 'Example', firstnames: null, expectedName: 'EXAMPLE' },
    { description: 'first names only', surname: null, firstnames: 'Test', expectedName: 'Test' },
  ])('should display $description without an unnecessary comma', ({ surname, firstnames, expectedName }) => {
    const account = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_surname: surname,
      defendant_firstnames: firstnames,
    };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#criminalAccountName').textContent.trim()).toBe(expectedName);
  });

  it('should place unnumbered aliases last and display partial names without unnecessary commas', () => {
    const account: IFinesMciCriminalAccount = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      aliases: [
        { alias_number: null, surname: null, forenames: 'First names only', organisation_name: null },
        { alias_number: 2, surname: 'SECOND', forenames: null, organisation_name: null },
        { alias_number: null, surname: 'LAST', forenames: 'Alias', organisation_name: null },
        { alias_number: 1, surname: 'FIRST', forenames: 'Alias', organisation_name: null },
      ],
    };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();

    const aliases = fixture.nativeElement.querySelectorAll('#criminalAccountAliases div') as NodeListOf<HTMLElement>;
    expect([...aliases].map((alias) => alias.textContent?.trim())).toEqual([
      'FIRST, Alias',
      'SECOND',
      'First names only',
      'LAST, Alias',
    ]);
    expect(account.aliases?.map((alias) => alias.alias_number)).toEqual([null, 2, null, 1]);
  });

  it('should display an em dash when alias records contain no names', () => {
    const account: IFinesMciCriminalAccount = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      aliases: [{ alias_number: 1, surname: null, forenames: null, organisation_name: null }],
    };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#criminalAccountAliases').textContent).toContain('\u2014');
  });

  it('should ignore checkbox changes for an account without an ID', () => {
    const account: IFinesMciCriminalAccount = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: null,
    };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance['selectedAccountIds']()).toEqual([]);
    expect(finesMciStore.selectedCriminalAccount()).toBeNull();
    expect(fixture.nativeElement.querySelector('#criminalAccountNumber a')).toBeNull();
    expect(opalFines.getDefendantAccountAtAGlance).not.toHaveBeenCalled();
  });

  it('should return to criminal search when Back is clicked', () => {
    (fixture.nativeElement.querySelector('.govuk-back-link') as HTMLAnchorElement).click();

    expect(navigateSpy).toHaveBeenCalledExactlyOnceWith([
      '/',
      'fines',
      'manual-cash-input',
      'create',
      'till',
      'payment',
      'category',
      'criminal',
      'search',
    ]);
  });

  it.each(['at-a-glance', 'header-summary'] as const)(
    'should preserve Back navigation when %s finishes while navigation to search is pending',
    async (pendingRequest) => {
      finesMciStore.setDraftJourney('criminal');
      finesMciStore.setCriminalSearch(submittedSearch);
      finesMciStore.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
      const atAGlance = new Subject<IOpalFinesAccountDefendantAtAGlance>();
      const header = new Subject<typeof FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK>();
      opalFines.getDefendantAccountAtAGlance.mockReturnValue(atAGlance);
      opalFines.getDefendantAccountHeadingData.mockReturnValue(header);
      fixture.detectChanges();
      (fixture.nativeElement.querySelector('#fines-mci-criminal-account-1') as HTMLInputElement).click();
      fixture.detectChanges();
      (fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).click();

      if (pendingRequest === 'at-a-glance') {
        header.next(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
        header.complete();
      } else {
        atAGlance.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
        atAGlance.complete();
      }
      const stateBeforeBack = getState(finesMciStore);
      let completeBackNavigation!: (result: boolean) => void;
      navigateSpy.mockReturnValueOnce(new Promise<boolean>((resolve) => (completeBackNavigation = resolve)));

      (fixture.nativeElement.querySelector('.govuk-back-link') as HTMLAnchorElement).click();
      if (pendingRequest === 'at-a-glance') {
        atAGlance.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
        atAGlance.complete();
      } else {
        header.next(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
        header.complete();
      }
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledExactlyOnceWith([
        '/',
        'fines',
        'manual-cash-input',
        'create',
        'till',
        'payment',
        'category',
        'criminal',
        'search',
      ]);
      expect(getState(finesMciStore)).toEqual({
        ...stateBeforeBack,
        selectedCriminalAccount: null,
        selectedCriminalAccountAtAGlance: null,
        selectedCriminalAccountHeader: null,
      });
      expect(fixture.componentInstance['isLoadingAccountDetails']()).toBe(false);
      expect(scrollToTopSpy).not.toHaveBeenCalled();

      completeBackNavigation(true);
      await fixture.whenStable();
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    },
  );

  it.each([true, false])(
    'should clear the cancelled draft and search only when Till Details navigation succeeds: %s',
    async (navigated) => {
      const tillId = finesMciStore.ensureTill();
      finesMciStore.addPayment(tillId, 'courtFee');
      finesMciStore.setDraftJourney('criminal');
      finesMciStore.setCriminalSearch(submittedSearch);
      finesMciStore.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
      finesMciStore.setSelectedCriminalAccount(
        OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      );
      finesMciStore.setSelectedCriminalAccountAtAGlance(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      finesMciStore.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
      fixture.detectChanges();
      const previousState = getState(finesMciStore);
      let completeNavigation!: (result: boolean) => void;
      navigateSpy.mockReturnValueOnce(new Promise<boolean>((resolve) => (completeNavigation = resolve)));

      (fixture.nativeElement.querySelector('opal-lib-govuk-cancel-link a') as HTMLAnchorElement).click();

      expect(navigateSpy).toHaveBeenCalledExactlyOnceWith([
        '/',
        'fines',
        'manual-cash-input',
        'create',
        'till',
        'details',
      ]);
      expect(getState(finesMciStore)).toEqual(previousState);

      completeNavigation(navigated);
      await fixture.whenStable();

      expect(getState(finesMciStore)).toEqual(
        navigated
          ? {
              ...previousState,
              draftJourney: null,
              criminalSearch: null,
              criminalSearchResults: null,
              selectedCriminalAccount: null,
              selectedCriminalAccountAtAGlance: null,
              selectedCriminalAccountHeader: null,
            }
          : previousState,
      );
    },
  );

  it('should prevent an in-flight account response from redirecting after Cancel is clicked', async () => {
    const response = new Subject<IOpalFinesAccountDefendantAtAGlance>();
    opalFines.getDefendantAccountAtAGlance.mockReturnValue(response);
    (fixture.nativeElement.querySelector('#fines-mci-criminal-account-1') as HTMLInputElement).click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).click();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('opal-lib-govuk-cancel-link a') as HTMLAnchorElement).click();
    response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    response.complete();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledExactlyOnceWith([
      '/',
      'fines',
      'manual-cash-input',
      'create',
      'till',
      'details',
    ]);
    expect(finesMciStore.selectedCriminalAccountAtAGlance()).toBeNull();
    expect(fixture.componentInstance['isLoadingAccountDetails']()).toBe(false);
  });

  it('should display every account when exactly 100 results are returned', () => {
    const accounts = Array.from({ length: 100 }, (_, index) => ({
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: String(index + 1),
      account_number: `TEST${index + 1}`,
    }));
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 100, defendant_accounts: accounts } },
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('input[name="fines-mci-criminal-account"]').length).toBe(100);
  });

  it('should clear the previous selection and validation when resolved search results change', () => {
    const checkbox = fixture.nativeElement.querySelector('#fines-mci-criminal-account-1') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(finesMciStore.selectedCriminalAccount()).not.toBeNull();

    routeDataSubject.next({
      criminalAccounts: { results: 'no-matches', response: { count: 0, defendant_accounts: [] } },
    });
    fixture.detectChanges();

    expect(finesMciStore.selectedCriminalAccount()).toBeNull();
    expect(finesMciStore.criminalSearchResults()).toEqual({ count: 0, defendant_accounts: [] });

    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK },
    });
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('#fines-mci-criminal-account-1') as HTMLInputElement).checked).toBe(
      false,
    );
    expect(fixture.nativeElement.querySelector('.govuk-form-group--error')).toBeNull();
  });

  it('should render no matches content with a link back to the criminal search page', () => {
    routeDataSubject.next({
      criminalAccounts: { results: 'no-matches', response: { count: 0, defendant_accounts: [] } },
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement;

    expect(text).toContain(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name);
    expect(text).toContain('Search results');
    expect(text).toContain('There are no matching results');
    expect(text).toContain('Check your search');
    expect(text).toContain('and try again.');
    expect(text).not.toContain('Placeholder for PO-3528');
    expect(link.textContent?.trim()).toBe('Check your search');
    expect(link.getAttribute('href')).toBe(criminalSearchPath);
  });

  it('should render too many results content with a link back to the criminal search page', () => {
    routeDataSubject.next({
      criminalAccounts: { results: 'too-many', response: { count: 101, defendant_accounts: [] } },
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement;

    expect(text).toContain(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name);
    expect(text).toContain('Search results');
    expect(text).toContain('There are more than 100 results');
    expect(text).toContain('Try searching by account number or full name');
    expect(text).not.toContain('Placeholder for PO-3528');
    expect(link.textContent?.trim()).toBe('Try searching by account number or full name');
    expect(link.getAttribute('href')).toBe(criminalSearchPath);
  });

  it('should render the search criteria cannot be combined problem page with a link back to the criminal search page', () => {
    routeDataSubject.next({
      criminalAccounts: { results: 'search-criteria-cannot-be-combined', response: null },
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement;

    expect(text).toContain('There is a problem');
    expect(text).toContain(
      'Reference data and account information cannot be entered together when searching for an account. Search using either:',
    );
    expect(text).toContain('account number, or');
    expect(text).toContain('advanced search');
    expect(text).toContain('Go back');
    expect(fixture.nativeElement.querySelector('.govuk-caption-m')).toBeNull();
    expect(text).not.toContain('Search criteria cannot be combined');
    expect(text).not.toContain('PO-3529');
    expect(fixture.nativeElement.querySelector('opal-lib-govuk-back-link')).toBeNull();
    expect(link.textContent?.trim()).toBe('Go back');
    expect(link.getAttribute('href')).toBe(criminalSearchPath);
    expect(
      fixture.nativeElement.querySelector('app-fines-mci-payment-category-criminal-matches-table-wrapper'),
    ).toBeNull();
  });

  it('should show an error when continuing without selecting an account', () => {
    const continueButton = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;

    continueButton.focus();
    continueButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Select 1 account');
    expect(fixture.nativeElement.querySelector('.govuk-form-group--error')).not.toBeNull();
    const errorSummary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;
    expect(errorSummary.textContent).toContain('Select 1 account');
    expect(errorSummary.querySelector('[role="alert"]')).not.toBeNull();
    expect(document.activeElement).toBe(errorSummary);
    expect(scrollToTopSpy).toHaveBeenCalledOnce();
    expect(finesMciStore.selectedCriminalAccount()).toBeNull();
    expect(opalFines.getDefendantAccountAtAGlance).not.toHaveBeenCalled();
  });

  it('should show an error when continuing with more than one account selected', () => {
    const firstAccountCheckbox = fixture.nativeElement.querySelector(
      '#fines-mci-criminal-account-1',
    ) as HTMLInputElement;
    const secondAccountCheckbox = fixture.nativeElement.querySelector(
      '#fines-mci-criminal-account-2',
    ) as HTMLInputElement;
    const continueButton = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;

    firstAccountCheckbox.click();
    secondAccountCheckbox.click();
    fixture.detectChanges();

    continueButton.focus();
    continueButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Select only 1 account');
    expect(fixture.nativeElement.querySelector('.govuk-form-group--error')).not.toBeNull();
    const errorSummary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;
    expect(errorSummary.textContent).toContain('Select only 1 account');
    expect(document.activeElement).toBe(errorSummary);
    expect(scrollToTopSpy).toHaveBeenCalledOnce();
    expect(finesMciStore.selectedCriminalAccount()).toBeNull();
    expect(opalFines.getDefendantAccountAtAGlance).not.toHaveBeenCalled();
  });

  it('should focus the account selection from the summary link and refocus the summary on another invalid submission', () => {
    const continueButton = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;
    continueButton.click();
    fixture.detectChanges();

    const errorLink = fixture.nativeElement.querySelector('.govuk-error-summary__list a') as HTMLAnchorElement;
    errorLink.click();

    const legend = fixture.nativeElement.querySelector('legend') as HTMLLegendElement;
    expect(document.activeElement).toBe(legend);

    continueButton.focus();
    continueButton.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.govuk-error-summary'));
    expect(scrollToTopSpy).toHaveBeenCalledTimes(2);
  });

  it('should clear the selection error when an account selection changes', () => {
    const firstAccountCheckbox = fixture.nativeElement.querySelector(
      '#fines-mci-criminal-account-1',
    ) as HTMLInputElement;
    const continueButton = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;

    continueButton.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Select 1 account');

    firstAccountCheckbox.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Error: Select 1 account');
    expect(fixture.nativeElement.querySelector('.govuk-form-group--error')).toBeNull();
    expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
  });

  it('should store the selected criminal account when continuing with one account selected', () => {
    const secondAccountCheckbox = fixture.nativeElement.querySelector(
      '#fines-mci-criminal-account-2',
    ) as HTMLInputElement;
    const continueButton = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;

    secondAccountCheckbox.click();
    fixture.detectChanges();

    continueButton.click();
    fixture.detectChanges();

    expect(finesMciStore.selectedCriminalAccount()).toEqual(
      OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[1],
    );
    expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledExactlyOnceWith(2);
    expect(finesMciStore.selectedCriminalAccountAtAGlance()).toEqual(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
  });

  it('should not load or navigate to an account after the stored search results are cleared', () => {
    (fixture.nativeElement.querySelector('#fines-mci-criminal-account-1') as HTMLInputElement).click();
    fixture.detectChanges();
    finesMciStore.setCriminalSearchResults(null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('input[type="checkbox"]').length).toBe(0);
    (fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(opalFines.getDefendantAccountAtAGlance).not.toHaveBeenCalled();
    expect(opalFines.getDefendantAccountHeadingData).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(fixture.componentInstance['isLoadingAccountDetails']()).toBe(false);
    expect(finesMciStore.selectedCriminalAccount()).toBeNull();
  });

  it('should prevent duplicate requests while loading and store data only after success', () => {
    const response = new Subject<IOpalFinesAccountDefendantAtAGlance>();
    opalFines.getDefendantAccountAtAGlance.mockReturnValue(response);
    const checkbox = fixture.nativeElement.querySelector('#fines-mci-criminal-account-2') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;
    button.click();
    fixture.componentInstance['continue']();
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledExactlyOnceWith(2);
    expect(finesMciStore.selectedCriminalAccountAtAGlance()).toBeNull();

    response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    response.complete();
    fixture.detectChanges();

    expect(finesMciStore.selectedCriminalAccountAtAGlance()).toEqual(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
    expect(button.disabled).toBe(false);
    expect(navigateSpy).toHaveBeenCalledExactlyOnceWith(['account', 2, 'individual'], {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
  });

  it.each(['getDefendantAccountAtAGlance', 'getDefendantAccountHeadingData'] as const)(
    'should leave details empty when %s fails and allow retrying Continue',
    (method) => {
      opalFines[method].mockReturnValueOnce(throwError(() => new Error('Request failed')));
      (fixture.nativeElement.querySelector('#fines-mci-criminal-account-2') as HTMLInputElement).click();
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();

      expect(finesMciStore.selectedCriminalAccountAtAGlance()).toBeNull();
      expect(button.disabled).toBe(false);
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(scrollToTopSpy).toHaveBeenCalledOnce();

      button.click();
      fixture.detectChanges();
      expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledTimes(2);
      expect(finesMciStore.selectedCriminalAccountAtAGlance()).toEqual(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      expect(scrollToTopSpy).toHaveBeenCalledOnce();
    },
  );

  it.each(['selection change', 'search again', 'destroy'] as const)(
    'should discard an in-flight response after %s',
    (action) => {
      const response = new Subject<IOpalFinesAccountDefendantAtAGlance>();
      opalFines.getDefendantAccountAtAGlance.mockReturnValue(response);
      const checkbox = fixture.nativeElement.querySelector('#fines-mci-criminal-account-2') as HTMLInputElement;
      checkbox.click();
      fixture.detectChanges();
      (fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).click();
      fixture.detectChanges();

      if (action === 'selection change') {
        checkbox.click();
      } else if (action === 'search again') {
        fixture.componentInstance['handleSearchAgain']();
      } else {
        fixture.destroy();
      }
      response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      response.complete();

      expect(finesMciStore.selectedCriminalAccountAtAGlance()).toBeNull();
      expect(fixture.componentInstance['isLoadingAccountDetails']()).toBe(false);
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(scrollToTopSpy).not.toHaveBeenCalled();
    },
  );

  it('should scroll to the shared error banner if an API interceptor completes without returning account details', () => {
    opalFines.getDefendantAccountHeadingData.mockReturnValue(EMPTY);
    (fixture.nativeElement.querySelector('#fines-mci-criminal-account-2') as HTMLInputElement).click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(scrollToTopSpy).toHaveBeenCalledOnce();
    expect((fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).disabled).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should open the company account route after loading company details', () => {
    const account = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      organisation_flag: true,
    };
    routeDataSubject.next({
      criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
    });
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('#fines-mci-criminal-account-1') as HTMLInputElement).click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement).click();

    expect(navigateSpy).toHaveBeenCalledExactlyOnceWith(['account', 1, 'company'], {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
  });
});

describe('Criminal matches Continue navigation', () => {
  it('should redirect account 23456789A to its account placeholder after both detail requests succeed', async () => {
    const accountId = '99000000000002';
    const routeRoot = 'fines/manual-cash-input/create/till/payment/category/criminal';
    const account = {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0],
      defendant_account_id: accountId,
      account_number: '23456789A',
      organisation: false,
    };
    const atAGlance = new Subject<IOpalFinesAccountDefendantAtAGlance>();
    const header = new Subject<typeof FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK>();
    const opalFines = {
      clearCache: vi.fn(),
      getDefendantAccountAtAGlance: vi.fn().mockReturnValue(atAGlance),
      getDefendantAccountHeadingData: vi.fn().mockReturnValue(header),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: opalFines },
        provideRouter([
          {
            path: routeRoot,
            children: [
              {
                path: 'matches',
                component: FinesMciPaymentCategoryCriminalMatchesComponent,
                data: {
                  criminalAccounts: { results: 'matches', response: { count: 1, defendant_accounts: [account] } },
                },
              },
              { path: 'account/:accountId/:type', component: FinesMciPaymentCategoryCriminalAccountComponent },
            ],
          },
        ]),
      ],
    });
    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/${routeRoot}/matches`, FinesMciPaymentCategoryCriminalMatchesComponent);
    (harness.routeNativeElement!.querySelector(`#fines-mci-criminal-account-${accountId}`) as HTMLInputElement).click();
    harness.detectChanges();
    (harness.routeNativeElement!.querySelector('button.govuk-button') as HTMLButtonElement).click();

    expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledExactlyOnceWith(accountId);
    expect(opalFines.getDefendantAccountHeadingData).toHaveBeenCalledExactlyOnceWith(accountId);
    atAGlance.next({ ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK, defendant_account_id: accountId });
    atAGlance.complete();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(`/${routeRoot}/matches`);

    header.next({ ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK, defendant_account_id: accountId });
    header.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(TestBed.inject(Router).url).toBe(`/${routeRoot}/account/${accountId}/individual`);
    expect(harness.routeNativeElement?.textContent).toContain('Successful confirm account');
  });
});
