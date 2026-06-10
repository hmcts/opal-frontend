import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsPaymentTermsTabComponent } from './fines-acc-defendant-details-payment-terms-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccPaymentTermsAmendComponent', () => {
  let component: FinesAccDefendantDetailsPaymentTermsTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsPaymentTermsTabComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsPaymentTermsTabComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsPaymentTermsTabComponent);
    component = fixture.componentInstance;
    component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct card title for Pay in full', () => {
    component.tabData.payment_terms.lump_sum_amount = 50.0;
    component.tabData.payment_terms.instalment_amount = 0.0;
    fixture.detectChanges();
    expect(component.cardTitle()).toBe('Pay in full');
  });

  it('should return the correct card title for Lump sum and instalments', () => {
    component.tabData.payment_terms.lump_sum_amount = 50.0;
    component.tabData.payment_terms.instalment_amount = 50.0;
    fixture.detectChanges();
    expect(component.cardTitle()).toBe('Lump sum plus instalments');
  });

  it('should return the correct card title for Installments only', () => {
    component.tabData.payment_terms.instalment_amount = 50.0;
    component.tabData.payment_terms.lump_sum_amount = 0.0;
    fixture.detectChanges();
    expect(component.cardTitle()).toBe('Instalments only');
  });

  it('should return the correct card title for Pay by date even if there are no values in installment_amount or lump_sum_amount', () => {
    component.tabData.payment_terms.instalment_amount = 0.0;
    component.tabData.payment_terms.lump_sum_amount = 0.0;
    component.tabData.payment_terms.payment_terms_type.payment_terms_type_code = 'B';
    fixture.detectChanges();
    expect(component.cardTitle()).toBe('Pay in full');
  });

  it('should return the correct card title for Paid when there are no values in installment_amount or lump_sum_amount and the code is P', () => {
    component.tabData.payment_terms.instalment_amount = 0.0;
    component.tabData.payment_terms.lump_sum_amount = 0.0;
    component.tabData.payment_terms.payment_terms_type.payment_terms_type_code = 'P';
    fixture.detectChanges();
    expect(component.cardTitle()).toBe('Paid');
  });

  it('should return the correct card title for Paid when there are no values in installment_amount or lump_sum_amount and the code is not P of B', () => {
    component.tabData.payment_terms.instalment_amount = 0.0;
    component.tabData.payment_terms.lump_sum_amount = 0.0;
    component.tabData.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
    fixture.detectChanges();
    expect(component.cardTitle()).toBe('Paid');
  });

  it('should return the amend payment terms route when the action is allowed', () => {
    component.canAmendPaymentTerms = true;

    expect(component.changePaymentTermsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/amend`,
    );
  });

  it('should return the amend denied route when the action is not allowed', () => {
    component.canAmendPaymentTerms = false;
    component.amendPaymentTermsDeniedType = 'balance';

    expect(component.changePaymentTermsLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/denied/balance`,
    );
  });

  it('should return the request payment card route when the action is allowed', () => {
    component.canRequestPaymentCard = true;

    expect(component.requestPaymentCardLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/request`,
    );
  });

  it('should return the request payment card denied route when the action is not allowed', () => {
    component.canRequestPaymentCard = false;
    component.requestPaymentCardDeniedType = 'enforcement';

    expect(component.requestPaymentCardLink()).toBe(
      `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/denied/enforcement`,
    );
  });

  it('should navigate to the resolved request payment card route', () => {
    const router = TestBed.inject(Router);
    const routerNavigateSpy = vi.spyOn(router, 'navigate');
    component.canRequestPaymentCard = true;

    component.handleRequestPaymentCard();

    expect(routerNavigateSpy).toHaveBeenCalledWith(
      [`../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/request`],
      {
        relativeTo: component['activatedRoute'],
      },
    );
  });
});
