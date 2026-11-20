import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { finesSuspenseBusinessUnitsResolver } from './fines-suspense-business-units.resolver';

describe('finesSuspenseBusinessUnitsResolver', () => {
  const getBusinessUnitsByPermission = vi.fn();
  const [unitA, unitB, unitC] = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
  const resolve = () =>
    firstValueFrom(
      TestBed.runInInjectionContext(() =>
        finesSuspenseBusinessUnitsResolver(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot),
      ) as Observable<IOpalFinesBusinessUnitRefData>,
    );

  beforeEach(() => {
    getBusinessUnitsByPermission.mockReset();
    TestBed.configureTestingModule({ providers: [{ provide: OpalFines, useValue: { getBusinessUnitsByPermission } }] });
  });

  it.each([
    { view: [unitA], manage: [], expected: [unitA] },
    { view: [], manage: [unitB], expected: [unitB] },
    { view: [unitA], manage: [unitB], expected: [unitA, unitB] },
    { view: [unitA], manage: [unitA], expected: [unitA] },
    { view: [unitB, unitA], manage: [unitA, unitC], expected: [unitB, unitA, unitC] },
    { view: [], manage: [], expected: [] },
  ])(
    'combines permitted BUs without duplicates: $view.length view and $manage.length manage',
    async ({ view, manage, expected }) => {
      getBusinessUnitsByPermission
        .mockReturnValueOnce(of({ count: view.length, refData: view }))
        .mockReturnValueOnce(of({ count: manage.length, refData: manage }));
      expect(await resolve()).toEqual({ count: expected.length, refData: expected });
      expect(getBusinessUnitsByPermission.mock.calls).toEqual([['VIEW_SUSPENSE_ITEMS'], ['MANAGE_SUSPENSE_ITEMS']]);
    },
  );

  it.each([0, 1])(
    'propagates a failed permission request (%s) instead of returning a partial list',
    async (failureIndex) => {
      const error = new Error('BU request failed');
      const responses = [of({ count: 1, refData: [unitA] }), of({ count: 1, refData: [unitB] })];
      responses[failureIndex] = throwError(() => error);
      getBusinessUnitsByPermission.mockReturnValueOnce(responses[0]).mockReturnValueOnce(responses[1]);
      await expect(resolve()).rejects.toThrow(error);
    },
  );
});
