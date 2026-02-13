import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccRequestPaymentCardAccessDeniedComponent } from './fines-acc-request-payment-card-access-denied.component';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACCOUNT_STATE } from '../constants/fines-acc-state.constant';
import { ActivatedRoute } from '@angular/router';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockAccountStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockActivatedRoute: any;

describe('FinesAccRequestPaymentCardAccessDeniedComponent', () => {
  let component: FinesAccRequestPaymentCardAccessDeniedComponent;
  let fixture: ComponentFixture<FinesAccRequestPaymentCardAccessDeniedComponent>;
  beforeEach(async () => {
    mockAccountStore = {
      getAccountState: vi.fn().mockName('FinesAccountStore.getAccountState'),
    };
    mockAccountStore.getAccountState.mockReturnValue(FINES_ACCOUNT_STATE);

    mockActivatedRoute = {
      snapshot: vi.fn().mockName('ActivatedRoute.snapshot'),
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockActivatedRoute.snapshot = {
      paramMap: new Map([['type', 'permission']]) as any,
      data: {
        defendantAccountHeadingData: structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
        defendantAccountPaymentTermsData: structuredClone(
          OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK,
        ),
      },
    } as unknown as ActivatedRoute['snapshot'];

    await TestBed.configureTestingModule({
      imports: [FinesAccRequestPaymentCardAccessDeniedComponent],
      providers: [
        { provide: FinesAccountStore, useValue: mockAccountStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccRequestPaymentCardAccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to account summary on navigateBackToAccountSummary', () => {
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    const event = new Event('click');
    component.navigateBackToAccountSummary(event);
    expect(routerSpy).toHaveBeenCalledWith([`../../../details`], { relativeTo: component['route'] });
  });
});
