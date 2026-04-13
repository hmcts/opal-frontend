import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Observable, of } from 'rxjs';
import { fetchAccCourtsResolver } from './fetch-acc-courts.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../../stores/fines-acc.store';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';

describe('fetchAccCourtsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesCourtRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchAccCourtsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: OpalFines,
          useValue: {
            getCourts: vi.fn().mockReturnValue(of({ count: 1, refData: [] })),
          },
        },
        {
          provide: FinesAccountStore,
          useValue: {
            business_unit_id: vi.fn().mockReturnValue('123'),
          },
        },
      ],
    });
  });

  it('should fetch courts for the current account business unit', () => {
    const opalFinesService = TestBed.inject(OpalFines);
    const result = executeResolver(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    ) as Observable<IOpalFinesCourtRefData>;

    result.subscribe((value: IOpalFinesCourtRefData) => expect(value).toEqual({ count: 1, refData: [] }));
    expect(opalFinesService.getCourts).toHaveBeenCalledWith(123);
  });
});
