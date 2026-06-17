import { TestBed } from '@angular/core/testing';
import { convertToParamMap, RedirectCommand, Router, UrlTree } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../../mocks/fines-acc-state.mock';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../../services/constants/fines-acc-map-transform-items-config.constant';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK } from '../../fines-acc-major-creditor-details/mocks/fines-acc-major-creditor-details-header.mock';
import { IOpalFinesAccountMajorCreditorDetailsHeader } from '../../fines-acc-major-creditor-details/interfaces/fines-acc-major-creditor-details-header.interface';
import { majorCreditorAccountHeadingResolver } from './major-creditor-heading.resolver';
import { FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS } from '../constants/fines-acc-major-creditor-routing-paths.constant';

describe('majorCreditorAccountHeadingResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccPayloadService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(() => {
    mockFinesService = {
      getMajorCreditorAccountHeadingData: vi.fn().mockName('OpalFines.getMajorCreditorAccountHeadingData'),
    };
    mockFinesService.getMajorCreditorAccountHeadingData.mockReturnValue(
      of(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK),
    );

    mockAccountStore = {
      setAccountState: vi.fn().mockName('FinesAccountStore.setAccountState'),
    };

    mockAccPayloadService = {
      transformMajorCreditorAccountHeaderForStore: vi
        .fn()
        .mockName('FinesAccPayloadService.transformMajorCreditorAccountHeaderForStore'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
    };
    mockAccPayloadService.transformMajorCreditorAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);
    mockAccPayloadService.transformPayload.mockReturnValue(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);

    mockRouter = {
      createUrlTree: vi
        .fn()
        .mockName('Router.createUrlTree')
        .mockReturnValue({} as UrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockAccPayloadService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should run resolver pipeline, update account store and return transformed heading data', async () => {
    const accountId = 12345;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({ accountId }) } as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        majorCreditorAccountHeadingResolver(
          route,
          {} as never,
        ) as Observable<IOpalFinesAccountMajorCreditorDetailsHeader>,
      ),
    );

    expect(mockFinesService.getMajorCreditorAccountHeadingData).toHaveBeenCalledWith(accountId);
    expect(mockAccPayloadService.transformMajorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      accountId,
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
    expect(mockAccPayloadService.transformPayload).toHaveBeenCalledWith(
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(result).toBe(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
  });

  it('should redirect to major creditor details when accountId route param is missing', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({}) } as any;

    const result = TestBed.runInInjectionContext(() =>
      majorCreditorAccountHeadingResolver(route, {} as never),
    ) as RedirectCommand;

    expect(mockFinesService.getMajorCreditorAccountHeadingData).not.toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.children.details]);
    expect(result).toBeInstanceOf(RedirectCommand);
  });

  it('should redirect to major creditor details when heading data cannot be fetched', async () => {
    const accountId = 12345;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({ accountId }) } as any;
    mockFinesService.getMajorCreditorAccountHeadingData.mockReturnValue(throwError(() => new Error('Not found')));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        majorCreditorAccountHeadingResolver(route, {} as never) as Observable<
          IOpalFinesAccountMajorCreditorDetailsHeader | RedirectCommand
        >,
      ),
    );

    expect(mockFinesService.getMajorCreditorAccountHeadingData).toHaveBeenCalledWith(accountId);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_MAJOR_CREDITOR_ROUTING_PATHS.children.details]);
    expect(result).toBeInstanceOf(RedirectCommand);
  });
});
