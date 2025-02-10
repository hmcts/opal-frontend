import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { AppInsightsService } from './app-insights.service';
import { TransferStateService } from '@services/transfer-state-service/transfer-state.service';
import { TRANSFER_STATE_MOCK } from '../transfer-state-service/mocks';
import { ITelemetryItem } from '@microsoft/applicationinsights-web';

describe('AppInsightsService', () => {
  let service: AppInsightsService;
  let trackPageViewSpy: jasmine.Spy;
  let trackExceptionSpy: jasmine.Spy;
  let transferStateServiceMock: jasmine.SpyObj<TransferStateService>;

  beforeEach(() => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' });

    // Mock `TransferStateService`
    transferStateServiceMock = jasmine.createSpyObj<TransferStateService>('TransferStateService', [], {
      serverTransferState: TRANSFER_STATE_MOCK,
    });

    TestBed.configureTestingModule({
      providers: [AppInsightsService, { provide: TransferStateService, useValue: transferStateServiceMock }],
    });

    service = TestBed.inject(AppInsightsService);

    // Spy on the `trackPageView` and `trackException` methods of `appInsights`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((service as any).appInsights) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      trackPageViewSpy = spyOn((service as any).appInsights, 'trackPageView');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      trackExceptionSpy = spyOn((service as any).appInsights, 'trackException');
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not initialize Application Insights on server', () => {
    TestBed.resetTestingModule();
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

    service = TestBed.inject(AppInsightsService);

    expect(service).toBeDefined();
  });

  it('should correctly set telemetry initializer', () => {
    const mockEnvelope: ITelemetryItem = { name: 'Test Event', tags: {} };

    service['telemetryInitializer'](mockEnvelope);

    expect(mockEnvelope.tags).toEqual({ 'ai.cloud.role': 'opal-frontend' });
  });

  it('should correctly set telemetry initializer - tag undefined', () => {
    const mockEnvelope: ITelemetryItem = { name: 'Test Event', tags: undefined };

    service['telemetryInitializer'](mockEnvelope);

    expect(mockEnvelope.tags).toEqual({ 'ai.cloud.role': 'opal-frontend' });
  });

  it('should track a page view', () => {
    const pageName = 'Test Page';
    const pageUrl = '/test-url';

    service.logPageView(pageName, pageUrl);

    expect(trackPageViewSpy).toHaveBeenCalledTimes(1);
    expect(trackPageViewSpy).toHaveBeenCalledWith({ name: pageName, uri: pageUrl });
  });

  it('should track an exception', () => {
    const error = new Error('Test Error');
    const severityLevel = 2;

    service.logException(error, severityLevel);

    expect(trackExceptionSpy).toHaveBeenCalledTimes(1);
    expect(trackExceptionSpy).toHaveBeenCalledWith({ exception: error, severityLevel });
  });

  it('should not track a page view if appInsightsConfig.enabled is false', () => {
    // Clone and modify `TRANSFER_STATE_MOCK`
    const transferStateMock = structuredClone(TRANSFER_STATE_MOCK);
    transferStateMock.appInsightsConfig.enabled = false;

    transferStateServiceMock = jasmine.createSpyObj<TransferStateService>('TransferStateService', [], {
      serverTransferState: transferStateMock,
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AppInsightsService, { provide: TransferStateService, useValue: transferStateServiceMock }],
    });

    service = TestBed.inject(AppInsightsService);

    service.logPageView('Test Page', '/test-url');

    expect(trackPageViewSpy).not.toHaveBeenCalled();
  });

  it('should not track an exception if appInsightsConfig.enabled is false', () => {
    // Clone and modify `TRANSFER_STATE_MOCK`
    const transferStateMock = structuredClone(TRANSFER_STATE_MOCK);
    transferStateMock.appInsightsConfig.enabled = false;

    transferStateServiceMock = jasmine.createSpyObj<TransferStateService>('TransferStateService', [], {
      serverTransferState: transferStateMock,
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AppInsightsService, { provide: TransferStateService, useValue: transferStateServiceMock }],
    });

    service = TestBed.inject(AppInsightsService);

    const error = new Error('Test Error');
    service.logException(error);

    expect(trackExceptionSpy).not.toHaveBeenCalled();
  });
});
