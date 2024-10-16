import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryOffenceComponent } from './fines-mac-offence-details-review-summary-offence.component';

describe('FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryOffenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryOffenceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
