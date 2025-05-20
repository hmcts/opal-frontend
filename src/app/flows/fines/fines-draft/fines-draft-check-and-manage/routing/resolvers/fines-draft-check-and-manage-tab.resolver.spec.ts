import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesDraftCheckAndManageTabResolver } from './fines-draft-check-and-manage-tab.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { FINES_DRAFT_TAB_STATUSES } from '../../../constants/fines-draft-tab-statuses.constant';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

describe('finesDraftCheckAndManageTabResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeResolver: ResolveFn<any> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesDraftCheckAndManageTabResolver(...resolverParameters));

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
    globalStoreMock.setUserState(SESSION_USER_STATE_MOCK);
  });

  it('should call opalFinesService.getDraftAccounts with correct params and return observable result', async () => {
    opalFinesServiceMock.getDraftAccounts.and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));

    const tab = FINES_DRAFT_TAB_STATUSES[0];
    const fragment = tab.tab;
    const statuses = tab.statuses;
    const mockRoute = { fragment } as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses,
      submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
    });
    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
  });

  it('should return { count: 0, summaries: [] } when statuses is null (fragment not found)', async () => {
    const invalidFragment = 'non-existent-fragment';
    const mockRoute = { fragment: invalidFragment } as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(result).toEqual({ count: 0, summaries: [] });
    expect(opalFinesServiceMock.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should return { count: 0, summaries: [] } when fragment is null', async () => {
    const mockRoute = { fragment: null } as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(result).toEqual({ count: 0, summaries: [] });
    expect(opalFinesServiceMock.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should include account status date range in request body if historicWindowIndays is set ', async () => {
    opalFinesServiceMock.getDraftAccounts.and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));
    const dateFrom = '2023-01-01';
    const dateTo = '2023-01-07';

    dateServiceMock.getDateRange.and.returnValue({
      from: dateFrom,
      to: dateTo,
    });

    const tab = FINES_DRAFT_TAB_STATUSES[3];
    const fragment = tab.tab;
    const statuses = tab.statuses;
    const mockRoute = { fragment } as ActivatedRouteSnapshot;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await lastValueFrom(executeResolver(mockRoute, {} as any) as Observable<any>);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses,
      submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
      accountStatusDateFrom: [dateFrom],
      accountStatusDateTo: [dateTo],
    });
    expect(dateServiceMock.getDateRange).toHaveBeenCalledWith(tab.historicWindowInDays, 0);
  });
});
