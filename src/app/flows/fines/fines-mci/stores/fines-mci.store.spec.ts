import { TestBed } from '@angular/core/testing';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from './fines-mci.store';

describe('FinesMciStore', () => {
  let store: InstanceType<typeof FinesMciStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FinesMciStore] });
    store = TestBed.inject(FinesMciStore);
  });

  it('should store the selected business unit', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

    store.setBusinessUnit(businessUnit);

    expect(store.businessUnit()).toEqual(businessUnit);
  });

  it('should reset the selected business unit', () => {
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.addTill();

    store.reset();

    expect(store.businessUnit()).toBeNull();
    expect(store.tills()).toEqual([]);
  });

  it('should add a till and return its id', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');

    expect(store.addTill()).toBe('00000000-0000-4000-8000-000000000001');
    expect(store.tills()).toEqual([{ tillId: '00000000-0000-4000-8000-000000000001', payments: [] }]);
  });

  it.each(['criminal', 'courtFee', 'suspense'] as const)(
    'should add a %s payment to the matching till and return its id',
    (journey) => {
      vi.spyOn(crypto, 'randomUUID')
        .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
        .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');
      store.addTill();

      expect(store.addPayment('00000000-0000-4000-8000-000000000001', journey)).toBe(
        '00000000-0000-4000-8000-000000000002',
      );
      expect(store.tills()).toEqual([
        {
          tillId: '00000000-0000-4000-8000-000000000001',
          payments: [{ paymentId: '00000000-0000-4000-8000-000000000002', journey }],
        },
      ]);
    },
  );

  it('should leave tills unchanged when adding a payment to an unknown till', () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');
    store.addTill();

    expect(store.addPayment('missing-till', 'courtFee')).toBe('00000000-0000-4000-8000-000000000002');
    expect(store.tills()).toEqual([{ tillId: '00000000-0000-4000-8000-000000000001', payments: [] }]);
  });

  it('should clear the previous account selection when replacing or clearing search results without changing till state', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    store.setBusinessUnit(businessUnit);
    const tillId = store.addTill();
    store.addPayment(tillId, 'criminal');
    const tills = store.tills();
    const account = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0];

    store.setSelectedCriminalAccount(account);
    store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);

    expect(store.criminalSearchResults()).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    expect(store.selectedCriminalAccount()).toBeNull();

    store.setSelectedCriminalAccount(account);
    store.setCriminalSearchResults(null);

    expect(store.criminalSearchResults()).toBeNull();
    expect(store.selectedCriminalAccount()).toBeNull();
    expect(store.businessUnit()).toEqual(businessUnit);
    expect(store.tills()).toEqual(tills);
  });

  it('should retain search results when selecting and clearing an account', () => {
    const account = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0];
    store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);

    store.setSelectedCriminalAccount(account);

    expect(store.selectedCriminalAccount()).toEqual(account);
    expect(store.criminalSearchResults()).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);

    store.setSelectedCriminalAccount(null);

    expect(store.selectedCriminalAccount()).toBeNull();
    expect(store.criminalSearchResults()).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
  });

  it('should reset criminal search without clearing the business unit, tills or payments', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    store.setBusinessUnit(businessUnit);
    const tillId = store.addTill();
    store.addPayment(tillId, 'criminal');
    const tills = store.tills();
    store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);

    store.resetCriminalSearch();

    expect(store.criminalSearchResults()).toBeNull();
    expect(store.selectedCriminalAccount()).toBeNull();
    expect(store.businessUnit()).toEqual(businessUnit);
    expect(store.tills()).toEqual(tills);
  });
});
