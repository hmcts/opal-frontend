import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent } from './fines-mac-offence-details-review-summary-offences-total.component';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK } from '../../mocks/fines-mac-offence-details-review-summary-form.mock';

describe('FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent);
    component = fixture.componentInstance;

    component.offences = [...FINES_MAC_OFFENCE_DETAILS_REVIEW_SUMMARY_FORM_MOCK];

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
});
