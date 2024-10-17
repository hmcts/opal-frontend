import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent } from './fines-mac-offence-details-review-summary-offences-total.component';

describe('FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
