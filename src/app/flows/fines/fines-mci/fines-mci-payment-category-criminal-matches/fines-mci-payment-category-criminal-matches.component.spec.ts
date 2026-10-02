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

  it.each([
    ['no-matches', 'No matching criminal accounts', 'PO-3528'],
    ['too-many', 'More than 100 matching criminal accounts', 'PO-3528'],
    ['search-criteria-cannot-be-combined', 'Search criteria cannot be combined', 'PO-3529'],
  ])('should render placeholder content for %s', (results, heading, ticket) => {
    queryParamSubject.next({ results });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Avon and Somerset');
    expect(text).toContain(heading);
    expect(text).toContain(ticket);
  });

  it('should render matching criminal accounts by default', () => {
    queryParamSubject.next({ results: 'unknown' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Search results');
    expect(fixture.nativeElement.textContent).toContain('Select 1 account to continue');
  });

  it('should store the selected criminal account when a row is selected', () => {
    const secondAccountCheckbox = fixture.nativeElement.querySelector(
      '#fines-mci-criminal-account-2',
    ) as HTMLInputElement;

    secondAccountCheckbox.click();
    fixture.detectChanges();

    expect(finesMciStore.selectedCriminalAccount()).toEqual(
      OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[1],
    );
  });
});
