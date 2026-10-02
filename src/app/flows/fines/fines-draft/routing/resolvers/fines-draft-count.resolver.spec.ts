import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { lastValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { finesDraftCountResolver } from './fines-draft-count.resolver';

describe('finesDraftCountResolver', () => {
  const executeResolver =
    (options: Parameters<typeof finesDraftCountResolver>[0]) =>
    (...resolverParameters: Parameters<ResolveFn<unknown>>) =>
      TestBed.runInInjectionContext(() => finesDraftCountResolver(options)(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let opalFinesServiceMock: any;
  let globalStoreMock: GlobalStoreType;

  beforeEach(() => {
    opalFinesServiceMock = {
      getDraftAccounts: vi.fn().mockName('OpalFines.getDraftAccounts'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: opalFinesServiceMock }],
    });

    globalStoreMock = TestBed.inject(GlobalStore);
    globalStoreMock.setUserState(OPAL_USER_STATE_MOCK);
    opalFinesServiceMock.getDraftAccounts.mockReturnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));
  });

  it('should resolve a submitted-by count', async () => {
    const resolver = executeResolver({
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
      includeSubmittedBy: true,
      includeNotSubmittedBy: false,
    });
    const route = {} as ActivatedRouteSnapshot;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(resolver(route, {} as any) as Observable<number | RedirectCommand>);

    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count);
    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
    });
  });

  it('should resolve a not-submitted-by count', async () => {
    const resolver = executeResolver({
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
      includeSubmittedBy: false,
      includeNotSubmittedBy: true,
    });
    const route = {} as ActivatedRouteSnapshot;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(resolver(route, {} as any) as Observable<number | RedirectCommand>);

    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count);
    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      notSubmittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
    });
  });

  it('should resolve a count without a submitter filter', async () => {
    const statuses = [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted];
    const resolver = executeResolver({ statuses, includeSubmittedBy: false, includeNotSubmittedBy: false });
    const route = {} as ActivatedRouteSnapshot;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await lastValueFrom(resolver(route, {} as any) as Observable<number | RedirectCommand>);

    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count);
    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses,
    });
  });
});
