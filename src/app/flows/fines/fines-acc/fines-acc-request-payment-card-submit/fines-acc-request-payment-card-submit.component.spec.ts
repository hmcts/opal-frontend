import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccRequestPaymentCardSubmitComponent } from './fines-acc-request-payment-card-submit.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccRequestPaymentCardSubmitComponent', () => {
  let component: FinesAccRequestPaymentCardSubmitComponent;
  let fixture: ComponentFixture<FinesAccRequestPaymentCardSubmitComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFines: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  let mockActivatedRoute: ActivatedRoute;

  const accountId = 123;
  const baseVersion = '2';
  const businessUnitId = '61';
  const businessUnitUserId = 'USER99';

  beforeEach(async () => {
    mockAccountStore = {
      base_version: vi.fn().mockName('FinesAccountStore.base_version'),
      account_id: vi.fn().mockName('FinesAccountStore.account_id'),
      business_unit_id: vi.fn().mockName('FinesAccountStore.business_unit_id'),
      business_unit_user_id: vi.fn().mockName('FinesAccountStore.business_unit_user_id'),
      getAccountState: vi.fn().mockName('FinesAccountStore.getAccountState'),
      setSuccessMessage: vi.fn().mockName('FinesAccountStore.setSuccessMessage'),
      account_number: vi.fn().mockName('FinesAccountStore.account_number'),
      party_name: vi.fn().mockName('FinesAccountStore.party_name'),
    };
    mockAccountStore.base_version.mockReturnValue(baseVersion);
    mockAccountStore.account_id.mockReturnValue(accountId);
    mockAccountStore.business_unit_id.mockReturnValue(businessUnitId);
    mockAccountStore.business_unit_user_id.mockReturnValue(businessUnitUserId);
    mockAccountStore.getAccountState.mockReturnValue({
      account_number: 'TEST-123',
      account_id: accountId,
      pg_party_id: null,
      party_id: null,
      party_type: null,
      party_name: 'Test Party',
      base_version: baseVersion,
      business_unit_id: businessUnitId,
      business_unit_user_id: businessUnitUserId,
      welsh_speaking: null,
    });
    mockAccountStore.account_number.mockReturnValue('TEST-123');
    mockAccountStore.party_name.mockReturnValue('Test Party');

    mockOpalFines = {
      addDefendantAccountPaymentCardRequest: vi.fn().mockName('OpalFines.addDefendantAccountPaymentCardRequest'),
    };
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };
    mockActivatedRoute = {} as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [FinesAccRequestPaymentCardSubmitComponent],
      providers: [
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: OpalFines, useValue: mockOpalFines },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccRequestPaymentCardSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit a payment card request and navigate on success', () => {
    mockOpalFines.addDefendantAccountPaymentCardRequest.mockReturnValue(of({ defendant_account_id: accountId }));

    component.handleRequestPaymentCard();

    expect(mockOpalFines.addDefendantAccountPaymentCardRequest).toHaveBeenCalled();
    expect(mockAccountStore.setSuccessMessage).toHaveBeenCalledWith('Payment card request submitted successfully');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'payment-terms',
    });
  });
});
