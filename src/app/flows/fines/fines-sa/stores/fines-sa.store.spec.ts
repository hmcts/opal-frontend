import { TestBed } from '@angular/core/testing';
import { FinesSaStore } from './fines-sa.store';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../fines-sa-search/fines-sa-search-account/constants/fines-sa-search-account-state.constant';
import { IFinesSaSearchAccountState } from '../fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';
import { FinesSaStoreType } from './types/fines-sa.type';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individuals-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-companies/mocks/fines-sa-search-account-form-companies-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/mocks/fines-sa-search-account-form-minor-creditors-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE } from '../fines-sa-search/fines-sa-search-account/fines-sa-search-account-form/fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-state.constant';

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
    expect(store.getSearchType()).toBe('accountNumber');
  });

  it('should patch searchAccount state with reference or case number', () => {
    const newState = { ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_reference_case_number: 'REF123' };
    store.setSearchAccount(newState as IFinesSaSearchAccountState);
    expect(store.searchAccount().fsa_search_account_reference_case_number).toBe('REF123');
    expect(store.getSearchType()).toBe('referenceCaseNumber');
  });

  it('should patch searchAccount state with individual search criteria', () => {
    const newState = {
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_individual_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
    };
    store.setSearchAccount(newState as IFinesSaSearchAccountState);
    expect(store.searchAccount().fsa_search_account_individual_search_criteria).toEqual(
      FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
    );
    expect(store.getSearchType()).toBe('individuals');
  });

  it('should patch searchAccount state with companies search criteria', () => {
    const newState = {
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_companies_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK,
    };
    store.setSearchAccount(newState as IFinesSaSearchAccountState);
    expect(store.searchAccount().fsa_search_account_companies_search_criteria).toEqual(
      FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE_MOCK,
    );
    expect(store.getSearchType()).toBe('companies');
  });

  it('should patch searchAccount state with minor creditors search criteria', () => {
    const newState = {
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_minor_creditors_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK,
    };
    store.setSearchAccount(newState as IFinesSaSearchAccountState);
    expect(store.searchAccount().fsa_search_account_minor_creditors_search_criteria).toEqual(
      FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK,
    );
    expect(store.getSearchType()).toBe('minorCreditors');
  });

  it('should fall back to accountNumber when all criteria are null or empty', () => {
    const nullCriteriaState: IFinesSaSearchAccountState = {
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_individual_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE,
    };

    store.setSearchAccount(nullCriteriaState);
    expect(store.getSearchType()).toBe('accountNumber');
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

  it('should reset search criteria only', () => {
    store.setSearchAccount({ ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_number: 'reset-me' });
    store.resetDefendantSearchCriteria();
    expect(store.searchAccount().fsa_search_account_individual_search_criteria).toEqual(null);
  });

  it('should reset only the searchAccount object', () => {
    store.setSearchAccount({ ...FINES_SA_SEARCH_ACCOUNT_STATE, fsa_search_account_number: 'abc' });
    store.resetSearchAccount();
    expect(store.searchAccount()).toEqual({} as IFinesSaSearchAccountState);
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
    expect(store.searchAccount()).toEqual({} as IFinesSaSearchAccountState);
    expect(store.activeTab()).toBe('individuals');
    expect(store.stateChanges()).toBeFalse();
    expect(store.unsavedChanges()).toBeFalse();
  });

  it('should expose the correct filter path from computed getter', () => {
    expect(store.getFilterByBusinessUnitsPath()).toBe('filter-business-units');
  });
});
