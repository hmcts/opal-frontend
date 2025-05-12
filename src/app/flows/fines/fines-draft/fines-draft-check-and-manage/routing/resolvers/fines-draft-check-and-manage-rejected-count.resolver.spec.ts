import { TestBed } from '@angular/core/testing';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finesDraftCheckAndManageRejectedCountResolver } from './fines-draft-check-and-manage-rejected-count.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { OpalFinesDraftAccountStatuses } from '@services/fines/opal-fines-service/enums/opal-fines-draft-account-statuses.enum';

describe('finesDraftCheckAndManageRejectedCountResolver', () => {
  const executeResolver: ResolveFn<number> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesDraftCheckAndManageRejectedCountResolver(...resolverParameters));

  let opalFinesServiceMock: jasmine.SpyObj<OpalFines>;
  let globalStoreMock: GlobalStoreType;

  beforeEach(() => {
    opalFinesServiceMock = jasmine.createSpyObj('OpalFines', ['getDraftAccounts']);

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: opalFinesServiceMock }],
    });

    globalStoreMock = TestBed.inject(GlobalStore);
    globalStoreMock.setUserState(SESSION_USER_STATE_MOCK);
  });

  it('should resolve the count of rejected draft accounts', async () => {
    opalFinesServiceMock.getDraftAccounts.and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));

    const route = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as jasmine.SpyObj<RouterStateSnapshot>;

    const result = await lastValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<number | RedirectCommand>,
    );
    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses: [OpalFinesDraftAccountStatuses.rejected],
    });
  });
});
