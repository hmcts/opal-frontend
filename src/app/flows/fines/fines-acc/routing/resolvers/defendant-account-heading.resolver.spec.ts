import { TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of, firstValueFrom, Observable } from 'rxjs';
import { defendantAccountHeadingResolver } from './defendant-account-heading.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { MOCK_FINES_ACCOUNT_STATE } from '../../mocks/fines-acc-state.mock';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';

let mockFinesService: jasmine.SpyObj<OpalFines>;
let mockGlobalStore: jasmine.SpyObj<GlobalStoreType>;
let mockAccountStore: jasmine.SpyObj<InstanceType<typeof FinesAccountStore>>;
let mockAccPayloadService: jasmine.SpyObj<InstanceType<typeof FinesAccPayloadService>>;

describe('defendantAccountHeadingResolver', () => {
  beforeEach(() => {
    mockFinesService = jasmine.createSpyObj('OpalFines', ['getDefendantAccountHeadingData']);
    mockFinesService.getDefendantAccountHeadingData.and.returnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK));

    mockGlobalStore = jasmine.createSpyObj('GlobalStore', ['userState']);
    mockGlobalStore.userState.and.returnValue(SESSION_USER_STATE_MOCK);

    mockAccountStore = jasmine.createSpyObj('FinesAccountStore', ['setAccountState']);

    mockAccPayloadService = jasmine.createSpyObj('FinesAccPayloadService', ['transformAccountHeaderForStore']);
    mockAccPayloadService.transformAccountHeaderForStore.and.returnValue(MOCK_FINES_ACCOUNT_STATE);

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
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
    expect(result).toBe(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
  });
});
