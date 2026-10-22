import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesSuspenseItemStore } from './fines-suspense-item.store';

describe('FinesSuspenseItemStore', () => {
  let store: InstanceType<typeof FinesSuspenseItemStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FinesSuspenseItemStore);
  });

  it('starts without a selected BU or submitted search', () => {
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.submittedCriteria()).toBeNull();
  });

  it('keeps a copy of the submitted BU and reference together', () => {
    const criteria = { fsis_business_unit_id: 11, fsis_suspense_reference_number: '001234' };
    store.setSubmittedCriteria(criteria);
    criteria.fsis_suspense_reference_number = '999';
    expect(store.selectedBusinessUnitId()).toBe(11);
    expect(store.submittedCriteria()).toEqual({
      fsis_business_unit_id: 11,
      fsis_suspense_reference_number: '001234',
    });
  });

  it('discards the previous search when the selected BU changes or is cleared', () => {
    store.setSubmittedCriteria({ fsis_business_unit_id: 11, fsis_suspense_reference_number: '1234' });
    store.setSelectedBusinessUnitId(22);
    expect(store.selectedBusinessUnitId()).toBe(22);
    expect(store.submittedCriteria()).toBeNull();
    store.setSubmittedCriteria({ fsis_business_unit_id: 22, fsis_suspense_reference_number: '5678' });
    store.setSelectedBusinessUnitId(null);
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.submittedCriteria()).toBeNull();
  });

  it('preserves the last submitted search when the BU has not changed', () => {
    const criteria = { fsis_business_unit_id: 11, fsis_suspense_reference_number: '1234' };
    store.setSubmittedCriteria(criteria);
    store.setSelectedBusinessUnitId(11);
    expect(store.submittedCriteria()).toEqual(criteria);
  });
});
