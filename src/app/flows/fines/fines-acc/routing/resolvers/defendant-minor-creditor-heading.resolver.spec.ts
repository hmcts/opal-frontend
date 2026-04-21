import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { minorCreditorAccountHeadingResolver } from './defendant-minor-creditor-heading.resolver';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from '../../fines-acc-minor-creditor-details/mocks/fines-acc-minor-creditor-details-header.mock';
import { MOCK_FINES_ACCOUNT_STATE } from '../../mocks/fines-acc-state.mock';
import { IOpalFinesAccountMinorCreditorDetailsHeader } from '../../fines-acc-minor-creditor-details/interfaces/fines-acc-minor-creditor-details-header.interface';

describe('minorCreditorAccountHeadingResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPayloadService: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getMinorCreditorAccountHeadingData: vi.fn().mockName('OpalFines.getMinorCreditorAccountHeadingData'),
    };

    mockAccountStore = {
      setAccountState: vi.fn().mockName('FinesAccountStore.setAccountState'),
    };

    mockPayloadService = {
      transformMinorCreditorAccountHeaderForStore: vi
        .fn()
        .mockName('FinesAccPayloadService.transformMinorCreditorAccountHeaderForStore'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    });
  });

  it('should fetch heading data, set account state and return transformed payload', async () => {
    const accountId = 12345;
    mockOpalFinesService.getMinorCreditorAccountHeadingData.mockReturnValue(
      of(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
    );
    mockPayloadService.transformMinorCreditorAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);
    mockPayloadService.transformPayload.mockReturnValue(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({ accountId: String(accountId) }) } as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        minorCreditorAccountHeadingResolver(route, state) as Observable<IOpalFinesAccountMinorCreditorDetailsHeader>,
      ),
    );

    expect(mockOpalFinesService.getMinorCreditorAccountHeadingData).toHaveBeenCalledWith(accountId);
    expect(mockPayloadService.transformMinorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      accountId,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(result).toEqual(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
  });

  it('should use accountId 0 when route param is missing', async () => {
    mockOpalFinesService.getMinorCreditorAccountHeadingData.mockReturnValue(
      of(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
    );
    mockPayloadService.transformMinorCreditorAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);
    mockPayloadService.transformPayload.mockReturnValue(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({}) } as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        minorCreditorAccountHeadingResolver(route, state) as Observable<IOpalFinesAccountMinorCreditorDetailsHeader>,
      ),
    );

    expect(mockOpalFinesService.getMinorCreditorAccountHeadingData).toHaveBeenCalledWith(0);
    expect(mockPayloadService.transformMinorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      0,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
  });

  it('should propagate service errors and not mutate account store', async () => {
    mockOpalFinesService.getMinorCreditorAccountHeadingData.mockReturnValue(throwError(() => new Error('API error')));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({ accountId: '12345' }) } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    await expect(
      TestBed.runInInjectionContext(() =>
        firstValueFrom(
          minorCreditorAccountHeadingResolver(route, state) as Observable<IOpalFinesAccountMinorCreditorDetailsHeader>,
        ),
      ),
    ).rejects.toThrow('API error');

    expect(mockAccountStore.setAccountState).not.toHaveBeenCalled();
    expect(mockPayloadService.transformMinorCreditorAccountHeaderForStore).not.toHaveBeenCalled();
    expect(mockPayloadService.transformPayload).not.toHaveBeenCalled();
  });
});
