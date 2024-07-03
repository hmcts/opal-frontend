import { TestBed } from '@angular/core/testing';
import { ExpiryService } from './expiry.service';
import { GlobalStateService } from '@services';
import { DateTime, Settings } from 'luxon';
import { ITokenExpiry } from '@interfaces';
import { TOKEN_EXPIRY_MOCK } from '@mocks';

const tokenExpiry: ITokenExpiry = TOKEN_EXPIRY_MOCK;

describe('ExpiryService', () => {
  let service: ExpiryService;
  let globalStateService: GlobalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalStateService],
    });
    service = TestBed.inject(ExpiryService);
    globalStateService = TestBed.inject(GlobalStateService);
  });

  beforeEach(() => {
    // specify date time now to return 2024/07/02 00:00
    const expectedNow = DateTime.local(2024, 7, 2, 0, 0);
    Settings.now = () => expectedNow.toMillis();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set sessionTimeoutWarning to true when minutesDifference is less than 30', () => {
    const minutesDifference = 20;
    spyOn(service, 'calculateMinuteDifference').and.returnValue(minutesDifference);

    service.checkExpiry();

    expect(globalStateService.sessionTimeoutWarning()).toBe(true);
  });

  it('should set sessionTimeoutWarning to false when minutesDifference is greater than or equal to 30', () => {
    const minutesDifference = 40;
    spyOn(service, 'calculateMinuteDifference').and.returnValue(minutesDifference);

    service.checkExpiry();

    expect(globalStateService.sessionTimeoutWarning()).toBe(false);
  });

  it('should calculate minute difference correctly', () => {
    const expectedMinuteDifference = 10;
    globalStateService.tokenExpiry = tokenExpiry;
    globalStateService.tokenExpiry.expiry = DateTime.now().plus({ minutes: 10 }).toISO();

    const minuteDifference = service.calculateMinuteDifference();

    expect(minuteDifference).toEqual(expectedMinuteDifference);
  });

  it('should return 0 when expiryTimestamp is not available', () => {
    const expectedMinuteDifference = 0;
    globalStateService.tokenExpiry = tokenExpiry;
    globalStateService.tokenExpiry.expiry = null;

    const minuteDifference = service.calculateMinuteDifference();

    expect(minuteDifference).toEqual(expectedMinuteDifference);
  });

  it('should return 0 when expiryTimestamp is in the past', () => {
    globalStateService.tokenExpiry = tokenExpiry;
    globalStateService.tokenExpiry.expiry = '2023-07-03T12:30:00Z';
    const expectedNow = DateTime.fromISO('2023-07-03T13:00:00Z');
    Settings.now = () => expectedNow.toMillis();

    const result = service.calculateMinuteDifference.call({ globalStateService });

    expect(result).toBe(0);
  });

  it('should return 0 when expiryTimestamp is exactly the same as the current time', () => {
    const expectedNow = DateTime.fromISO('2023-07-03T12:30:00Z');
    Settings.now = () => expectedNow.toMillis();

    const mockGlobalStateService = {
      sessionTimeout: '2023-07-03T12:30:00Z',
    };

    const result = service.calculateMinuteDifference.call({ globalStateService: mockGlobalStateService });

    expect(result).toBe(0);
  });
});
