import { TestBed } from '@angular/core/testing';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
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
    store.ensureTill();

    store.reset();

    expect(store.businessUnit()).toBeNull();
    expect(store.tills()).toEqual([]);
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
    store.ensureTill();

    expect(store.addPayment('missing-till', 'courtFee')).toBe('00000000-0000-4000-8000-000000000002');
    expect(store.tills()).toEqual([{ tillId: '00000000-0000-4000-8000-000000000001', payments: [] }]);
  });
});
