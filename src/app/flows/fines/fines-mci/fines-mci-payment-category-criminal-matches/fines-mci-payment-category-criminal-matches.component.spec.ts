import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesMciCriminalAccountsResult } from '../interfaces/fines-mci-criminal-accounts-result.interface';
import { FinesMciCriminalSearchResults } from '../constants/fines-mci-criminal-search-results.constant';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from './fines-mci-payment-category-criminal-matches.component';

describe('FinesMciPaymentCategoryCriminalMatchesComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalMatchesComponent>;
  let routeDataSubject: BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>;
  let finesMciStore: InstanceType<typeof FinesMciStore>;
  let opalFines: { clearCache: ReturnType<typeof vi.fn>; getDefendantAccountAtAGlance: ReturnType<typeof vi.fn> };
  let navigateSpy: MockInstance<Router['navigate']>;

  beforeEach(async () => {
    opalFines = {
      clearCache: vi.fn(),
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
  });

  it('should show an error when continuing without selecting an account', () => {
    const continueButton = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;

    continueButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Select 1 account');
    expect(fixture.nativeElement.querySelector('.govuk-form-group--error')).not.toBeNull();
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

    continueButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Select only 1 account');
    expect(fixture.nativeElement.querySelector('.govuk-form-group--error')).not.toBeNull();
    expect(finesMciStore.selectedCriminalAccount()).toBeNull();
    expect(opalFines.getDefendantAccountAtAGlance).not.toHaveBeenCalled();
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

  it('should leave details empty on failure and allow retrying Continue', () => {
    opalFines.getDefendantAccountAtAGlance.mockReturnValueOnce(throwError(() => new Error('Request failed')));
    (fixture.nativeElement.querySelector('#fines-mci-criminal-account-2') as HTMLInputElement).click();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(finesMciStore.selectedCriminalAccountAtAGlance()).toBeNull();
    expect(button.disabled).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();

    button.click();
    fixture.detectChanges();
    expect(opalFines.getDefendantAccountAtAGlance).toHaveBeenCalledTimes(2);
    expect(finesMciStore.selectedCriminalAccountAtAGlance()).toEqual(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
  });

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
        fixture.componentInstance['clearCriminalSearch']();
      } else {
        fixture.destroy();
      }
      response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      response.complete();

      expect(finesMciStore.selectedCriminalAccountAtAGlance()).toBeNull();
      expect(fixture.componentInstance['isLoadingAccountDetails']()).toBe(false);
      expect(navigateSpy).not.toHaveBeenCalled();
    },
  );

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
