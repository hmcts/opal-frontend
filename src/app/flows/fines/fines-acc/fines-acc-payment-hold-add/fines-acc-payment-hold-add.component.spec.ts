import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccPaymentHoldAddComponent } from './fines-acc-payment-hold-add.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccPaymentHoldAddComponent', () => {
  let component: FinesAccPaymentHoldAddComponent;
  let fixture: ComponentFixture<FinesAccPaymentHoldAddComponent>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let routeMock: { snapshot: { data: { minorCreditorAccountAtAGlance: object } } };
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
      buildMinorCreditorAccountUpdatePayload: vi.fn().mockReturnValue({
        creditor_account_id: '100',
        party_details: {
          party_id: '200',
          organisation_flag: true,
          organisation_details: {
            organisation_name: 'Creditor',
            organisation_aliases: null,
          },
          individual_details: null,
        },
        address: {
          address_line_1: 'line1',
          address_line_2: null,
          address_line_3: null,
          address_line_4: null,
          address_line_5: null,
          postcode: null,
        },
        payment: {
          account_name: null,
          sort_code: null,
          account_number: null,
          account_reference: null,
          pay_by_bacs: true,
          hold_payment: false,
        },
      }),
    };

    opalFinesServiceMock = {
      updateMinorCreditorAccount: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentHoldAddComponent],
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

    fixture = TestBed.createComponent(FinesAccPaymentHoldAddComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate to minor creditor details page with at-a-glance fragment', () => {
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
    fixture.detectChanges();

    component.handleAddPaymentHold();

    expect(finesAccPayloadServiceMock.buildMinorCreditorAccountUpdatePayload).toHaveBeenCalledWith(
      routeMock.snapshot.data.minorCreditorAccountAtAGlance,
    );
    expect(opalFinesServiceMock.updateMinorCreditorAccount).toHaveBeenCalledWith(1, expect.any(Object), 'v1', 'LONDON');

    const updatePayload = opalFinesServiceMock.updateMinorCreditorAccount.mock.calls[0][1];
    expect(updatePayload.payment.hold_payment).toBe(true);
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
    fixture.detectChanges();

    component.handleAddPaymentHold();

    expect(finesAccPayloadServiceMock.buildMinorCreditorAccountUpdatePayload).toHaveBeenCalledWith(
      routeMock.snapshot.data.minorCreditorAccountAtAGlance,
    );
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should complete and clean up subscriptions on destroy', () => {
    const unsubscribeSubject = (component as never as { ngUnsubscribe: { next: () => void; complete: () => void } })
      .ngUnsubscribe;
    const nextSpy = vi.spyOn(unsubscribeSubject, 'next');
    const completeSpy = vi.spyOn(unsubscribeSubject, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledOnce();
    expect(completeSpy).toHaveBeenCalledOnce();
  });
});
