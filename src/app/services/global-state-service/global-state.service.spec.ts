import { TestBed } from '@angular/core/testing';
import { GlobalStateService } from './global-state.service';

describe('GlobalStateService', () => {
  let service: GlobalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
