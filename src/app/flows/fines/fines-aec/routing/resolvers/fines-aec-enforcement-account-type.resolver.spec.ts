import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RedirectCommand, Router } from '@angular/router';
import { IOpalFinesEnforcementAccountTypesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-enforcement-account-types-response.interface';
import { OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-enforcement-account-types.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesAecAccountTypeRow } from '../../interfaces/fines-aec-account-type-row.interface';
import { FinesAecPayloadService } from '../../services/fines-aec-payload.service';
import { finesAecEnforcementAccountTypeResolver } from './fines-aec-enforcement-account-type.resolver';

@Component({ selector: 'app-aec-account-type-resolver-test', template: '' })
class EnforcementAccountTypeResolverTestPage {}

describe('finesAecEnforcementAccountTypeResolver', () => {
  let response: IOpalFinesEnforcementAccountTypesResponse;
  let api: { getEnforcementAccountTypes: ReturnType<typeof vi.fn>; clearCache: ReturnType<typeof vi.fn> };
  let payloadService: FinesAecPayloadService;

  beforeEach(() => {
    response = structuredClone(OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK);
    api = { getEnforcementAccountTypes: vi.fn(() => of(response)), clearCache: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/auto-enforcement',
            children: [
              { path: 'config', component: EnforcementAccountTypeResolverTestPage },
              { path: 'amend-values', component: EnforcementAccountTypeResolverTestPage },
            ],
          },
        ]),
        { provide: OpalFines, useValue: api },
      ],
    });
    payloadService = TestBed.inject(FinesAecPayloadService);
  });

  const resolveSelection = async (query = '?enforcementAccountTypeId=2') => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl(`/fines/auto-enforcement/amend-values${query}`);
    const state = router.routerState.snapshot;
    const route = state.root.firstChild!.firstChild!;
    return TestBed.runInInjectionContext(() =>
      firstValueFrom(
        finesAecEnforcementAccountTypeResolver(route, state) as Observable<IFinesAecAccountTypeRow | RedirectCommand>,
      ),
    );
  };

  const expectAccountTypesRedirect = (result: IFinesAecAccountTypeRow | RedirectCommand): void => {
    expect(result).toBeInstanceOf(RedirectCommand);
    expect(TestBed.inject(Router).serializeUrl((result as RedirectCommand).redirectTo)).toBe(
      '/fines/auto-enforcement/config#account-types',
    );
  };

  it('selects the mapped low-path row through the cached API method and retains both path versions', async () => {
    const transform = vi.spyOn(payloadService, 'transformAccountTypesForView');

    const result = await resolveSelection();

    expect(api.getEnforcementAccountTypes).toHaveBeenCalledExactlyOnceWith();
    expect(api.clearCache).not.toHaveBeenCalled();
    expect(transform).toHaveBeenCalledExactlyOnceWith(response);
    expect(result).toMatchObject({
      id: 2,
      accountType: 'COL',
      minimumBalance: 100,
      highValue: 1000,
      lowValueAccountType: { id: 2, version: 2, path: 'L' },
      highValueAccountType: { id: 1, version: 1, path: 'H' },
    });
  });

  it('accepts zero versions and null threshold values when both record identities exist', async () => {
    response.enforcement_account_types = response.enforcement_account_types.map((record) => ({
      ...record,
      version: 0,
      minimum_balance: null,
    }));

    const result = await resolveSelection();

    expect(result).toMatchObject({
      minimumBalance: null,
      highValue: null,
      lowValueAccountType: { version: 0 },
      highValueAccountType: { version: 0 },
    });
  });

  it.each(['', '?enforcementAccountTypeId='])(
    'returns to Account types without requesting data when the selection is missing or empty %s',
    async (query) => {
      api.getEnforcementAccountTypes.mockReturnValue(throwError(() => new Error('Account types request failed')));

      expectAccountTypesRedirect(await resolveSelection(query));
      expect(api.getEnforcementAccountTypes).not.toHaveBeenCalled();
    },
  );

  it('returns to Account types when no displayed row matches the selection', async () => {
    expectAccountTypesRedirect(await resolveSelection('?enforcementAccountTypeId=invalid'));
    expect(api.getEnforcementAccountTypes).toHaveBeenCalledExactlyOnceWith();
  });

  it('loads a matching API record without imposing a positive integer rule on its ID', async () => {
    response.enforcement_account_types.find((record) => record.id === 2)!.id = 0;

    const result = await resolveSelection('?enforcementAccountTypeId=0');

    expect(result).toMatchObject({ id: 0, lowValueAccountType: { id: 0, version: 2 } });
  });

  it.each(['999', '1'])('rejects unknown or high-path ID %s', async (identifier) => {
    expectAccountTypesRedirect(await resolveSelection(`?enforcementAccountTypeId=${identifier}`));
  });

  it('rejects an API account type outside the four displayed national account types', async () => {
    response.enforcement_account_types.push(
      { id: 31, version: 1, account_type: 'CFP', enforcement_account_type: 'CFPL', path: 'L', minimum_balance: 10 },
      { id: 32, version: 1, account_type: 'CFP', enforcement_account_type: 'CFPH', path: 'H', minimum_balance: 100 },
    );

    expectAccountTypesRedirect(await resolveSelection('?enforcementAccountTypeId=31'));
  });

  it('rejects a missing paired high path instead of opening a form that cannot update it', async () => {
    response.enforcement_account_types = response.enforcement_account_types.filter((record) => record.id !== 1);

    expectAccountTypesRedirect(await resolveSelection());
  });

  it('propagates API failures without treating them as a successful empty selection', async () => {
    const failure = new Error('Account types request failed');
    api.getEnforcementAccountTypes.mockReturnValue(throwError(() => failure));

    await expect(resolveSelection()).rejects.toBe(failure);
    expect(api.clearCache).not.toHaveBeenCalled();
  });
});
