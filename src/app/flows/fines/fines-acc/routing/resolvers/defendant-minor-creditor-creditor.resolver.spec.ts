import { TestBed } from '@angular/core/testing';
import { convertToParamMap, RedirectCommand, Router } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesAccountMinorCreditorCreditor } from '../../../services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from '../../../services/opal-fines-service/mocks/opal-fines-account-minor-creditor-creditor.mock';
import { minorCreditorAccountCreditorResolver } from './defendant-minor-creditor-creditor.resolver';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../constants/fines-acc-minor-creditor-routing-paths.constant';

describe('minorCreditorAccountCreditorResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getMinorCreditorAccount: vi.fn().mockName('OpalFines.getMinorCreditorAccount'),
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

  it('should resolve creditor data when accountId exists', async () => {
    const accountId = '77';
    mockOpalFinesService.getMinorCreditorAccount.mockReturnValue(of(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({ accountId }) } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        minorCreditorAccountCreditorResolver(route, state) as Observable<IOpalFinesAccountMinorCreditorCreditor>,
      ),
    );

    expect(mockOpalFinesService.getMinorCreditorAccount).toHaveBeenCalledWith(77);
    expect(result).toEqual(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK);
  });

  it('should redirect to minor creditor details when accountId route param is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({}) } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);

    const result = TestBed.runInInjectionContext(() => minorCreditorAccountCreditorResolver(route, state));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details]);
    expect(mockOpalFinesService.getMinorCreditorAccount).not.toHaveBeenCalled();
  });

  it('should redirect to minor creditor details when service errors', async () => {
    mockOpalFinesService.getMinorCreditorAccount.mockReturnValue(
      throwError(() => new Error('Failed to fetch creditor')),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route = { paramMap: convertToParamMap({ accountId: '99' }) } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = {} as any;

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(
        minorCreditorAccountCreditorResolver(route, state) as Observable<
          IOpalFinesAccountMinorCreditorCreditor | RedirectCommand
        >,
      ),
    );

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details]);
    expect(mockOpalFinesService.getMinorCreditorAccount).toHaveBeenCalledWith(99);
  });
});
