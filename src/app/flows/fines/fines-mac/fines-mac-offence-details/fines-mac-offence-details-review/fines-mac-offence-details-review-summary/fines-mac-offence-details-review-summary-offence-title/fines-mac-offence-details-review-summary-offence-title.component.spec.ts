import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent } from './fines-mac-offence-details-review-summary-offence-title.component';

describe('FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
