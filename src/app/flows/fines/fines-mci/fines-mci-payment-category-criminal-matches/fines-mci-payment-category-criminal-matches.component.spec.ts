import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { BehaviorSubject, EMPTY, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesMciCriminalAccountsResult } from '../interfaces/fines-mci-criminal-accounts-result.interface';
import { FinesMciCriminalSearchResults } from '../constants/fines-mci-criminal-search-results.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from './fines-mci-payment-category-criminal-matches.component';
import { IFinesMciCriminalAccount } from '../interfaces/fines-mci-criminal-account.interface';
import { RouterTestingHarness } from '@angular/router/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesMciPaymentCategoryCriminalAccountComponent } from '../fines-mci-payment-category-criminal-account/fines-mci-payment-category-criminal-account.component';

describe('FinesMciPaymentCategoryCriminalMatchesComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalMatchesComponent>;
  let routeDataSubject: BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>;
  let finesMciStore: InstanceType<typeof FinesMciStore>;
  let opalFines: {
    clearCache: ReturnType<typeof vi.fn>;
    getDefendantAccountAtAGlance: ReturnType<typeof vi.fn>;
    getDefendantAccountHeadingData: ReturnType<typeof vi.fn>;
  };
  let navigateSpy: MockInstance<Router['navigate']>;
  let scrollToTopSpy: MockInstance<UtilsService['scrollToTop']>;

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

  it.each([
    ['no-matches', 'No matching criminal accounts', 'PO-3528'],
    ['too-many', 'More than 100 matching criminal accounts', 'PO-3528'],
    ['search-criteria-cannot-be-combined', 'Search criteria cannot be combined', 'PO-3529'],
  ])('should render placeholder content for %s', (results, heading, ticket) => {
    routeDataSubject.next({ criminalAccounts: { results: results as FinesMciCriminalSearchResults, response: null } });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0].business_unit_name);
    expect(text).toContain(heading);
    expect(text).toContain(ticket);
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
