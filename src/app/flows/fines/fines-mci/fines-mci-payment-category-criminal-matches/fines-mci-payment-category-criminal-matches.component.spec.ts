import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { BehaviorSubject, map } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from './fines-mci-payment-category-criminal-matches.component';

describe('FinesMciPaymentCategoryCriminalMatchesComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalMatchesComponent>;
  let queryParamSubject: BehaviorSubject<Record<string, string>>;
  let finesMciStore: InstanceType<typeof FinesMciStore>;
  const criminalSearchPath = '/fines/manual-cash-input/create/till/payment/category/criminal/search';

  beforeEach(async () => {
    queryParamSubject = new BehaviorSubject<Record<string, string>>({ results: 'matches' });

    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalMatchesComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamSubject.pipe(map((queryParams) => convertToParamMap(queryParams))),
          },
        },
      ],
    }).compileComponents();

    finesMciStore = TestBed.inject(FinesMciStore);
    finesMciStore.resetCriminalSearch();
    finesMciStore.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);

    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalMatchesComponent);
    fixture.detectChanges();
  });

  it('should render matching criminal accounts as selectable search results', () => {
    const text = fixture.nativeElement.textContent;
    const accountCheckboxes = fixture.nativeElement.querySelectorAll('input[name="fines-mci-criminal-account"]');

    expect(text).toContain('Avon and Somerset');
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
  });

  it('should render no matches content with a link back to the criminal search page', () => {
    queryParamSubject.next({ results: 'no-matches' });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement;

    expect(text).toContain('Avon and Somerset');
    expect(text).toContain('Search results');
    expect(text).toContain('There are no matching results');
    expect(text).toContain('Check your search');
    expect(text).toContain('and try again.');
    expect(text).not.toContain('Placeholder for PO-3528');
    expect(link.textContent?.trim()).toBe('Check your search');
    expect(link.getAttribute('href')).toBe(criminalSearchPath);
  });

  it('should render too many results content with a link back to the criminal search page', () => {
    queryParamSubject.next({ results: 'too-many' });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement;

    expect(text).toContain('Avon and Somerset');
    expect(text).toContain('Search results');
    expect(text).toContain('There are more than 100 results');
    expect(text).toContain('Try adding more information');
    expect(text).toContain('to your search.');
    expect(text).not.toContain('Placeholder for PO-3528');
    expect(link.textContent?.trim()).toBe('Try adding more information');
    expect(link.getAttribute('href')).toBe(criminalSearchPath);
  });

  it('should render the search criteria cannot be combined problem page with a link back to the criminal search page', () => {
    queryParamSubject.next({ results: 'search-criteria-cannot-be-combined' });
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
    expect(text).not.toContain('Avon and Somerset');
    expect(text).not.toContain('Search criteria cannot be combined');
    expect(text).not.toContain('PO-3529');
    expect(fixture.nativeElement.querySelector('opal-lib-govuk-back-link')).toBeNull();
    expect(link.textContent?.trim()).toBe('Go back');
    expect(link.getAttribute('href')).toBe(criminalSearchPath);
  });

  it('should render matching criminal accounts by default', () => {
    queryParamSubject.next({ results: 'unknown' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Search results');
    expect(fixture.nativeElement.textContent).toContain('Select 1 account to continue');
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
