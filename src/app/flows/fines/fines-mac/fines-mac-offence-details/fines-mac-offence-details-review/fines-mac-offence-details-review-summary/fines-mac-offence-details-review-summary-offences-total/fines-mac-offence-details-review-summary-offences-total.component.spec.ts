import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent } from './fines-mac-offence-details-review-summary-offences-total.component';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from '../../mocks/fines-mac-offence-details-review-summary-form.mock';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent);
    component = fixture.componentInstance;

    component.offences = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK)];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate totals correctly', () => {
    const expectedAmountImposedTotal = '£800.00';
    const expectedAmountPaidTotal = '£200.00';
    const expectedBalanceRemainingTotal = '£600.00';

    component['getTotals']();

    expect(component.totals.amountImposedTotal).toEqual(expectedAmountImposedTotal);
    expect(component.totals.amountPaidTotal).toEqual(expectedAmountPaidTotal);
    expect(component.totals.balanceRemainingTotal).toEqual(expectedBalanceRemainingTotal);
  });

  it('should include a fully paid imposition when calculating totals across offences', () => {
    const fullyPaidFixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent);
    const fullyPaidComponent = fullyPaidFixture.componentInstance;
    fullyPaidComponent.offences = structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK).map(
      (offence, index) => ({
        ...offence,
        formData: {
          ...offence.formData,
          fm_offence_details_impositions: [
            {
              ...offence.formData.fm_offence_details_impositions[0],
              fm_offence_details_amount_imposed: index === 0 ? 341 : 100,
              fm_offence_details_amount_paid: index === 0 ? 0 : 100,
              fm_offence_details_balance_remaining: index === 0 ? 341 : 0,
            },
          ],
        },
      }),
    );

    fullyPaidFixture.detectChanges();

    expect(fullyPaidComponent.totals.amountImposedTotal).toEqual('£441.00');
    expect(fullyPaidComponent.totals.amountPaidTotal).toEqual('£100.00');
    expect(fullyPaidComponent.totals.balanceRemainingTotal).toEqual('£341.00');
  });

  it('should ignore impositions without imposed or remaining amounts', () => {
    const skippedFixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent);
    const skippedComponent = skippedFixture.componentInstance;
    skippedComponent.offences = [
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK[0]),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK[0].formData),
          fm_offence_details_impositions: [
            {
              ...structuredClone(
                FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK[0].formData.fm_offence_details_impositions[0],
              ),
              fm_offence_details_amount_imposed: null,
              fm_offence_details_amount_paid: 10,
              fm_offence_details_balance_remaining: 5,
            },
          ],
        },
      },
    ];

    skippedFixture.detectChanges();

    expect(skippedComponent.totals.amountImposedTotal).toEqual('£0.00');
    expect(skippedComponent.totals.amountPaidTotal).toEqual('£0.00');
    expect(skippedComponent.totals.balanceRemainingTotal).toEqual('£0.00');
  });
});
