import { TestBed } from '@angular/core/testing';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it } from 'vitest';
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

    store.reset();

    expect(store.businessUnit()).toBeNull();
  });
});
