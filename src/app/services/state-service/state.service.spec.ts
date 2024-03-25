import { TestBed } from '@angular/core/testing';

import { StateService } from './state.service';
import { SEARCH_STATE_MOCK } from '@mocks';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store search state', () => {
    service.accountEnquiry = { search: SEARCH_STATE_MOCK };
    expect(service.accountEnquiry.search).toEqual(SEARCH_STATE_MOCK);
  });

  it('should store error state', () => {
    const message = 'Test message';
    service.error.set({ error: true, message: message });
    expect(service.error().error).toBeTruthy();
    expect(service.error().message).toEqual(message);
  });

  it('should have initial authenticated state as false', () => {
    expect(service.authenticated()).toBe(false);
  });

  it('should have an authenticated state of true', () => {
    service.authenticated.set(true);
    expect(service.authenticated()).toBe(true);
  });
});
