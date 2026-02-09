import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsPaymentTermsTabComponent } from './fines-acc-defendant-details-payment-terms-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-latest.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesAccPaymentTermsAmendComponent', () => {
  let component: FinesAccDefendantDetailsPaymentTermsTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsPaymentTermsTabComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsPaymentTermsTabComponent],
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
    expect(component.cardTitle()).toBe('Pay by date');
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

  it('should handle change payment terms by emitting an event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.changePaymentTerms, 'emit');
    component.handleChangePaymentTerms();
    expect(component.changePaymentTerms.emit).toHaveBeenCalled();
  });

  it('should handle request payment card by emitting an event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.requestPaymentCard, 'emit');
    component.handleRequestPaymentCard();
    expect(component.requestPaymentCard.emit).toHaveBeenCalled();
  });
});
