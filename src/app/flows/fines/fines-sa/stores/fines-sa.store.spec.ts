import { TestBed } from '@angular/core/testing';
import { FinesSaStore } from './fines-sa.store';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FinesSaStoreType } from './types/fines-sa.type';

describe('FinesSaStore', () => {
  let store: FinesSaStoreType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinesSaStore],
    });
    store = TestBed.inject(FinesSaStore);
  });

  it('should initialise with the default state', () => {
    expect(store.searchAccount()).toEqual(FINES_SA_SEARCH_ACCOUNT_STATE);
    expect(store.activeTab()).toBe('individuals');
    expect(store.stateChanges()).toBeFalse();
    expect(store.unsavedChanges()).toBeFalse();
    expect(store.searchAccountPopulated()).toBeFalse();
  });

  it('should patch searchAccount state via setSearchAccount', () => {
    const newState = { ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_number: '12345678' };
    store.setSearchAccount(newState as IFinesSaSearchAccountState);
    expect(store.searchAccount().fsa_search_account_number).toBe('12345678');
    expect(store.stateChanges()).toBeTrue();
    expect(store.unsavedChanges()).toBeFalse();
    expect(store.searchAccountPopulated()).toBeFalse();
  });

  it('should temporarily patch searchAccount via setSearchAccountTemporary', () => {
    const tempState = { ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_number: 'TEMP' };
    store.setSearchAccountTemporary(tempState as IFinesSaSearchAccountState);
    expect(store.searchAccount().fsa_search_account_number).toBe('TEMP');
    expect(store.searchAccountPopulated()).toBeTrue();
  });

  it('should update the active tab', () => {
    store.setActiveTab('companies');
    expect(store.activeTab()).toBe('companies');
  });

  it('should update stateChanges and unsavedChanges flags', () => {
    store.setStateChanges(true);
    expect(store.stateChanges()).toBeTrue();

    store.setUnsavedChanges(true);
    expect(store.unsavedChanges()).toBeTrue();
  });

  it('should reset only the searchAccount object', () => {
    store.setSearchAccount({ ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_number: 'abc' });
    store.resetSearchAccount();
    expect(store.searchAccount()).toEqual(FINES_SA_SEARCH_ACCOUNT_STATE);
  });

  it('should reset stateChanges and unsavedChanges', () => {
    store.setStateChanges(true);
    store.setUnsavedChanges(true);
    store.resetStateChangesUnsavedChanges();
    expect(store.stateChanges()).toBeFalse();
    expect(store.unsavedChanges()).toBeFalse();
  });

  it('should fully reset the store', () => {
    store.setActiveTab('companies');
    store.setSearchAccount({ ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_number: 'abc' });
    store.setStateChanges(true);
    store.setUnsavedChanges(true);

    store.resetStore();
    expect(store.searchAccount()).toEqual(FINES_SA_SEARCH_ACCOUNT_STATE);
    expect(store.activeTab()).toBe('individuals');
    expect(store.stateChanges()).toBeFalse();
    expect(store.unsavedChanges()).toBeFalse();
  });

  it('should expose the correct filter path from computed getter', () => {
    expect(store.getFilterByBusinessUnitsPath()).toBe('filter-business-units');
  });
});
