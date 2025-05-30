import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from '@angular/router';
import { isObservable, lastValueFrom, of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { FINES_DRAFT_TAB_STATUSES } from '../../constants/fines-draft-tab-statuses.constant';
import { finesDraftTabResolver } from './fines-draft-tab.resolver';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from './constants/fines-draft-resolver-empty-response.constant';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';

describe('finesDraftTabResolver', () => {
  let opalFinesServiceMock: jasmine.SpyObj<OpalFines>;
  let globalStoreMock: GlobalStoreType;

  const executeResolver =
    (options: Parameters<typeof finesDraftTabResolver>[0]) =>
    (...resolverParameters: Parameters<ResolveFn<unknown>>) =>
      TestBed.runInInjectionContext(() => finesDraftTabResolver(options)(...resolverParameters));

  async function runResolverWithOptions(
    options: Parameters<typeof finesDraftTabResolver>[0],
    fragment: string | null,
  ): Promise<IOpalFinesDraftAccountsResponse | RedirectCommand> {
    const resolver = executeResolver(options);
    const mockRoute = { fragment } as ActivatedRouteSnapshot;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = resolver(mockRoute, {} as any);
    return isObservable(result) ? await lastValueFrom(result) : result;
  }

  beforeEach(() => {
    opalFinesServiceMock = jasmine.createSpyObj('OpalFines', ['getDraftAccounts']);

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: opalFinesServiceMock }, GlobalStore],
    });

    globalStoreMock = TestBed.inject(GlobalStore);
    globalStoreMock.setUserState(SESSION_USER_STATE_MOCK);
  });

  it('should return result with `submittedBy` when includeSubmittedBy is true', async () => {
    opalFinesServiceMock.getDraftAccounts.and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));

    const tab = FINES_DRAFT_TAB_STATUSES[0];
    const result = await runResolverWithOptions({ useFragmentForStatuses: true, includeSubmittedBy: true }, tab.tab);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses: tab.statuses,
      submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
    });
    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
  });

  it('should return result with `notSubmittedBy` when includeNotSubmittedBy is true', async () => {
    opalFinesServiceMock.getDraftAccounts.and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));

    const tab = FINES_DRAFT_TAB_STATUSES[0];
    const result = await runResolverWithOptions({ useFragmentForStatuses: true, includeNotSubmittedBy: true }, tab.tab);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses: tab.statuses,
      notSubmittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
    });
    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
  });

  it('should return empty response when fragment is invalid', async () => {
    const result = await runResolverWithOptions({ useFragmentForStatuses: true }, 'invalid-fragment');

    expect(result).toEqual(FINES_DRAFT_RESOLVER_EMPTY_RESPONSE);
    expect(opalFinesServiceMock.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should return empty response when fragment is null', async () => {
    const result = await runResolverWithOptions({ useFragmentForStatuses: true }, null);

    expect(result).toEqual(FINES_DRAFT_RESOLVER_EMPTY_RESPONSE);
    expect(opalFinesServiceMock.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should return empty response when no statuses are resolved and no default provided', async () => {
    const result = await runResolverWithOptions({ useFragmentForStatuses: false }, null);

    expect(result).toEqual(FINES_DRAFT_RESOLVER_EMPTY_RESPONSE);
    expect(opalFinesServiceMock.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should use defaultStatuses when provided and not using fragment', async () => {
    const defaultStatuses = ['Draft', 'AwaitingReview'];
    opalFinesServiceMock.getDraftAccounts.and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK)));

    const result = await runResolverWithOptions({ defaultStatuses }, null);

    expect(opalFinesServiceMock.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses: defaultStatuses,
    });
    expect(result).toEqual(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
  });
});
