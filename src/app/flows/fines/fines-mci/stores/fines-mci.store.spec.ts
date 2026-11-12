import { TestBed } from '@angular/core/testing';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
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
    'should clear criminal search and payment drafts on %s',
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
      store.setDraftJourney('courtFee');
      store.setCourtFeeDraft({ courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' });
      store.setCriminalSearch(criminalSearch);

      if (action === 'reset') {
        store.reset();
      } else {
        store.setBusinessUnit(nextBusinessUnit);
      }

      expect(store.criminalSearch()).toBeNull();
      expect(store.draftJourney()).toBeNull();
      expect(store.courtFeeDraft()).toBeNull();
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

  it('should reset the selected business unit', () => {
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    store.setDraftJourney('suspense');
    store.ensureTill();

    store.reset();

    expect(store.businessUnit()).toBeNull();
    expect(store.tills()).toEqual([]);
    expect(store.draftJourney()).toBeNull();
  });

  it('keeps court fee details in memory until the journey is cancelled or the business unit changes', () => {
    const [initialBusinessUnit, nextBusinessUnit] = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    const draft = {
      courtFeeId: 1,
      amountPaid: '25.00',
      numberOfItems: '2',
    };
    store.setBusinessUnit(initialBusinessUnit);
    store.setDraftJourney('courtFee');
    store.setCourtFeeDraft(draft);

    expect(store.courtFeeDraft()).toEqual(draft);

    store.setBusinessUnit(nextBusinessUnit);

    expect(store.courtFeeDraft()).toBeNull();
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
});
