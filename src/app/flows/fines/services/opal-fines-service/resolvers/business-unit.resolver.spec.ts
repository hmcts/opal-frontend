import { TestBed } from '@angular/core/testing';
import { RedirectCommand, ResolveFn } from '@angular/router';
import { of, throwError } from 'rxjs';

import { businessUnitResolver } from './business-unit.resolver';
import { OpalFines } from '../opal-fines.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import {
  IOpalFinesBusinessUnit,
  IOpalFinesBusinessUnitRefData,
} from '../interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '../mocks/opal-fines-business-unit-ref-data.mock';

describe('businessUnitResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesBusinessUnit | RedirectCommand | null> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => businessUnitResolver(...resolverParameters));
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockGlobalStateService: jasmine.SpyObj<GlobalStateService>;

  const BUSINESS_UNIT_ID = 61;

  const mockRefData: IOpalFinesBusinessUnitRefData = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;

  beforeEach(() => {
    // Mock Services
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getBusinessUnits']);
    mockGlobalStateService = jasmine.createSpyObj('GlobalStateService', ['error'], {
      error: { set: jasmine.createSpy('set') },
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: GlobalStateService, useValue: mockGlobalStateService },
      ],
    });
  });

  it('should return the business unit when a match is found', async () => {
    mockOpalFinesService.getBusinessUnits.and.returnValue(of(mockRefData));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => BUSINESS_UNIT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    const result = await executeResolver(route, mockRouterStateSnapshot);

    expect(result).toEqual(mockRefData.refData[0]);
    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalledWith('CREATE_MANAGE_DRAFT_ACCOUNTS');
  });

  it('should throw an error and set global state when no matching business unit is found', async () => {
    mockOpalFinesService.getBusinessUnits.and.returnValue(of({ count: 0, refData: [] }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => BUSINESS_UNIT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWith(
      jasmine.stringMatching('Cannot find business unit'),
    );
  });

  it('should throw an error and set global state when service call fails', async () => {
    mockOpalFinesService.getBusinessUnits.and.returnValue(throwError(() => new Error('Service Error')));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => BUSINESS_UNIT_ID.toString() } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWith(
      jasmine.stringMatching('An error occurred whilst trying to get business units'),
    );
  });

  it('should handle invalid or non-numeric businessUnitId gracefully', async () => {
    mockOpalFinesService.getBusinessUnits.and.returnValue(of(mockRefData));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { paramMap: { get: () => 'invalid-id' } };
    const mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    await expectAsync(executeResolver(route, mockRouterStateSnapshot)).toBeRejectedWith(
      jasmine.stringMatching('Cannot find business unit'),
    );
  });
});
