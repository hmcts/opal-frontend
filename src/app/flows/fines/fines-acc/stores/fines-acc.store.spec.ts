import { TestBed } from '@angular/core/testing';
import { FinesAccountStore } from './fines-acc.store';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { FinesAccountStoreType } from '../types/fines-account-store.type';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';

describe('FinesAccountStore', () => {
  let store: FinesAccountStoreType;
  let initialState: IFinesAccountState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinesAccountStore],
    });
    store = TestBed.inject(FinesAccountStore);
    initialState = structuredClone(FINES_ACCOUNT_STATE);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty strings', () => {
    expect(store.account_number()).toBe(null);
    expect(store.party_id()).toBe(null);
    expect(store.party_name()).toBe(null);
    expect(store.party_type()).toBe(null);
    expect(store.base_version()).toBe(null);
    expect(store.business_unit_user_id()).toBe(null);
  });

  it('setAccountState should set all fields at once', () => {
    const payload: IFinesAccountState = MOCK_FINES_ACCOUNT_STATE;

    store.setAccountState(payload);

    expect(store.account_number()).toBe(payload.account_number);
    expect(store.party_id()).toBe(payload.party_id);
    expect(store.party_type()).toBe(payload.party_type);
    expect(store.party_name()).toBe(payload.party_name);
    expect(store.base_version()).toBe(payload.base_version);
    expect(store.business_unit_user_id()).toBe(payload.business_unit_user_id);
  });

  it('getAccountState should return a snapshot of current state', () => {
    const payload: IFinesAccountState = MOCK_FINES_ACCOUNT_STATE;

    store.setAccountState(payload);

    const snapshot = store.getAccountState();

    expect(snapshot).toEqual({
      account_number: payload.account_number,
      account_id: payload.account_id,
      party_id: payload.party_id,
      party_type: payload.party_type,
      party_name: payload.party_name,
      base_version: payload.base_version,
      business_unit_id: payload.business_unit_id,
      business_unit_user_id: payload.business_unit_user_id,
    });
  });

  it('clearAccountState should reset to FINES_ACCOUNT_STATE', () => {
    const payload: IFinesAccountState = MOCK_FINES_ACCOUNT_STATE;

    store.setAccountState(payload);

    store.clearAccountState();

    const current = store.getAccountState();
    expect(current).toEqual({
      account_number: initialState.account_number,
      account_id: initialState.account_id,
      party_id: initialState.party_id,
      party_type: initialState.party_type,
      party_name: initialState.party_name,
      base_version: initialState.base_version,
      business_unit_id: initialState.business_unit_id,
      business_unit_user_id: initialState.business_unit_user_id,
    });
  });

  it('should getAccountNumber', () => {
    const payload: IFinesAccountState = MOCK_FINES_ACCOUNT_STATE;

    store.setAccountState(payload);

    const accountNumber = store.getAccountNumber();

    expect(accountNumber).toBe(payload.account_number || '');
  });

  it('should return an empty string if account number is not set', () => {
    const accountNumber = store.getAccountNumber();
    expect(accountNumber).toBe('');
  });

  it('should set version mismatch', () => {
    store.setHasVersionMismatch(true);
    expect(store.hasVersionMismatch()).toBe(true);
  });

  it('should set success message', () => {
    store.setSuccessMessage('Success');
    expect(store.successMessage()).toBe('Success');
  });

  it('should clear success message', () => {
    store.setSuccessMessage('Success');
    expect(store.successMessage()).toBe('Success');
    store.clearSuccessMessage();
    expect(store.successMessage()).toBe(null);
  });
});
