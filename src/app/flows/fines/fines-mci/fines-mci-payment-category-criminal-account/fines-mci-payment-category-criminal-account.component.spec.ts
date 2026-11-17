import { FINES_MCI_CRIMINAL_SEARCH_MOCK } from '../mocks/fines-mci-criminal-search.mock';
import { of, Subject, throwError, EMPTY } from 'rxjs';
import { FinesMciCriminalAccountService } from '../services/fines-mci-criminal-account.service';
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
        {
          provide: FinesMciCriminalAccountService,
          useValue: { loadMasterAccountDetails: vi.fn().mockReturnValue(EMPTY) },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ accountId: '1' })),
            snapshot: { paramMap: convertToParamMap({ accountId: '1' }) },
          },
        },
      ],
    });
    store = TestBed.inject(FinesMciStore);
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);
    store.setSelectedCriminalAccountAtAGlance(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
  });

  it.each([
    ['CS', 'Account has been consolidated.'],
    ['WO', 'Account has been written off in full'],
    ['TO', 'Account has been transferred out'],
    ['TS', 'Account has been transferred out'],
    ['TA', 'Account has been transferred out'],
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

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe(
      accountStatusCode === 'L' ? 'Confirm account' : 'You cannot pay into this account',
    );
    expect(fixture.nativeElement.querySelector('#fines-mci-account-warning')?.textContent.trim()).toBe(
      accountStatusCode === 'L' ? undefined : heading,
    );
    expect(!!fixture.nativeElement.querySelector('#fines-mci-confirm-account')).toBe(accountStatusCode === 'L');
  });

  it('shows an em dash for the business unit and hides account details after flow state is cleared', () => {
    store.reset();
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.govuk-caption-m')?.textContent?.trim()).toBe('—');
    expect(element.querySelector('h1')?.textContent).toBe('Account details are not available');
    expect(element.querySelector('dl')).toBeNull();
    expect(element.querySelector('#fines-mci-confirm-account')).toBeNull();
  });

  it('should not show a successful confirmation when account status data is missing', () => {
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Account details are not available');
    expect(fixture.nativeElement.querySelector('dl')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-mci-account-warning')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-mci-confirm-account')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-mci-pay-into-suspense')).toBeNull();
  });

  it('should not display another selected account outcome for a different route ID', () => {
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[1]);
    store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Account details are not available');
    expect(fixture.nativeElement.querySelector('dl')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-mci-account-warning')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-mci-confirm-account')).toBeNull();
    expect(fixture.nativeElement.querySelector('#fines-mci-pay-into-suspense')).toBeNull();
  });

  it('should update the warning when the selected account status changes', () => {
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

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('You cannot pay into this account');
    expect(fixture.nativeElement.querySelector('#fines-mci-account-warning').textContent.trim()).toBe(
      'Account has been transferred out',
    );
    expect(fixture.nativeElement.textContent).not.toContain('Confirm account');
  });

  it.each([
    ['CS', 'Account has been consolidated.'],
    ['WO', 'Account has been written off in full'],
    ['TO', 'Account has been transferred out'],
    ['TS', 'Account has been transferred out'],
    ['TA', 'Account has been transferred out'],
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

    expect(fixture.nativeElement.querySelector('#fines-mci-account-warning').textContent.trim()).toBe(expectedHeading);
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

    expect(fixture.nativeElement.querySelector('#fines-mci-account-warning').textContent.trim()).toBe(
      'Account has a zero balance',
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

      expect(fixture.nativeElement.querySelector('#fines-mci-account-warning').textContent.trim()).toBe(
        'Account has a zero balance',
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

      expect(fixture.nativeElement.querySelector('#fines-mci-account-warning')?.textContent.trim()).toBe(
        restricted ? 'Account is subject to inhibit related enforcement actions: Warrant Issued (EA-001)' : undefined,
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

    expect(fixture.nativeElement.querySelector('#fines-mci-account-warning').textContent.trim()).toBe(
      'Account has been consolidated.',
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

    it.each(['L', 'WO'])(
      'shows em dashes for missing optional values and retains a zero instalment amount for %s',
      (status) => {
        store.setSelectedCriminalAccountAtAGlance({
          ...store.selectedCriminalAccountAtAGlance()!,
          account_status_code: status,
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
      },
    );

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

    it.each(['CS', 'WO', 'TO', 'TA', 'TS'])(
      'renders the business unit and account data for restricted status %s',
      (status) => {
        store.setSelectedCriminalAccountAtAGlance({
          ...store.selectedCriminalAccountAtAGlance()!,
          account_status_code: status,
        });
        const { value, element } = render();
        expect(element.querySelector('.govuk-caption-m')?.textContent).toBe(store.businessUnit()?.business_unit_name);
        expect(value('Name')).toBe('Mx Example PERSON');
        expect(value('Account number')).toBe(store.selectedCriminalAccountAtAGlance()?.account_number);
        expect(value('Aliases')).toMatch(/First ALIAS.*Second ALIAS/s);
        expect(value('Date of birth')).toBe('03 February 1990');
        expect(value('Balance')).toBe('£175.00');
        expect(value('Enforcement action')).toBe('Warrant Issued (EA-001)');
        expect(value('Payment terms')).toBe('Lump sum plus instalments');
        expect(value('Frequency')).toBe('Monthly');
        expect(value('Instalments')).toBe('£25.00');
        expect(value('Start date')).toBe('05 July 2025');
        expect(value('Comments')).toMatch(/Account reviewed.*First note.*Second note/s);
        expect(element.querySelector('a[target="_blank"]')?.getAttribute('href')).toBe(
          '/fines/account/defendant/1/details',
        );
        expect(element.querySelector('#fines-mci-confirm-account')).toBeNull();
        expect(
          element
            .querySelector(status === 'CS' ? '#fines-mci-consolidated-continue' : '#fines-mci-pay-into-suspense')
            ?.textContent?.trim(),
        ).toBe(status === 'CS' ? 'Continue' : 'Pay into suspense');
      },
    );

    it('displays an enforcement action title without empty code brackets when its code is missing', () => {
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        enforcement_status: {
          ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK.enforcement_status,
          last_enforcement_action: { last_enforcement_action_id: '', last_enforcement_action_title: 'Example action' },
        },
      });
      const { value } = render();
      expect(value('Enforcement action')).toBe('Example action');
    });

    it('shows zero balance in pounds on the restricted screen', () => {
      store.setSelectedCriminalAccountAtAGlance({ ...store.selectedCriminalAccountAtAGlance()!, account_balance: 0 });
      const { value } = render();
      expect(value('Balance')).toBe('£0.00');
    });

    it.each([null, undefined, NaN, Infinity])(
      'shows an em dash for missing or invalid balance on a written-off account: %s',
      (balance) => {
        store.setSelectedCriminalAccountAtAGlance({
          ...store.selectedCriminalAccountAtAGlance()!,
          account_status_code: 'WO',
          account_balance: balance,
        });
        const { value } = render();
        expect(value('Balance')).toBe('—');
      },
    );

    it.each([true, false])(
      'returns Pay into suspense to the landing page and clears the draft only after navigation succeeds: %s',
      async (navigated) => {
        store.setSelectedCriminalAccountAtAGlance({
          ...store.selectedCriminalAccountAtAGlance()!,
          account_status_code: 'WO',
        });
        store.setDraftJourney('criminal');
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(navigated);
        const { element, fixture } = render();
        element.querySelector<HTMLButtonElement>('#fines-mci-pay-into-suspense')!.click();
        await fixture.whenStable();
        expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create-allocate']);
        expect(store.draftJourney()).toBe(navigated ? null : 'criminal');
        expect(store.selectedCriminalAccount()?.defendant_account_id ?? null).toBe(navigated ? null : 1);
        expect(store.businessUnit()).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
      },
    );

    it('does not start suspense if the restriction is removed before the view updates', () => {
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        account_status_code: 'WO',
      });
      const { element } = render();
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        account_status_code: 'L',
      });
      element.querySelector<HTMLButtonElement>('#fines-mci-pay-into-suspense')!.click();
      expect(navigate).not.toHaveBeenCalled();
    });

    it.each(['L', 'WO', 'CS'])(
      'links the associated account to the default enquiry tab in a new tab for %s',
      (status) => {
        store.setSelectedCriminalAccountAtAGlance({
          ...store.selectedCriminalAccountAtAGlance()!,
          account_status_code: status,
        });
        const { element } = render();
        const link = Array.from(element.querySelectorAll('a')).find((anchor) =>
          anchor.textContent?.includes('view the account in a new tab'),
        )!;
        expect(link.getAttribute('href')).toBe('/fines/account/defendant/1/details');
        expect(link.target).toBe('_blank');
        expect(link.rel).toContain('noopener');
        expect(link.rel).toContain('noreferrer');
      },
    );

    it('requests the payment-details route when Confirm is selected', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { element } = render();
      element.querySelector<HTMLButtonElement>('#fines-mci-confirm-account')!.click();
      expect(navigate).toHaveBeenCalledWith(['payment-details', '1'], { relativeTo: undefined });
    });

    it.each(['L', 'WO'])('returns to the search results without clearing the selected account for %s', (status) => {
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        account_status_code: status,
      });
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { element } = render();
      element.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      expect(navigate).toHaveBeenCalledWith(['matches'], { relativeTo: undefined });
      expect(store.selectedCriminalAccount()?.defendant_account_id).toBe(1);
    });

    it.each([
      [true, 'L'],
      [false, 'L'],
      [true, 'WO'],
      [false, 'WO'],
      [true, 'CS'],
      [false, 'CS'],
    ] as const)(
      'clears the payment draft and search only if Cancel navigation succeeds: %s for %s',
      async (navigated, status) => {
        const selected = store.selectedCriminalAccount()!;
        const details = { ...store.selectedCriminalAccountAtAGlance()!, account_status_code: status };
        store.setCriminalSearch(FINES_MCI_CRIMINAL_SEARCH_MOCK);
        store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
        store.setSelectedCriminalAccount(selected);
        store.setSelectedCriminalAccountAtAGlance(details);
        store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
        const tillId = store.ensureTill();
        store.addPayment(tillId, 'criminal');
        const tills = store.tills();
        store.setDraftJourney('criminal');
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(navigated);
        const clearDraft = vi.spyOn(store, 'setDraftJourney');
        const clearSearch = vi.spyOn(store, 'resetCriminalSearch');
        const { element, fixture } = render();
        element.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();
        await fixture.whenStable();
        expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
        expect(clearDraft).toHaveBeenCalledTimes(navigated ? 1 : 0);
        expect(clearSearch).toHaveBeenCalledTimes(navigated ? 1 : 0);
        expect(store.criminalSearch()).toBe(navigated ? null : FINES_MCI_CRIMINAL_SEARCH_MOCK);
        expect(store.criminalSearchResults()).toBe(
          navigated ? null : OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK,
        );
        expect(store.selectedCriminalAccount()).toBe(navigated ? null : selected);
        expect(store.selectedCriminalAccountAtAGlance()).toBe(navigated ? null : details);
        expect(store.selectedCriminalAccountHeader()).toBe(navigated ? null : FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
        expect(store.draftJourney()).toBe(navigated ? null : 'criminal');
        expect(store.businessUnit()).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
        expect(store.tills()).toBe(tills);
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

    it('retains the details and replaces Confirm with Pay into suspense when the account becomes restricted', () => {
      const { fixture, element } = render();
      store.setSelectedCriminalAccountAtAGlance({
        ...store.selectedCriminalAccountAtAGlance()!,
        account_status_code: 'WO',
      });
      fixture.detectChanges();
      expect(element.querySelector('dl')).not.toBeNull();
      expect(element.querySelector('#fines-mci-account-warning')?.textContent?.trim()).toBe(
        'Account has been written off in full',
      );
      expect(element.querySelector('#fines-mci-pay-into-suspense')).not.toBeNull();
      expect(element.querySelector('#fines-mci-confirm-account')).toBeNull();
    });
  });
  describe('consolidated child next steps', () => {
    beforeEach(() => {
      store.setSelectedCriminalAccountAtAGlance({
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        account_status_code: 'CS',
        account_balance: 0,
      });
    });
    const render = () => {
      const fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalAccountComponent);
      fixture.detectChanges();
      const element: HTMLElement = fixture.nativeElement;
      const select = (value: string) => {
        const radio = element.querySelector<HTMLInputElement>(`input[value="${value}"]`)!;
        radio.click();
        fixture.detectChanges();
      };
      const submit = () => {
        element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        fixture.detectChanges();
      };
      return { fixture, element, select, submit };
    };

    it('displays an unselected Next steps group only for a consolidated child', () => {
      const { element } = render();
      expect(element.querySelector('legend')?.textContent).toContain('Next steps');
      expect(Array.from(element.querySelectorAll('label')).map((label) => label.textContent?.trim())).toEqual([
        'Pay into the live (master) account',
        'Pay into suspense',
      ]);
      expect(element.querySelector('input:checked')).toBeNull();
      expect(element.querySelector('#fines-mci-pay-into-suspense')).toBeNull();
    });

    it('keeps a live master with child accounts on the ordinary confirmation flow', () => {
      store.setSelectedCriminalAccountAtAGlance({
        ...OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK,
        account_status_code: 'L',
        account_balance: 100,
      });
      store.setSelectedCriminalAccountHeader({
        ...FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
        has_consolidated_accounts: true,
      });
      const { element } = render();
      expect(element.querySelector('form')).toBeNull();
      expect(element.querySelector('#fines-mci-confirm-account')).not.toBeNull();
    });

    it('shows the exact validation message inline and in the summary without navigating', () => {
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { element, submit, select } = render();
      submit();
      const message = 'Select whether to pay into the live account or into suspense';
      expect(element.querySelector('.govuk-error-summary')?.textContent).toContain(message);
      expect(element.querySelector('.govuk-error-message')?.textContent).toContain(message);
      expect(navigate).not.toHaveBeenCalled();
      const errorLink = element.querySelector<HTMLAnchorElement>('.govuk-error-summary a')!;
      errorLink.click();
      expect(document.activeElement?.id).toBe('fines-mci-consolidated-next-step');
      select('master');
      expect(element.querySelector('.govuk-error-message')).toBeNull();
    });

    it.each([true, false])(
      'returns suspense selection to the MCI landing page and clears the draft only after success: %s',
      async (navigated) => {
        store.setDraftJourney('criminal');
        const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(navigated);
        const { fixture, select, submit } = render();
        select('suspense');
        submit();
        await fixture.whenStable();
        expect(navigate).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create-allocate']);
        expect(store.selectedCriminalAccount() === null).toBe(navigated);
        expect(store.draftJourney()).toBe(navigated ? null : 'criminal');
        expect(TestBed.inject(FinesMciCriminalAccountService).loadMasterAccountDetails).not.toHaveBeenCalled();
      },
    );

    it('keeps the child and permits retry if the master load fails or emits no response', () => {
      const load = vi.mocked(TestBed.inject(FinesMciCriminalAccountService).loadMasterAccountDetails);
      load.mockReturnValueOnce(throwError(() => new Error('Unable to load'))).mockReturnValueOnce(EMPTY);
      const { element, select, submit } = render();
      select('master');
      submit();
      expect(element.querySelector('.govuk-error-summary')).toBeNull();
      expect(element.querySelector('.govuk-error-message')).toBeNull();
      expect(element.querySelector<HTMLButtonElement>('#fines-mci-consolidated-continue')!.disabled).toBe(false);
      expect(store.selectedCriminalAccount()?.defendant_account_id).toBe(1);
      submit();
      expect(load).toHaveBeenCalledTimes(2);
      expect(element.querySelector('h1')?.textContent).toContain('You cannot pay into this account');
    });

    it.each([
      ['cancelled', false],
      ['failed', false],
      ['cancelled', true],
      ['failed', true],
    ] as const)('restores the child if master navigation is %s with a stored header: %s', async (result, hasHeader) => {
      if (hasHeader) store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
      const child = store.selectedCriminalAccount();
      const details = store.selectedCriminalAccountAtAGlance();
      vi.mocked(TestBed.inject(FinesMciCriminalAccountService).loadMasterAccountDetails).mockImplementation(() => {
        store.setSelectedCriminalAccount({ ...child!, defendant_account_id: '2', organisation_flag: true });
        store.setSelectedCriminalAccountAtAGlance({ ...details!, account_status_code: 'L', account_balance: 100 });
        store.setSelectedCriminalAccountHeader(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
        return of(store.selectedCriminalAccountAtAGlance()!);
      });
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
      if (result === 'failed') navigate.mockRejectedValue(new Error('Navigation failed'));
      else navigate.mockResolvedValue(false);
      const { fixture, element, select, submit } = render();
      select('master');
      submit();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(navigate).toHaveBeenCalledWith(['account', '2', 'company'], { relativeTo: undefined });
      expect(store.selectedCriminalAccount()).toBe(child);
      expect(store.selectedCriminalAccountAtAGlance()).toBe(details);
      expect(store.selectedCriminalAccountHeader()).toBe(hasHeader ? FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK : null);
      expect(element.querySelector('.govuk-error-summary')).toBeNull();
      expect(element.querySelector('.govuk-error-message')).toBeNull();
      expect(element.querySelector('legend')?.textContent).toContain('Next steps');
    });

    it('unsubscribes from a master request when the page is destroyed', () => {
      const response = new Subject<typeof OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK>();
      vi.mocked(TestBed.inject(FinesMciCriminalAccountService).loadMasterAccountDetails).mockReturnValue(response);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
      const { fixture, select, submit } = render();
      select('master');
      submit();
      fixture.destroy();
      response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      expect(navigate).not.toHaveBeenCalled();
      expect(response.observed).toBe(false);
    });

    it('cancels a pending master load when the choice changes and continues to suspense only on submit', async () => {
      const response = new Subject<typeof OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK>();
      vi.mocked(TestBed.inject(FinesMciCriminalAccountService).loadMasterAccountDetails).mockReturnValue(response);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const child = store.selectedCriminalAccount();
      const details = store.selectedCriminalAccountAtAGlance();
      const { fixture, element, select, submit } = render();
      select('master');
      submit();
      expect(response.observed).toBe(true);
      expect(element.querySelector<HTMLButtonElement>('#fines-mci-consolidated-continue')!.disabled).toBe(true);
      select('suspense');
      expect(response.observed).toBe(false);
      expect(element.querySelector<HTMLButtonElement>('#fines-mci-consolidated-continue')!.disabled).toBe(false);
      expect(element.querySelector<HTMLInputElement>('input[value="suspense"]')!.checked).toBe(true);
      response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      response.complete();
      expect(navigate).not.toHaveBeenCalled();
      expect(store.selectedCriminalAccount()).toBe(child);
      expect(store.selectedCriminalAccountAtAGlance()).toBe(details);
      expect(element.querySelector('.govuk-error-summary')).toBeNull();
      submit();
      await fixture.whenStable();
      expect(navigate).toHaveBeenCalledExactlyOnceWith(['/', 'fines', 'manual-cash-input', 'create-allocate']);
    });

    it('starts a fresh master request if the user switches back to the master option', async () => {
      const first = new Subject<typeof OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK>();
      const second = new Subject<typeof OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK>();
      const load = vi
        .mocked(TestBed.inject(FinesMciCriminalAccountService).loadMasterAccountDetails)
        .mockReturnValueOnce(first)
        .mockReturnValueOnce(second);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { fixture, select, submit } = render();
      select('master');
      submit();
      select('suspense');
      select('master');
      submit();
      expect(load).toHaveBeenCalledTimes(2);
      expect(first.observed).toBe(false);
      expect(second.observed).toBe(true);
      first.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      expect(navigate).not.toHaveBeenCalled();
      store.setSelectedCriminalAccount({
        ...store.selectedCriminalAccount()!,
        defendant_account_id: '2',
        organisation_flag: false,
      });
      second.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      second.complete();
      await fixture.whenStable();
      expect(navigate).toHaveBeenCalledExactlyOnceWith(['account', '2', 'individual'], { relativeTo: undefined });
    });

    it('ignores duplicate submissions and cancels the request when Back is selected', () => {
      const response = new Subject<typeof OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK>();
      const load = vi
        .mocked(TestBed.inject(FinesMciCriminalAccountService).loadMasterAccountDetails)
        .mockReturnValue(response);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const { element, select, submit } = render();
      select('master');
      submit();
      submit();
      expect(load).toHaveBeenCalledTimes(1);
      expect(element.querySelector<HTMLButtonElement>('#fines-mci-consolidated-continue')!.disabled).toBe(true);
      element.querySelector<HTMLAnchorElement>('.govuk-back-link')!.click();
      response.next(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK);
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(['matches'], { relativeTo: undefined });
    });
  });
});
