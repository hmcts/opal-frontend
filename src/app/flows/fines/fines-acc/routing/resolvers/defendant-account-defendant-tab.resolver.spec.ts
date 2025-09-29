import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { defendantAccountDefendantTabResolver } from './defendant-account-defendant-tab.resolver';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';

describe('defendantAccountDefendantTabResolver', () => {
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockAccountStore: any;
  let mockPayloadService: jasmine.SpyObj<FinesAccPayloadService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getDefendantAccountDefendantTabData']);
    mockAccountStore = {
      getAccountState: jasmine.createSpy('getAccountState'),
    };
    mockPayloadService = jasmine.createSpyObj('FinesAccPayloadService', ['transformDefendantDataToDebtorForm']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  describe('when accountId is missing from route params', () => {
    it('should throw an error', () => {
      const route = {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
      } as any;

      expect(() => {
        TestBed.runInInjectionContext(() => defendantAccountDefendantTabResolver(route, {} as any));
      }).toThrowError('Account ID is required');
    });
  });

  describe('when account state is not properly initialized', () => {
    it('should throw an error', () => {
      const route = {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123'),
        },
      } as any;

      mockAccountStore.getAccountState.and.returnValue({ account_id: null });

      expect(() => {
        TestBed.runInInjectionContext(() => defendantAccountDefendantTabResolver(route, {} as any));
      }).toThrowError('Account state is not properly initialized');
    });
  });

  describe('when resolver runs successfully', () => {
    it('should call service with correct parameters', () => {
      const route = {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123'),
        },
      } as any;

      const mockAccountState = {
        account_id: 123,
        business_unit_id: '456',
        business_unit_user_id: '789',
        party_id: 'PARTY123',
      };

      const mockDefendantData = {} as any;
      const mockTransformedData = {} as any;

      mockAccountStore.getAccountState.and.returnValue(mockAccountState);
      mockOpalFinesService.getDefendantAccountDefendantTabData.and.returnValue(of(mockDefendantData));
      mockPayloadService.transformDefendantDataToDebtorForm.and.returnValue(mockTransformedData);

      const result = TestBed.runInInjectionContext(() => defendantAccountDefendantTabResolver(route, {} as any));

      // Subscribe to the observable to trigger the service calls
      if (result && typeof result === 'object' && 'subscribe' in result) {
        (result as any).subscribe();
      }

      expect(mockOpalFinesService.getDefendantAccountDefendantTabData).toHaveBeenCalledWith(
        123,
        '456',
        '789',
        'PARTY123',
      );
      expect(mockPayloadService.transformDefendantDataToDebtorForm).toHaveBeenCalledWith(mockDefendantData);
    });
  });
});
