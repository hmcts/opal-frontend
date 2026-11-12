import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
        provideRouter([]),
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
    ['L', 'Confirm account'],
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
    expect(!!fixture.nativeElement.querySelector('#fines-mci-confirm-account')).toBe(accountStatusCode === 'L');
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
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Confirm account');

    store.setSelectedCriminalAccountHeader({
      ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
      account_status_reference: { account_status_code: 'TO', account_status_display_name: 'Transfer out in progress' },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(
      'You cannot pay into this account \u2013 Transfer out in progress',
    );
    expect(fixture.nativeElement.textContent).not.toContain('Confirm account');
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

      expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Confirm account');
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
          : 'Confirm account',
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

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Confirm account');
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

  describe('confirmation details', () => {
    const individual = {
      title: 'Mx',
      forenames: 'Example',
      surname: 'Person',
      date_of_birth: '1990-02-03',
      age: null,
      national_insurance_number: null,
      individual_aliases: [
        { alias_id: 'second', sequence_number: 2, forenames: 'Second', surname: 'Alias' },
        { alias_id: 'first', sequence_number: 1, forenames: 'First', surname: 'Alias' },
      ],
    };
    beforeEach(() => {
      store.setSelectedCriminalAccountAtAGlance({
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        account_status_code: 'L',
        account_balance: 175,
        party_details: { party_id: 'test', organisation_flag: false, individual_details: individual },
        payment_terms: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK.payment_terms,
          payment_terms_type: { payment_terms_type_code: 'I', payment_terms_type_display_name: 'Instalments' },
          lump_sum_amount: 10,
          instalment_amount: 25,
          effective_date: '05/07/2025',
        },
      });
    });

    const render = () => {
      const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
      fixture.detectChanges();
      const element: HTMLElement = fixture.nativeElement;
      const value = (label: string) =>
        Array.from(element.querySelectorAll('.govuk-summary-list__row'))
          .find((row) => row.querySelector('dt')?.textContent?.trim() === label)
          ?.querySelector('dd')
          ?.textContent?.trim();
      return { fixture, element, value };
    };

    it('renders the business unit and formatted individual account data', () => {
      const { element, value } = render();
      expect(element.querySelector('.govuk-caption-m')?.textContent).toBe(store.businessUnit()?.business_unit_name);
      expect(value('Account number')).toBe(store.selectedCriminalAccountAtAGlance()?.account_number);
      expect(value('Name')).toBe('Mx Example PERSON');
      expect(value('Date of birth')).toBe('03 February 1990');
      expect(value('Balance')).toBe('£175.00');
      expect(value('Enforcement action')).toBe('Warrant Issued (EA-001)');
      expect(value('Payment terms')).toBe('Lump sum plus instalments');
      expect(value('Frequency')).toBe('Monthly');
      expect(value('Instalments')).toBe('£25.00');
      expect(value('Start date')).toBe('05 July 2025');
      expect(value('Address')).toMatch(/123 Main Street.*Apt 4.*AB12 3CD/s);
      expect(value('Comments')).toMatch(/Account reviewed.*First note.*Second note/s);
      expect(value('Aliases')).toMatch(/First ALIAS.*Second ALIAS/s);
      expect(
        store.selectedCriminalAccountAtAGlance()?.party_details.individual_details?.individual_aliases?.[0]
          .sequence_number,
      ).toBe(2);
      const link = element.querySelector('a[target="_blank"]');
      expect(link?.getAttribute('href')).toBe('/fines/account/defendant/1/details');
      expect(link?.getAttribute('rel')).toContain('noopener');
    });

    it('renders companies and their aliases without a date of birth row', () => {
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        party_details: {
          party_id: 'company',
          organisation_flag: true,
          organisation_details: {
            organisation_name: 'Example Company',
            organisation_aliases: [
              { alias_id: 'b', sequence_number: 2, organisation_name: 'Second Company' },
              { alias_id: 'a', sequence_number: 1, organisation_name: 'First Company' },
            ],
          },
        },
      });
      const { value } = render();
      expect(value('Name')).toBe('Example Company');
      expect(value('Date of birth')).toBeUndefined();
      expect(value('Aliases')).toMatch(/First Company.*Second Company/s);
    });

    it('shows em dashes for missing optional values and retains a zero instalment amount', () => {
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        account_number: '',
        party_details: { party_id: 'test', organisation_flag: false, individual_details: null },
        address: {
          address_line_1: '',
          address_line_2: null,
          address_line_3: null,
          address_line_4: null,
          address_line_5: null,
          postcode: null,
        },
        comments_and_notes: null,
        enforcement_status: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK.enforcement_status,
          last_enforcement_action: null,
        },
        payment_terms: {
          ...store.selectedCriminalAccountAtAGlance()!.payment_terms,
          instalment_period: null,
          instalment_amount: 0,
          effective_date: null,
        },
      });
      const { value } = render();
      for (const label of [
        'Account number',
        'Name',
        'Aliases',
        'Date of birth',
        'Address',
        'Enforcement action',
        'Frequency',
        'Start date',
        'Comments',
      ]) {
        expect(value(label), label).toBe('—');
      }
      expect(value('Instalments')).toBe('£0.00');
    });

    it('uses by-date terms without instalment-only rows', () => {
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        payment_terms: {
          payment_terms_type: { payment_terms_type_code: 'B', payment_terms_type_display_name: 'By date' },
          lump_sum_amount: null,
          instalment_amount: null,
          instalment_period: null,
          effective_date: '2025-07-05',
        },
      });
      const { value } = render();
      expect(value('Payment terms')).toBe('By date');
      expect(value('Frequency')).toBeUndefined();
      expect(value('Instalments')).toBeUndefined();
      expect(value('Start date')).toBeUndefined();
      expect(value('Pay by date')).toBe('05 July 2025');
    });

    it('shows instalments without a lump sum and an em dash for a missing amount', () => {
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        payment_terms: {
          ...store.selectedCriminalAccountAtAGlance()!.payment_terms,
          lump_sum_amount: null,
          instalment_amount: null,
        },
      });
      const { value } = render();
      expect(value('Payment terms')).toBe('Instalments');
      expect(value('Instalments')).toBe('—');
    });

    it('requests the payment-details route when Confirm is selected', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { element } = render();
      element.querySelector<HTMLButtonElement>('#fines-mci-confirm-account')!.click();
      expect(navigate).toHaveBeenCalledWith(['payment-details', '1'], { relativeTo: undefined });
    });

    it('returns to the search results without clearing the selected account', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { element } = render();
      element.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      expect(navigate).toHaveBeenCalledWith(['matches'], { relativeTo: undefined });
      expect(store.selectedCriminalAccount()?.defendant_account_id).toBe(1);
    });

    it.each([true, false])(
      'clears the payment draft and search only if Cancel navigation succeeds: %s',
      async (navigated) => {
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(navigated);
        const clearDraft = vi.spyOn(store, 'setDraftJourney');
        const clearSearch = vi.spyOn(store, 'resetCriminalSearch');
        const { element, fixture } = render();
        element.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
        await fixture.whenStable();
        expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
        expect(clearDraft).toHaveBeenCalledTimes(navigated ? 1 : 0);
        expect(clearSearch).toHaveBeenCalledTimes(navigated ? 1 : 0);
      },
    );

    it('does not continue if the account becomes restricted before the view updates', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { element } = render();
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        account_status_code: 'WO',
      });
      element.querySelector<HTMLButtonElement>('#fines-mci-confirm-account')!.click();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('removes the details and Confirm button when the account becomes restricted', () => {
      const { fixture, element } = render();
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        account_status_code: 'WO',
      });
      fixture.detectChanges();
      expect(element.querySelector('dl')).toBeNull();
      expect(element.querySelector('#fines-mci-confirm-account')).toBeNull();
    });
  });
});
