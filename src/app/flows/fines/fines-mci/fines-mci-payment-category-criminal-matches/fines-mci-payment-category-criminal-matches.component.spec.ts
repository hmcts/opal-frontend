import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IFinesMciCriminalAccountsResult } from '../routing/resolvers/fines-mci-criminal-accounts/fines-mci-criminal-accounts.resolver';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from './fines-mci-payment-category-criminal-matches.component';

describe('FinesMciPaymentCategoryCriminalMatchesComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalMatchesComponent>;
  let routeDataSubject: BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>;
  let finesMciStore: InstanceType<typeof FinesMciStore>;
  const criminalSearchPath = '/fines/manual-cash-input/create/till/payment/category/criminal/search';

  beforeEach(async () => {
    routeDataSubject = new BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>({
      criminalAccounts: { results: 'matches', response: OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK },
    });

    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalMatchesComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeDataSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

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
    expect(finesMciStore.criminalSearchResults()).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    const searchAgainLink = [...fixture.nativeElement.querySelectorAll('a')].find(
      (link) => link.textContent?.trim() === 'Search again',
    ) as HTMLAnchorElement;
    expect(searchAgainLink.getAttribute('href')).toBe(
      '/fines/manual-cash-input/create/till/payment/category/criminal/search',
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
    expect(text).toContain('Try adding more information');
    expect(text).toContain('to your search.');
    expect(text).not.toContain('Placeholder for PO-3528');
    expect(link.textContent?.trim()).toBe('Try adding more information');
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
  });

  it('should show an error when continuing without selecting an account', () => {
    const continueButton = fixture.nativeElement.querySelector('button.govuk-button') as HTMLButtonElement;

    continueButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Select 1 account');
    expect(fixture.nativeElement.querySelector('.govuk-form-group--error')).not.toBeNull();
    expect(finesMciStore.selectedCriminalAccount()).toBeNull();
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
  });
});
