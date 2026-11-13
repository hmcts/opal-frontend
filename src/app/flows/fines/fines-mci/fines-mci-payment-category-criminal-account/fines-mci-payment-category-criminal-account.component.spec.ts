import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc/fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_CONFIGURATION_ITEMS } from '@services/fines/opal-fines-service/constants/opal-fines-configuration-items.constant';
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
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);
    store.setSelectedCriminalAccountAtAGlance(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
  });

  it.each([
    ['CS', 'You cannot pay into this account \u2013 Account has been consolidated'],
    ['WO', 'You cannot pay into this account \u2013 Account has been written off'],
    ['TO', 'You cannot pay into this account \u2013 Transfer out in progress'],
    ['TS', 'You cannot pay into this account \u2013 Account has been transferred out to Scotland or Northern Ireland'],
    ['TA', 'You cannot pay into this account \u2013 Account has been transferred out'],
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

  it('should update the placeholder when the selected account status changes', () => {
    store.setSelectedCriminalAccountHeader({
      ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
      account_status_reference: { account_status_code: 'L', account_status_display_name: 'Live' },
    });
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Successful confirm account');

    store.setSelectedCriminalAccountHeader({
      ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
      account_status_reference: { account_status_code: 'TO', account_status_display_name: 'Transfer out in progress' },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(
      'You cannot pay into this account \u2013 Transfer out in progress',
    );
    expect(fixture.nativeElement.textContent).not.toContain('Successful confirm account');
  });

  it.each([
    ['CS', 'You cannot pay into this account \u2013 Account has been consolidated'],
    ['WO', 'You cannot pay into this account \u2013 Account has been written off'],
    ['TO', 'You cannot pay into this account \u2013 Transfer out in progress'],
    ['TS', 'You cannot pay into this account \u2013 Account has been transferred out to Scotland or Northern Ireland'],
    ['TA', 'You cannot pay into this account \u2013 Account has been transferred out'],
  ])('should use at-a-glance status %s before a conflicting header status', (statusCode, expectedHeading) => {
    store.setSelectedCriminalAccountHeader({
      ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
      account_status_reference: { account_status_code: 'L', account_status_display_name: 'Live' },
    });
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: statusCode,
      account_balance: 100,
    });
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(expectedHeading);
  });

  it('should block a zero balance from at-a-glance even when the header and search result have outstanding balances', () => {
    store.setSelectedCriminalAccountHeader({
      ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
      payment_state_summary: { ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.payment_state_summary, account_balance: 100 },
    });
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: 'L',
      account_balance: 0,
    });
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(
      'You cannot pay into this account \u2013 Account has a zero balance',
    );
  });

  it.each([undefined, null])(
    'should use header status and balance when optional at-a-glance fields are %s',
    (value) => {
      store.setSelectedCriminalAccountAtAGlance({
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        account_status_code: value,
        account_balance: value,
      });
      store.setSelectedCriminalAccountHeader({
        ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
        account_status_reference: { account_status_code: 'L', account_status_display_name: 'Live' },
        payment_state_summary: { ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.payment_state_summary, account_balance: 0 },
      });
      const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(
        'You cannot pay into this account \u2013 Account has a zero balance',
      );
    },
  );

  it.each([0.01, -0.01])(
    'should allow a nonzero balance of %s using complete at-a-glance data without a header',
    (balance) => {
      store.setSelectedCriminalAccountAtAGlance({
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        account_status_code: 'L',
        account_balance: balance,
      });
      const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Successful confirm account');
    },
  );

  it.each([undefined, null, NaN, Infinity])(
    'should not confirm an account with an unavailable or invalid balance: %s',
    (balance) => {
      store.setSelectedCriminalAccountAtAGlance({
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        account_status_code: 'L',
        account_balance: balance,
      });
      const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Account details are not available');
    },
  );

  it.each([
    { inhibitedActions: ['EA-001', 'OTHER'], restricted: true },
    { inhibitedActions: ['EA-0010', 'EA-00'], restricted: false },
    { inhibitedActions: [], restricted: false },
    { inhibitedActions: null, restricted: false },
  ])(
    'should check the last enforcement action against the selected business unit list: $inhibitedActions',
    ({ inhibitedActions, restricted }) => {
      store.setBusinessUnit({
        ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
        configuration_items: [
          {
            item_name: OPAL_FINES_CONFIGURATION_ITEMS.resultsToInhibitPayments,
            item_value: null,
            item_values: inhibitedActions,
          },
        ],
      });
      store.setSelectedCriminalAccountAtAGlance({
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        account_status_code: 'L',
        account_balance: 100,
      });
      const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(
        restricted
          ? 'You cannot pay into this account \u2013 Account has an inhibited enforcement action'
          : 'Successful confirm account',
      );
    },
  );

  it('should allow an account with no last enforcement action even when enforcement inhibits are configured', () => {
    store.setBusinessUnit({
      ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
      configuration_items: [
        {
          item_name: OPAL_FINES_CONFIGURATION_ITEMS.resultsToInhibitPayments,
          item_value: null,
          item_values: ['EA-001'],
        },
      ],
    });
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: 'L',
      account_balance: 100,
      enforcement_status: {
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK.enforcement_status,
        last_enforcement_action: null,
      },
    });
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Successful confirm account');
  });

  it('should give consolidated accounts precedence when zero balance and enforcement restrictions also apply', () => {
    store.setBusinessUnit({
      ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
      configuration_items: [
        {
          item_name: OPAL_FINES_CONFIGURATION_ITEMS.resultsToInhibitPayments,
          item_value: null,
          item_values: ['EA-001'],
        },
      ],
    });
    store.setSelectedCriminalAccountAtAGlance({
      ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
      account_status_code: 'CS',
      account_balance: 0,
    });
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(
      'You cannot pay into this account \u2013 Account has been consolidated',
    );
  });
});
