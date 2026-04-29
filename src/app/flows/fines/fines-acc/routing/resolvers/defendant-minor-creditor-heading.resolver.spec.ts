import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../../mocks/fines-acc-state.mock';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from '../../fines-acc-minor-creditor-details/mocks/fines-acc-minor-creditor-details-header.mock';
import { IOpalFinesAccountMinorCreditorDetailsHeader } from '../../fines-acc-minor-creditor-details/interfaces/fines-acc-minor-creditor-details-header.interface';
import { minorCreditorAccountHeadingResolver } from './defendant-minor-creditor-heading.resolver';

describe('minorCreditorAccountHeadingResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccPayloadService: any;

  beforeEach(() => {
    mockFinesService = {
      getMinorCreditorAccountHeadingData: vi.fn().mockName('OpalFines.getMinorCreditorAccountHeadingData'),
    };
    mockFinesService.getMinorCreditorAccountHeadingData.mockReturnValue(
      of(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK),
    );

    mockAccountStore = {
      setAccountState: vi.fn().mockName('FinesAccountStore.setAccountState'),
    };

    mockAccPayloadService = {
      transformMinorCreditorAccountHeaderForStore: vi
        .fn()
        .mockName('FinesAccPayloadService.transformMinorCreditorAccountHeaderForStore'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
    };
    mockAccPayloadService.transformMinorCreditorAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);
    mockAccPayloadService.transformPayload.mockReturnValue(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockAccPayloadService },
      ],
    });
  });

  it('should run resolver pipeline, update account store and return transformed heading data', async () => {
    const accountId = 12345;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({ accountId }) } as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        minorCreditorAccountHeadingResolver(
          route,
          {} as never,
        ) as Observable<IOpalFinesAccountMinorCreditorDetailsHeader>,
      ),
    );

    expect(mockFinesService.getMinorCreditorAccountHeadingData).toHaveBeenCalledWith(accountId);
    expect(mockAccPayloadService.transformMinorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      accountId,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
    expect(mockAccPayloadService.transformPayload).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(result).toBe(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);
  });
});
