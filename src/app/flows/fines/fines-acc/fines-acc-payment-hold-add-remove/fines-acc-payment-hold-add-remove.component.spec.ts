import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccPaymentHoldAddRemoveComponent } from './fines-acc-payment-hold-add-remove.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_MINOR_CREDITOR_UPDATE_PAYLOAD_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-minor-creditor-update-payload.mock';
import { FINES_ACC_BANNER_MESSAGES } from '../stores/constants/fines-acc-store-banner-messages.constant';
import { FinesAccPaymentHoldAddRemoveAction } from './types/fines-acc-payment-hold-add-remove-actions.type';

describe('FinesAccPaymentHoldAddRemoveComponent', () => {
  let component: FinesAccPaymentHoldAddRemoveComponent;
  let fixture: ComponentFixture<FinesAccPaymentHoldAddRemoveComponent>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let routeMock: {
    snapshot: {
      data: {
        minorCreditorAccountAtAGlance: object;
        paymentHoldAction?: FinesAccPaymentHoldAddRemoveAction;
      };
    };
  };
  let finesAccStoreMock: {
    getAccountNumber: ReturnType<typeof vi.fn>;
    party_name: ReturnType<typeof vi.fn>;
    account_id: ReturnType<typeof vi.fn>;
    base_version: ReturnType<typeof vi.fn>;
    business_unit_id: ReturnType<typeof vi.fn>;
    setSuccessMessage: ReturnType<typeof vi.fn>;
  };
  let finesAccPayloadServiceMock: {
    buildMinorCreditorAccountUpdatePayload: ReturnType<typeof vi.fn>;
  };
  let opalFinesServiceMock: {
    updateMinorCreditorAccount: ReturnType<typeof vi.fn>;
  };

  const createComponent = (paymentHoldAction: FinesAccPaymentHoldAddRemoveAction = 'add'): void => {
    routeMock.snapshot.data.paymentHoldAction = paymentHoldAction;
    fixture = TestBed.createComponent(FinesAccPaymentHoldAddRemoveComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    routeMock = {
      snapshot: {
        data: {
          minorCreditorAccountAtAGlance: {
            creditor_account_id: '100',
          },
        },
      },
    };

    routerMock = {
      navigate: vi.fn(),
    };

    finesAccStoreMock = {
      getAccountNumber: vi.fn().mockReturnValue('123456'),
      party_name: vi.fn().mockReturnValue('Test Creditor'),
      account_id: vi.fn().mockReturnValue(1),
      base_version: vi.fn().mockReturnValue('v1'),
      business_unit_id: vi.fn().mockReturnValue('LONDON'),
      setSuccessMessage: vi.fn(),
    };

    finesAccPayloadServiceMock = {
      buildMinorCreditorAccountUpdatePayload: vi
        .fn()
        .mockImplementation(() => structuredClone(OPAL_FINES_MINOR_CREDITOR_UPDATE_PAYLOAD_MOCK)),
    };

    opalFinesServiceMock = {
      updateMinorCreditorAccount: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentHoldAddRemoveComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: FinesAccountStore,
          useValue: finesAccStoreMock,
        },
        {
          provide: FinesAccPayloadService,
          useValue: finesAccPayloadServiceMock,
        },
        {
          provide: OpalFines,
          useValue: opalFinesServiceMock,
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialise accountNumber and partyName from store values when present', () => {
    createComponent();

    expect(component.accountNumber).toBe('123456');
    expect(component.partyName).toBe('Test Creditor');
  });

  it('should default accountNumber and partyName to empty strings when store values are null', () => {
    finesAccStoreMock.getAccountNumber.mockReturnValue(null);
    finesAccStoreMock.party_name.mockReturnValue(null);

    createComponent();

    expect(component.accountNumber).toBe('');
    expect(component.partyName).toBe('');
  });

  it('should render add payment hold content for the add route', () => {
    createComponent('add');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Do you want to add a payment hold?');
    expect(element.querySelector('#addPaymentHold')?.textContent?.trim()).toBe('Yes - add hold');
  });

  it('should render remove payment hold content for the remove route', () => {
    createComponent('remove');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Do you want to remove the payment hold?');
    expect(element.querySelector('#removePaymentHold')?.textContent?.trim()).toBe('Yes - remove hold');
  });

  it('should navigate to minor creditor details page with at-a-glance fragment', () => {
    createComponent();

    component.navigateToMinorCreditorDetailsPage();

    expect(routerMock.navigate).toHaveBeenCalledWith(
      [`../../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details}`],
      {
        relativeTo: routeMock,
        fragment: 'at-a-glance',
      },
    );
  });

  it('should add payment hold and navigate on successful update', () => {
    createComponent('add');
    fixture.detectChanges();

    component.handlePaymentHold();

    expect(finesAccPayloadServiceMock.buildMinorCreditorAccountUpdatePayload).toHaveBeenCalledWith(
      routeMock.snapshot.data.minorCreditorAccountAtAGlance,
    );
    expect(opalFinesServiceMock.updateMinorCreditorAccount).toHaveBeenCalledWith(1, expect.any(Object), 'v1', 'LONDON');

    const updatePayload = opalFinesServiceMock.updateMinorCreditorAccount.mock.calls[0][1];
    expect(updatePayload.payment.hold_payment).toBe(true);
    expect(finesAccStoreMock.setSuccessMessage).not.toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(
      [`../../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details}`],
      {
        relativeTo: routeMock,
        fragment: 'at-a-glance',
      },
    );
  });

  it('should remove payment hold, set a success message, and navigate on successful update', () => {
    createComponent('remove');
    fixture.detectChanges();

    component.handlePaymentHold();

    expect(finesAccPayloadServiceMock.buildMinorCreditorAccountUpdatePayload).toHaveBeenCalledWith(
      routeMock.snapshot.data.minorCreditorAccountAtAGlance,
    );
    expect(opalFinesServiceMock.updateMinorCreditorAccount).toHaveBeenCalledWith(1, expect.any(Object), 'v1', 'LONDON');

    const updatePayload = opalFinesServiceMock.updateMinorCreditorAccount.mock.calls[0][1];
    expect(updatePayload.payment.hold_payment).toBe(false);
    expect(finesAccStoreMock.setSuccessMessage).toHaveBeenCalledWith(FINES_ACC_BANNER_MESSAGES.paymentHoldRemoved);
    expect(routerMock.navigate).toHaveBeenCalledWith(
      [`../../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details}`],
      {
        relativeTo: routeMock,
        fragment: 'at-a-glance',
      },
    );
  });

  it('should not set success message or navigate when update request fails', () => {
    opalFinesServiceMock.updateMinorCreditorAccount.mockReturnValue(throwError(() => new Error('request failed')));
    createComponent('remove');
    fixture.detectChanges();

    component.handlePaymentHold();

    expect(finesAccPayloadServiceMock.buildMinorCreditorAccountUpdatePayload).toHaveBeenCalledWith(
      routeMock.snapshot.data.minorCreditorAccountAtAGlance,
    );
    expect(finesAccStoreMock.setSuccessMessage).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should complete and clean up subscriptions on destroy', () => {
    createComponent();
    const unsubscribeSubject = (component as never as { ngUnsubscribe: { next: () => void; complete: () => void } })
      .ngUnsubscribe;
    const nextSpy = vi.spyOn(unsubscribeSubject, 'next');
    const completeSpy = vi.spyOn(unsubscribeSubject, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledOnce();
    expect(completeSpy).toHaveBeenCalledOnce();
  });
});
