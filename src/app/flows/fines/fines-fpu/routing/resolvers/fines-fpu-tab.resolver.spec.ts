import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK,
  FINES_FPU_PAYLOAD_USER_STATE_MOCK,
} from '../../services/mocks/fines-fpu-payload.mock';
import { FINES_FPU_RESOLVER_EMPTY_RESPONSE } from './constants/fines-fpu-resolver-empty-response.constant';
import { finesFpuTabResolver } from './fines-fpu-tab.resolver';

describe('finesFpuTabResolver', () => {
  let opalFines: { getDraftAccounts: ReturnType<typeof vi.fn> };
  let userState: IOpalUserState;
  let response: IOpalFinesDraftAccountsResponse;

  const runResolver = (fragment: string | null): Promise<IOpalFinesDraftAccountsResponse> =>
    TestBed.runInInjectionContext(() =>
      firstValueFrom(
        finesFpuTabResolver(
          { fragment } as ActivatedRouteSnapshot,
          {} as RouterStateSnapshot,
        ) as Observable<IOpalFinesDraftAccountsResponse>,
      ),
    );

  beforeEach(() => {
    response = {
      count: 1,
      summaries: [structuredClone(FINES_FPU_PAYLOAD_DRAFT_ACCOUNT_SUMMARY_MOCK)],
    };
    userState = structuredClone(FINES_FPU_PAYLOAD_USER_STATE_MOCK);
    opalFines = { getDraftAccounts: vi.fn().mockReturnValue(of(response)) };

    TestBed.configureTestingModule({ providers: [{ provide: OpalFines, useValue: opalFines }] });
    TestBed.inject(GlobalStore).setUserState(userState);
  });

  it.each([null, '', 'to-publish', 'unsupported-tab'])(
    'resolves submitted VPFPO accounts for permitted business units for fragment %s',
    async (fragment) => {
      const originalUserState = structuredClone(userState);
      const originalResponse = structuredClone(response);

      const result = await runResolver(fragment);

      expect(opalFines.getDraftAccounts).toHaveBeenCalledExactlyOnceWith({
        source: 'VPFPO',
        businessUnitIds: [78, 12, 90],
        statuses: ['Submitted'],
      });
      expect(result).toBe(response);
      expect(result).toEqual(originalResponse);
      expect(TestBed.inject(GlobalStore).userState()).toEqual(originalUserState);
    },
  );

  it.each(['published', 'upload-errors'])(
    'returns the standard empty response without requesting draft accounts for #%s',
    async (fragment) => {
      await expect(runResolver(fragment)).resolves.toEqual(FINES_FPU_RESOLVER_EMPTY_RESPONSE);

      expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
    },
  );

  it('returns an empty response without requesting accounts when no business unit has publish permission', async () => {
    userState.business_unit_users.forEach((businessUnitUser) => (businessUnitUser.permissions = []));
    TestBed.inject(GlobalStore).setUserState(userState);

    await expect(runResolver(null)).resolves.toEqual(FINES_FPU_RESOLVER_EMPTY_RESPONSE);

    expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('returns an empty response without requesting accounts when the user has no business units', async () => {
    TestBed.inject(GlobalStore).setUserState({ ...userState, business_unit_users: [] });

    await expect(runResolver(null)).resolves.toEqual(FINES_FPU_RESOLVER_EMPTY_RESPONSE);

    expect(opalFines.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('propagates a failed request instead of presenting it as an empty account response', async () => {
    const error = new Error('Draft accounts unavailable');
    opalFines.getDraftAccounts.mockReturnValue(throwError(() => error));

    await expect(runResolver(null)).rejects.toBe(error);
  });
});
