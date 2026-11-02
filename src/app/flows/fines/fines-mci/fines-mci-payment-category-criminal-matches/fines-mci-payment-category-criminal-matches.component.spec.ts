import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  FINES_MCI_CRIMINAL_SEARCH_RESULTS,
  FinesMciCriminalSearchResults,
} from '../constants/fines-mci-criminal-search-results.constant';
import { IFinesMciCriminalAccountsResult } from '../routing/resolvers/fines-mci-criminal-accounts/fines-mci-criminal-accounts.resolver';
import { FinesMciStore } from '../stores/fines-mci.store';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciPaymentCategoryCriminalMatchesComponent } from './fines-mci-payment-category-criminal-matches.component';

describe('FinesMciPaymentCategoryCriminalMatchesComponent', () => {
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalMatchesComponent>;
  let routeDataSubject: BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>;

  beforeEach(async () => {
    routeDataSubject = new BehaviorSubject<{ criminalAccounts: IFinesMciCriminalAccountsResult }>({
      criminalAccounts: {
        results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.matches,
        response: { count: 1, defendant_accounts: [] },
      },
    });

    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalMatchesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeDataSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalMatchesComponent);
    fixture.detectChanges();
  });

  it.each([
    ['matches', 'Matching criminal accounts', 'PO-3480'],
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
});
