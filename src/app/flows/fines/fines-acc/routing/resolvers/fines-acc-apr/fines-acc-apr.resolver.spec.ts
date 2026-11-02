import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RedirectCommand, Router } from '@angular/router';
import { firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import {
  IOpalFinesApr,
  IOpalFinesAprsResponse,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { MOCK_FINES_ACCOUNT_STATE } from '../../../mocks/fines-acc-state.mock';
import { FinesAccPayloadService } from '../../../services/fines-acc-payload.service';
import { FinesAccountStore } from '../../../stores/fines-acc.store';
import { finesAccAprResolver } from './fines-acc-apr.resolver';

@Component({ template: '' })
class ResolverTestRouteComponent {}

describe('finesAccAprResolver', () => {
  const accountId = 141;
  const reference: IOpalFinesApr = {
    alternate_payment_reference_id: 11,
    defendant_account_id: accountId,
    business_unit_id: 77,
    relationship: 'APR',
    category: 'APR',
    apr_text: 'TEST-REFERENCE',
    created_at: '2026-06-01T12:00:00Z',
    updated_at: null,
  };
  const data: IOpalFinesAprsResponse = { references: [], version: '"7"' };
  let api: {
    getDefendantAccountHeadingData: ReturnType<typeof vi.fn>;
    getAprs: ReturnType<typeof vi.fn>;
  };
  let accountStore: { setAccountState: ReturnType<typeof vi.fn> };
  let payloadService: { transformDefendantAccountHeaderForStore: ReturnType<typeof vi.fn> };

  const navigateToPage = (path = 'manage', selectedId?: string) =>
    TestBed.inject(Router).navigateByUrl(
      `/fines/account/defendant/${accountId}/alternate/payment/reference/${path}${
        selectedId === undefined ? '' : `?alternatePaymentReferenceId=${selectedId}`
      }`,
    );

  const resolve = () => {
    const state = TestBed.inject(Router).routerState.snapshot;
    const route = state.root.firstChild!.firstChild!;
    return TestBed.runInInjectionContext(() =>
      firstValueFrom(finesAccAprResolver(route, state) as Observable<IOpalFinesAprsResponse | RedirectCommand>),
    );
  };

  beforeEach(async () => {
    api = {
      getDefendantAccountHeadingData: vi.fn().mockReturnValue(of(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK)),
      getAprs: vi.fn().mockReturnValue(of(data)),
    };
    accountStore = { setAccountState: vi.fn() };
    payloadService = {
      transformDefendantAccountHeaderForStore: vi.fn().mockReturnValue(MOCK_FINES_ACCOUNT_STATE),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/account/defendant/:accountId/alternate/payment/reference',
            children: ['manage', 'delete', ':mode'].map((path) => ({
              path,
              component: ResolverTestRouteComponent,
            })),
          },
        ]),
        { provide: OpalFines, useValue: api },
        { provide: FinesAccountStore, useValue: accountStore },
        { provide: FinesAccPayloadService, useValue: payloadService },
      ],
    });
    await navigateToPage();
  });

  it('loads fresh account context and APRs for the route account, preserving the quoted APR response account version', async () => {
    const result = await resolve();

    expect(api.getDefendantAccountHeadingData).toHaveBeenCalledWith(accountId);
    expect(api.getAprs).toHaveBeenCalledWith(accountId);
    expect(payloadService.transformDefendantAccountHeaderForStore).toHaveBeenCalledWith(
      accountId,
      FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK,
    );
    expect(accountStore.setAccountState).toHaveBeenCalledWith({ ...MOCK_FINES_ACCOUNT_STATE, base_version: '"7"' });
    expect(result).toBe(data);
  });

  it.each([null, '', '   '])(
    'redirects to the technical error page without changing account state for version %s',
    async (version) => {
      api.getAprs.mockReturnValue(of({ ...data, version }));

      const result = await resolve();

      expect(result).toBeInstanceOf(RedirectCommand);
      expect(TestBed.inject(Router).serializeUrl((result as RedirectCommand).redirectTo)).toBe(
        '/error/internal-server',
      );
      expect(accountStore.setAccountState).not.toHaveBeenCalled();
      expect(payloadService.transformDefendantAccountHeaderForStore).not.toHaveBeenCalled();
    },
  );

  it.each(['getDefendantAccountHeadingData', 'getAprs'] as const)(
    'propagates a failed %s request without publishing partial account context',
    async (method) => {
      const error = new Error('Test API failure');
      api[method].mockReturnValue(throwError(() => error));

      await expect(resolve()).rejects.toBe(error);
      expect(accountStore.setAccountState).not.toHaveBeenCalled();
    },
  );

  it('waits for both responses before replacing the account context', async () => {
    const heading = new Subject<typeof FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK>();
    const references = new Subject<IOpalFinesAprsResponse>();
    api.getDefendantAccountHeadingData.mockReturnValue(heading);
    api.getAprs.mockReturnValue(references);
    const result = resolve();

    references.next(data);
    references.complete();
    expect(accountStore.setAccountState).not.toHaveBeenCalled();
    heading.next(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK);
    heading.complete();

    await expect(result).resolves.toBe(data);
    expect(accountStore.setAccountState).toHaveBeenCalledOnce();
  });

  it('redirects an add entry to the same account Manage page when a direct APR already exists', async () => {
    api.getAprs.mockReturnValue(of({ ...data, references: [reference] }));
    await navigateToPage('add');

    const result = await resolve();

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(TestBed.inject(Router).serializeUrl((result as RedirectCommand).redirectTo)).toBe(
      '/fines/account/defendant/141/alternate/payment/reference/manage',
    );
  });

  it('permits add when only inherited references exist', async () => {
    const response = { ...data, references: [{ ...reference, relationship: 'CONSOLIDATED' as const }] };
    api.getAprs.mockReturnValue(of(response));
    await navigateToPage('add');

    await expect(resolve()).resolves.toBe(response);
  });

  it.each(['change', 'delete'])(
    'returns an invalid or missing %s selection to the same account Manage page',
    async (path) => {
      api.getAprs.mockReturnValue(of({ ...data, references: [reference] }));
      for (const selectedId of [undefined, '999', 'invalid', '-1']) {
        await navigateToPage(path, selectedId);

        const result = await resolve();

        expect(result).toBeInstanceOf(RedirectCommand);
        expect(TestBed.inject(Router).serializeUrl((result as RedirectCommand).redirectTo)).toBe(
          '/fines/account/defendant/141/alternate/payment/reference/manage',
        );
      }
    },
  );

  it.each([
    ['change', 'APR', 'APR', true],
    ['change', 'CONSOLIDATED', 'APR', false],
    ['change', 'APR', 'ACC', false],
    ['delete', 'APR', 'APR', true],
    ['delete', 'CONSOLIDATED', 'APR', true],
    ['delete', 'AMALGAMATED', 'APR', true],
    ['delete', 'CONSOLIDATED', 'ACC', false],
  ] as const)(
    'allows %s for relationship %s/category %s only when eligible',
    async (path, relationship, category, eligible) => {
      const response = { ...data, references: [{ ...reference, relationship, category }] };
      api.getAprs.mockReturnValue(of(response));
      await navigateToPage(path, '11');

      const result = await resolve();

      if (eligible) {
        expect(result).toBe(response);
      } else {
        expect(result).toBeInstanceOf(RedirectCommand);
      }
    },
  );
});
