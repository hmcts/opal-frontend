import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FinesMciPaymentCategoryCriminalAccountComponent } from './fines-mci-payment-category-criminal-account.component';

describe('FinesMciPaymentCategoryCriminalAccountComponent', () => {
  let store: InstanceType<typeof FinesMciStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalAccountComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ accountId: '1' }) } } },
      ],
    });
    store = TestBed.inject(FinesMciStore);
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);
  });

  it.each([
    ['CS', 'You cannot pay into this account \u2013 Account has been consolidated'],
    ['WO', 'You cannot pay into this account \u2013 Account has been written off'],
    ['TO', 'Successful confirm account'],
    ['TS', 'Successful confirm account'],
    ['TA', 'Successful confirm account'],
    ['L', 'Successful confirm account'],
  ])('should display the %s account outcome', (accountStatusCode, heading) => {
    store.setSelectedCriminalAccountHeader({
      ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
      account_status_reference: {
        account_status_code: accountStatusCode,
        account_status_display_name: accountStatusCode,
      },
    });
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(heading);
    expect(fixture.nativeElement.textContent).toContain('PO-3530');
  });

  it('should not show a successful confirmation when account status data is missing', () => {
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Account details are not available');
  });

  it('should not display another selected account outcome for a different route ID', () => {
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[1]);
    store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Account details are not available');
  });
});
