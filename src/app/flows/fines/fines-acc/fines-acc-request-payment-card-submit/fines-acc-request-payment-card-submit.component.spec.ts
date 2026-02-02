import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesAccRequestPaymentCardSubmitComponent } from './fines-acc-request-payment-card-submit.component';

describe('FinesAccRequestPaymentCardSubmitComponent', () => {
  let component: FinesAccRequestPaymentCardSubmitComponent;
  let fixture: ComponentFixture<FinesAccRequestPaymentCardSubmitComponent>;
  let mockAccountStore: jasmine.SpyObj<InstanceType<typeof FinesAccountStore>>;
  let mockOpalFines: jasmine.SpyObj<OpalFines>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: ActivatedRoute;

  const accountId = 123;
  const baseVersion = '2';
  const businessUnitId = '61';
  const businessUnitUserId = 'USER99';

  beforeEach(async () => {
    mockAccountStore = jasmine.createSpyObj<InstanceType<typeof FinesAccountStore>>('FinesAccountStore', [
      'base_version',
      'account_id',
      'business_unit_id',
      'business_unit_user_id',
      'getAccountState',
      'setSuccessMessage',
      'account_number',
      'party_name',
    ]);
    mockAccountStore.base_version.and.returnValue(baseVersion);
    mockAccountStore.account_id.and.returnValue(accountId);
    mockAccountStore.business_unit_id.and.returnValue(businessUnitId);
    mockAccountStore.business_unit_user_id.and.returnValue(businessUnitUserId);
    mockAccountStore.getAccountState.and.returnValue({
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
    mockAccountStore.account_number.and.returnValue('TEST-123');
    mockAccountStore.party_name.and.returnValue('Test Party');

    mockOpalFines = jasmine.createSpyObj<OpalFines>('OpalFines', ['addDefendantAccountPaymentCardRequest']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
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
    mockOpalFines.addDefendantAccountPaymentCardRequest.and.returnValue(of({ defendant_account_id: accountId }));

    component.handleRequestPaymentCard();

    expect(mockOpalFines.addDefendantAccountPaymentCardRequest).toHaveBeenCalled();
    expect(mockAccountStore.setSuccessMessage).toHaveBeenCalledWith('Payment card request submitted successfully');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'payment-terms',
    });
  });
});
