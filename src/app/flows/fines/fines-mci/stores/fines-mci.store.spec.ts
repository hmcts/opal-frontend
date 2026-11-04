import { TestBed } from '@angular/core/testing';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-defendant-account-response-individual.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from './fines-mci.store';
import { IFinesMciCriminalSearch } from './interfaces/fines-mci-criminal-search.interface';

describe('FinesMciStore', () => {
  let store: InstanceType<typeof FinesMciStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FinesMciStore] });
    store = TestBed.inject(FinesMciStore);
  });

  it.each(['business unit change', 'reset'] as const)(
    'should clear criminal search and the draft journey on %s',
    (action) => {
      const [initialBusinessUnit, nextBusinessUnit] = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
      const criminalSearch: IFinesMciCriminalSearch = {
        activeTab: 'individuals',
        searchCriteriaCannotBeCombined: false,
        formData: {
          fsa_search_account_number: '12345678',
          fsa_search_account_individuals_search_criteria: {
            fsa_search_account_individuals_last_name: null,
            fsa_search_account_individuals_first_names: null,
            fsa_search_account_individuals_last_name_exact_match: false,
            fsa_search_account_individuals_first_names_exact_match: false,
            fsa_search_account_individuals_include_aliases: false,
          },
          fsa_search_account_companies_search_criteria: {
            fsa_search_account_companies_company_name: null,
            fsa_search_account_companies_company_name_exact_match: false,
            fsa_search_account_companies_include_aliases: false,
          },
        },
      };
      store.setBusinessUnit(initialBusinessUnit);
      store.ensureTill();
      store.setDraftJourney('criminal');
      store.setCriminalSearch(criminalSearch);
      store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
      store.setSelectedCriminalAccount(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0]);

      if (action === 'reset') {
        store.reset();
      } else {
        store.setBusinessUnit(nextBusinessUnit);
      }

      expect(store.criminalSearch()).toBeNull();
      expect(store.criminalSearchResults()).toBeNull();
      expect(store.selectedCriminalAccount()).toBeNull();
      expect(store.draftJourney()).toBeNull();
      expect(store.tills()).toEqual([]);
    },
  );

  it('should store the selected business unit', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];

    store.setBusinessUnit(businessUnit);

    expect(store.businessUnit()).toEqual(businessUnit);
  });

  it('should clear the in-progress till when the selected business unit changes', () => {
    const [initialBusinessUnit, nextBusinessUnit] = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    store.setBusinessUnit(initialBusinessUnit);
    store.ensureTill();

    store.setBusinessUnit(nextBusinessUnit);

    expect(store.businessUnit()).toEqual(nextBusinessUnit);
    expect(store.tills()).toEqual([]);
  });

  it('should preserve the till, payments and criminal search when reselecting the same business unit', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    const account = OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK.defendant_accounts[0];
    store.setBusinessUnit(businessUnit);
    const tillId = store.ensureTill();
    store.addPayment(tillId, 'criminal');
    const tills = store.tills();
    store.setCriminalSearchResults(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    store.setSelectedCriminalAccount(account);

    store.setBusinessUnit({ ...businessUnit });

    expect(store.ensureTill()).toBe(tillId);
    expect(store.tills()).toEqual(tills);
    expect(store.criminalSearchResults()).toEqual(OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK);
    expect(store.selectedCriminalAccount()).toEqual(account);
  });

  it('should reset the selected business unit', () => {
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setDraftJourney('suspense');
    store.ensureTill();

    store.reset();

    expect(store.businessUnit()).toBeNull();
    expect(store.tills()).toEqual([]);
    expect(store.draftJourney()).toBeNull();
  });

  it('should create the in-progress till and return its id', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');

    expect(store.ensureTill()).toBe('00000000-0000-4000-8000-000000000001');
    expect(store.tills()).toEqual([{ tillId: '00000000-0000-4000-8000-000000000001', payments: [] }]);
  });

  it('should reuse the in-progress till when ensuring a till exists', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');
    const tillId = store.ensureTill();

    expect(store.ensureTill()).toBe(tillId);
    expect(store.tills()).toHaveLength(1);
  });

  it.each(['criminal', 'courtFee', 'suspense'] as const)(
    'should add a %s payment to the matching till and return its id',
    (journey) => {
      vi.spyOn(crypto, 'randomUUID')
        .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
        .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');
      store.ensureTill();
      store.setDraftJourney(journey);

      expect(store.addPayment('00000000-0000-4000-8000-000000000001', journey)).toBe(
        '00000000-0000-4000-8000-000000000002',
      );
      expect(store.tills()).toEqual([
        {
          tillId: '00000000-0000-4000-8000-000000000001',
          payments: [{ paymentId: '00000000-0000-4000-8000-000000000002', journey }],
        },
      ]);
      expect(store.draftJourney()).toBeNull();
    },
  );

  it('should leave tills unchanged when adding a payment to an unknown till', () => {
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');
    store.ensureTill();
    store.setDraftJourney('courtFee');

    expect(store.addPayment('missing-till', 'courtFee')).toBe('00000000-0000-4000-8000-000000000002');
    expect(store.tills()).toEqual([{ tillId: '00000000-0000-4000-8000-000000000001', payments: [] }]);
    expect(store.draftJourney()).toBe('courtFee');
  });

  it('should clear the previous account selection when replacing or clearing search results without changing till state', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    store.setBusinessUnit(businessUnit);
    const tillId = store.ensureTill();
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
    const tillId = store.ensureTill();
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
