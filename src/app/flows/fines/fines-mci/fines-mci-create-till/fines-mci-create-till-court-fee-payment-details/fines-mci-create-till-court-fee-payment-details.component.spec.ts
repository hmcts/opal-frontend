import { TestBed } from '@angular/core/testing';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeePaymentDetailsComponent } from './fines-mci-create-till-court-fee-payment-details.component';

describe('FinesMciCreateTillCourtFeePaymentDetailsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeePaymentDetailsComponent],
      providers: [FinesMciStore],
    }).compileComponents();
  });

  it.each(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData.slice(0, 2))(
    'displays Payment details for the selected business unit: $business_unit_name',
    (businessUnit) => {
      const store = TestBed.inject(FinesMciStore);
      const courtFeeDraft = { courtFeeId: 1, amountPaid: '25.00', numberOfItems: '2' };
      store.setBusinessUnit(businessUnit);
      store.setDraftJourney('courtFee');
      store.setCourtFeeDraft(courtFeeDraft);

      const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeePaymentDetailsComponent);
      fixture.detectChanges();

      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('h1')?.textContent?.trim()).toBe('Payment details');
      expect(element.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe(businessUnit.business_unit_name);
      expect(store.courtFeeDraft()).toEqual(courtFeeDraft);
    },
  );
});
