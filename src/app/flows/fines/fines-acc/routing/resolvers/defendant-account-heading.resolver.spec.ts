import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of, firstValueFrom, Observable } from 'rxjs';
import { defendantAccountHeadingResolver } from './defendant-account-heading.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { MOCK_FINES_ACCOUNT_STATE } from '../../mocks/fines-acc-state.mock';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockFinesService: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockGlobalStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockAccountStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockAccPayloadService: any;

describe('defendantAccountHeadingResolver', () => {
  beforeEach(() => {
    mockFinesService = {
      getDefendantAccountHeadingData: vi.fn().mockName('OpalFines.getDefendantAccountHeadingData'),
    };
    mockFinesService.getDefendantAccountHeadingData.mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK));

    mockGlobalStore = {
      userState: vi.fn().mockName('GlobalStore.userState'),
    };
    mockGlobalStore.userState.mockReturnValue(OPAL_USER_STATE_MOCK);

    mockAccountStore = {
      setAccountState: vi.fn().mockName('FinesAccountStore.setAccountState'),
    };

    mockAccPayloadService = {
      transformAccountHeaderForStore: vi.fn().mockName('FinesAccPayloadService.transformAccountHeaderForStore'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
    };
    mockAccPayloadService.transformAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);
    mockAccPayloadService.transformPayload.mockReturnValue(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        { provide: GlobalStore, useValue: mockGlobalStore },
        { provide: FinesAccPayloadService, useValue: mockAccPayloadService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
      ],
    });
  });

  it('should run resolver pipeline, call service and pass data into account store', async () => {
    const accountId = 12345;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const route = { paramMap: convertToParamMap({ accountId }) } as any;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const state = {} as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        defendantAccountHeadingResolver(route, state) as Observable<IOpalFinesAccountDefendantDetailsHeader>,
      ),
    );

    expect(mockFinesService.getDefendantAccountHeadingData).toHaveBeenCalledWith(accountId);
    expect(result).toBe(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
  });
});
