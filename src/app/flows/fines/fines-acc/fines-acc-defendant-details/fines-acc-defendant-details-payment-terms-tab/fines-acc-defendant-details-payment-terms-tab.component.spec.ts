import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccDefendantDetailsPaymentTermsTabComponent } from './fines-acc-defendant-details-payment-terms-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-payment-terms-tab-ref-data.mock';

describe('FinesAccPaymentTermsAmendComponent', () => {
    let component: FinesAccDefendantDetailsPaymentTermsTabComponent;
    let fixture: ComponentFixture<FinesAccDefendantDetailsPaymentTermsTabComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [FinesAccDefendantDetailsPaymentTermsTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FinesAccDefendantDetailsPaymentTermsTabComponent);
        component = fixture.componentInstance;
        component.tabData = structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_TAB_REF_DATA_MOCK)
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return the correct card title for Pay in full', () => {
        component.tabData.payment_terms.payment_terms_type.payment_terms_type_code = 'B';
        fixture.detectChanges();
        expect(component.cardTitle()).toBe('Pay in full');
    });

    it('should return the correct card title for Lump sum and instalments', () => {
        component.tabData.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
        component.tabData.payment_terms.lump_sum_amount = 50.00;
        fixture.detectChanges();
        expect(component.cardTitle()).toBe('Lump sum plus instalments');
    });

    it('should return the correct card title for Installments only', () => {
        component.tabData.payment_terms.payment_terms_type.payment_terms_type_code = 'I';
        component.tabData.payment_terms.lump_sum_amount = 0.00;
        fixture.detectChanges();
        expect(component.cardTitle()).toBe('Instalments only');
    });

    it('should handle change payment terms by emitting an event', () => {
        spyOn(component.changePaymentTerms, 'emit');
        component.handleChangePaymentTerms('id');
        expect(component.changePaymentTerms.emit).toHaveBeenCalled();
    });

    it('should handle request payment card by emitting an event', () => {
        spyOn(component.requestPaymentCard, 'emit');
        component.handleRequestPaymentCard();
        expect(component.requestPaymentCard.emit).toHaveBeenCalled();
    });
});