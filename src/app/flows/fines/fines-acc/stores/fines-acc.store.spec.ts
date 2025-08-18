import { TestBed } from '@angular/core/testing';
import { FinesAccountStore } from './fines-acc.store';
import { FINES_ACCOUNT_STATE } from '../constants/fines-account-state.constant';
import { IFinesAccountState } from '../interfaces/fines-acc-state-interface';
import { FinesAccountStoreType } from '../types/fines-account-store.type';

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
    expect(store.version()).toBe(null);
  });

  it('setAccountState should set all fields at once', () => {
    const payload: IFinesAccountState = {
      account_number: 77,
      party_id: 'PARTY-123',
      party_type: 'business',
      party_name: 'Acme Ltd',
      version: 'v3',
    };

    store.setAccountState(payload);

    expect(store.account_number()).toBe(77);
    expect(store.party_id()).toBe('PARTY-123');
    expect(store.party_type()).toBe('business');
    expect(store.party_name()).toBe('Acme Ltd');
    expect(store.version()).toBe('v3');
  });

  it('getAccountState should return a snapshot of current state', () => {
    const payload: IFinesAccountState = {
      account_number: 88,
      party_id: 'PARTY-123',
      party_type: 'individual',
      party_name: 'Jane Doe',
      version: 'v4',
    };

    store.setAccountState(payload);

    const snapshot = store.getAccountState();

    expect(snapshot).toEqual({
      account_number: 88,
      party_id: 'PARTY-123',
      party_type: 'individual',
      party_name: 'Jane Doe',
      version: 'v4',
    });
  });

  it('clearAccountState should reset to FINES_ACCOUNT_STATE', () => {
    store.setAccountState({
      account_number: 99,
      party_id: 'Y',
      party_type: 'Z',
      party_name: 'A',
      version: '1',
    });

    store.clearAccountState();

    const current = store.getAccountState();
    expect(current).toEqual({
      account_number: initialState.account_number,
      party_id: initialState.party_id,
      party_type: initialState.party_type,
      party_name: initialState.party_name,
      version: initialState.version,
    });
  });
});
