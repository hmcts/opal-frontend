import { InjectionToken, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Observable, of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { buildFetchCourtsResolver } from './fetch-courts.resolver';

const BUSINESS_UNIT_ID = new InjectionToken<number>('BUSINESS_UNIT_ID');

describe('buildFetchCourtsResolver', () => {
  const executeResolver = (
    resolver: ResolveFn<IOpalFinesCourtRefData>,
    ...resolverParameters: [ActivatedRouteSnapshot, RouterStateSnapshot]
  ) => TestBed.runInInjectionContext(() => resolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: OpalFines,
          useValue: {
            getCourts: vi.fn().mockReturnValue(of(OPAL_FINES_COURT_REF_DATA_MOCK)),
          },
        },
        {
          provide: BUSINESS_UNIT_ID,
          useValue: 123,
        },
      ],
    });
  });

  it('should fetch courts using the business unit id returned by the getter', () => {
    const opalFinesService = TestBed.inject(OpalFines);
    const getBusinessUnitId = vi.fn(() => 123);
    const resolver = buildFetchCourtsResolver(getBusinessUnitId);

    const result = executeResolver(
      resolver,
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    ) as Observable<IOpalFinesCourtRefData>;

    result.subscribe((value) => expect(value).toEqual(OPAL_FINES_COURT_REF_DATA_MOCK));
    expect(getBusinessUnitId).toHaveBeenCalled();
    expect(opalFinesService.getCourts).toHaveBeenCalledWith(123);
  });

  it('should allow the business unit getter to use Angular injection context', () => {
    const opalFinesService = TestBed.inject(OpalFines);
    const resolver = buildFetchCourtsResolver(() => inject(BUSINESS_UNIT_ID));

    const result = executeResolver(
      resolver,
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    ) as Observable<IOpalFinesCourtRefData>;

    result.subscribe((value) => expect(value).toEqual(OPAL_FINES_COURT_REF_DATA_MOCK));
    expect(opalFinesService.getCourts).toHaveBeenCalledWith(123);
  });
});
