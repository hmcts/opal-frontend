import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent } from './fines-mac-offence-details-review-summary-date-of-sentence.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent', () => {
  let component: FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
