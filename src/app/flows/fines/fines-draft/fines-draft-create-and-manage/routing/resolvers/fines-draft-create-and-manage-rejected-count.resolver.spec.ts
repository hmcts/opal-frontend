import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesDraftCreateAndManageRejectedCountResolver } from './fines-draft-create-and-manage-rejected-count.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from '@angular/router';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('finesDraftCreateAndManageRejectedCountResolver', () => {
  const executeResolver: ResolveFn<number> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesDraftCreateAndManageRejectedCountResolver(...resolverParameters));

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
  });

  it('should resolve the count of rejected draft accounts', async () => {
    opalFinesServiceMock.getDraftAccounts.mockReturnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));

    const route = {} as ActivatedRouteSnapshot;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {} as any;

    const result = await lastValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<number | RedirectCommand>,
    );
    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
    });
  });
});
