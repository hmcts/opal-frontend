import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of, Observable } from 'rxjs';
import { finesDraftCreateAndManageViewAllRejectedResolver } from './fines-draft-create-and-manage-view-all-rejected.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { FINES_DRAFT_TAB_STATUSES } from '../../../constants/fines-draft-tab-statuses.constant';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

describe('finesDraftCreateAndManageViewAllRejectedResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesDraftCreateAndManageViewAllRejectedResolver(...resolverParameters));

  let opalFinesServiceMock: jasmine.SpyObj<OpalFines>;
  let dateServiceMock: jasmine.SpyObj<DateService>;
  let globalStoreMock: GlobalStoreType;

  beforeEach(() => {
    opalFinesServiceMock = jasmine.createSpyObj('OpalFines', ['getDraftAccounts']);
    dateServiceMock = jasmine.createSpyObj('dateService', ['getDateRange']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: opalFinesServiceMock },
        GlobalStore,
        { provide: DateService, useValue: dateServiceMock },
      ],
    });

    globalStoreMock = TestBed.inject(GlobalStore);
    globalStoreMock.setUserState(USER_STATE_MOCK);
  });

  const originalStatuses = [...FINES_DRAFT_TAB_STATUSES];

  afterEach(() => {
    FINES_DRAFT_TAB_STATUSES.length = 0;
    FINES_DRAFT_TAB_STATUSES.push(...originalStatuses);
  });

  it('should return result from getDraftAccounts with expected params', async () => {
    opalFinesServiceMock.getDraftAccounts.and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));
    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: ['Rejected'],
      notSubmittedBy: USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
  });

  it('should return { count: 0, summaries: [] }', async () => {
    const originalStatuses = [...FINES_DRAFT_TAB_STATUSES];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (FINES_DRAFT_TAB_STATUSES as any).length = 0; // clears the array in-place

    const mockRoute = {} as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any));

    expect(result).toEqual({ count: 0, summaries: [] });
    expect(opalFinesServiceMock.getDraftAccounts).not.toHaveBeenCalled();

    FINES_DRAFT_TAB_STATUSES.push(...originalStatuses); // restore original
  });
});
