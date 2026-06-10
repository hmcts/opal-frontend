import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RedirectCommand, Router, convertToParamMap } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../constants/fines-acc-defendant-routing-paths.constant';
import { enforcementActionResultResolver } from './enforcement-action-result.resolver';

describe('enforcementActionResultResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getResult: vi.fn().mockName('OpalFines.getResult'),
    };
    mockRouter = {
      createUrlTree: vi.fn().mockName('Router.createUrlTree'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should fetch the selected result using the resultId query parameter', async () => {
    const route = {
      queryParamMap: convertToParamMap({ resultId: 'REM' }),
    } as ActivatedRouteSnapshot;
    mockOpalFinesService.getResult.mockReturnValue(of(OPAL_FINES_RESULT_REF_DATA_MOCK));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(enforcementActionResultResolver(route, {} as never) as never),
    );

    expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('REM', true);
    expect(result).toEqual(OPAL_FINES_RESULT_REF_DATA_MOCK);
  });

  it('should redirect to the enforcement tab when resultId is missing', () => {
    const route = {
      queryParamMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;
    const mockUrlTree = {} as never;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);

    const result = TestBed.runInInjectionContext(() => enforcementActionResultResolver(route, {} as never));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockOpalFinesService.getResult).not.toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      fragment: 'enforcement',
    });
  });

  it('should redirect to the enforcement tab when the result lookup fails', async () => {
    const route = {
      queryParamMap: convertToParamMap({ resultId: 'REM' }),
    } as ActivatedRouteSnapshot;
    const mockUrlTree = {} as never;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);
    (mockOpalFinesService.getResult as Mock).mockReturnValue(throwError(() => new Error('API error')));

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(enforcementActionResultResolver(route, {} as never) as never),
    );

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      fragment: 'enforcement',
    });
  });
});
