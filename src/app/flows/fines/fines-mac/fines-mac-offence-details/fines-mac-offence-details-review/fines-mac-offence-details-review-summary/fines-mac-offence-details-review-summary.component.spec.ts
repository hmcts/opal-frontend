import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryComponent } from './fines-mac-offence-details-review-summary.component';

describe('FinesMacOffenceDetailsReviewSummaryComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
