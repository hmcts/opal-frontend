import { TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsSearchOffencesStore } from './fines-mac-offence-details-search-offences.store';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM } from '../constants/fines-mac-offence-details-search-offences-form.constant';
import { FinesMacOffenceDetailsSearchOffencesStoreType } from './types/fines-mac-offence-details-search-offences-store.type';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK } from '../mocks/fines-mac-offence-details-search-offences-form.mock';

describe('FinesMacOffenceDetailsSearchOffencesStore', () => {
  let store: FinesMacOffenceDetailsSearchOffencesStoreType;

  beforeEach(() => {
    store = TestBed.inject(FinesMacOffenceDetailsSearchOffencesStore);
  });

  it('should have initial state', () => {
    expect(store.searchOffences()).toEqual(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM);
    expect(store.unsavedChanges()).toBeFalse();
    expect(store.stateChanges()).toBeFalse();
  });

  it('should set search offences and update flags', () => {
    const mockData = FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK;
    store.setSearchOffences(mockData);
    expect(store.searchOffences()).toEqual(mockData);
  });

  it('should update unsavedChanges flag', () => {
    store.setUnsavedChanges(true);
    expect(store.unsavedChanges()).toBeTrue();
  });

  it('should update stateChanges flag', () => {
    store.setStateChanges(true);
    expect(store.stateChanges()).toBeTrue();
  });

  it('should reset the store to initial state', () => {
    store.setUnsavedChanges(true);
    store.setStateChanges(true);
    store.setSearchOffences(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM_MOCK);
    store.resetSearchOffencesStore();
    expect(store.searchOffences()).toEqual(FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM);
    expect(store.unsavedChanges()).toBeFalse();
    expect(store.stateChanges()).toBeFalse();
  });
});
