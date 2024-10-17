import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacOffenceDetailsReviewSummaryImpositionTableComponent } from './fines-mac-offence-details-review-summary-imposition-table.component';

describe('FinesMacOffenceDetailsReviewSummaryImpositionTableComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryImpositionTableComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryImpositionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryImpositionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryImpositionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
