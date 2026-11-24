import { TestBed } from '@angular/core/testing';
import { getState } from '@ngrx/signals';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_AEC_STORE_STATE } from '../constants/fines-aec-store-state.constant';
import { FinesAecStore } from './fines-aec.store';

describe('FinesAecStore', () => {
  let store: InstanceType<typeof FinesAecStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FinesAecStore] });
    store = TestBed.inject(FinesAecStore);
  });

  it('defaults to Account types without a success message', () => {
    expect(getState(store)).toEqual(FINES_AEC_STORE_STATE);
  });

  it('retains the selected tab when another component accesses the store', () => {
    store.setActiveTab('enforcement-paths');

    const retainedStore = TestBed.inject(FinesAecStore);

    expect(retainedStore.activeTab()).toBe('enforcement-paths');
  });

  it('clears a success message without changing the selected tab', () => {
    store.setActiveTab('run-parameters');
    store.setSuccessMessage('Enforcement values updated');

    expect(store.successMessage()).toBe('Enforcement values updated');

    store.clearSuccessMessage();

    expect(store.successMessage()).toBeNull();
    expect(store.activeTab()).toBe('run-parameters');
  });

  it('resets the selected tab and success message together', () => {
    store.setActiveTab('enforcer-allocation');
    store.setSuccessMessage('Enforcement values updated');

    store.resetStore();

    expect(getState(store)).toEqual(FINES_AEC_STORE_STATE);
  });
});
