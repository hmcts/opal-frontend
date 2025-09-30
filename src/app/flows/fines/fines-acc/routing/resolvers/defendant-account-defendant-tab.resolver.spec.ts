import { TestBed } from '@angular/core/testing';
import { RedirectCommand, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { defendantAccountDefendantTabResolver } from './defendant-account-defendant-tab.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../constants/fines-acc-defendant-routing-paths.constant';

describe('defendantAccountDefendantTabResolver', () => {
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDefendantAccountDefendantTabData']);
    mockAccountStore = {
      getAccountState: jasmine.createSpy('getAccountState'),
    };
    mockPayloadService = jasmine.createSpyObj('FinesAccPayloadService', ['transformDefendantDataToDebtorForm']);
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should return a RedirectCommand when accountId is missing', () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue(null),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountDefendantTabResolver(route, {} as any));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
  });

  it('should return a RedirectCommand when account state is invalid', () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);
    mockAccountStore.getAccountState.and.returnValue({ account_id: null });

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountDefendantTabResolver(route, {} as any));

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
  });

  it('should return observable with transformed form data on successful API call', async () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockAccountState = {
      account_id: 123,
      business_unit_id: '456',
      business_unit_user_id: '789',
      party_id: 'PARTY123',
    };
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockDefendantData = {} as any;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockTransformedData = {} as any;

    mockAccountStore.getAccountState.and.returnValue(mockAccountState);
    mockOpalFinesService.getDefendantAccountDefendantTabData.and.returnValue(of(mockDefendantData));
    mockPayloadService.transformDefendantDataToDebtorForm.and.returnValue(mockTransformedData);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountDefendantTabResolver(route, {} as any));

    // The result should be an observable
    expect(result && typeof result === 'object' && 'subscribe' in result).toBeTruthy();

    // Subscribe to get the emitted value
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emittedValue = await lastValueFrom(result as any);

    expect(mockOpalFinesService.getDefendantAccountDefendantTabData).toHaveBeenCalledWith(
      123,
      '456',
      '789',
      'PARTY123',
    );
    expect(mockPayloadService.transformDefendantDataToDebtorForm).toHaveBeenCalledWith(mockDefendantData);
    expect(emittedValue).toEqual({
      formData: mockTransformedData,
      nestedFlow: false,
    });
  });

  it('should return a RedirectCommand on API error', async () => {
    const route = {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('123'),
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const mockAccountState = {
      account_id: 123,
      business_unit_id: '456',
      business_unit_user_id: '789',
      party_id: 'PARTY123',
    };

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockUrlTree = {} as any;
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);
    mockAccountStore.getAccountState.and.returnValue(mockAccountState);
    mockOpalFinesService.getDefendantAccountDefendantTabData.and.returnValue(throwError(() => new Error('API Error')));

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = TestBed.runInInjectionContext(() => defendantAccountDefendantTabResolver(route, {} as any));

    // The result should be an observable that emits a RedirectCommand
    if (result && typeof result === 'object' && 'subscribe' in result) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emittedValue = await lastValueFrom(result as any);
      expect(emittedValue).toBeInstanceOf(RedirectCommand);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details]);
    } else {
      fail('Expected observable result');
    }
  });
});
