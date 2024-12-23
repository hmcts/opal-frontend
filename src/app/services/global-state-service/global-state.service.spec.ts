import { TestBed } from '@angular/core/testing';
import { GlobalStateService } from './global-state.service';

describe('GlobalStateService', () => {
  let service: GlobalStateService | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalStateService);
  });

  afterAll(() => {
    service = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store error state', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const message = 'Test message';
    service.error.set({ error: true, message: message });
    expect(service.error().error).toBeTruthy();
    expect(service.error().message).toEqual(message);
  });

  it('should have initial authenticated state as false', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    expect(service.authenticated()).toBe(false);
  });

  it('should have an authenticated state of true', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.authenticated.set(true);
    expect(service.authenticated()).toBe(true);
  });
});
