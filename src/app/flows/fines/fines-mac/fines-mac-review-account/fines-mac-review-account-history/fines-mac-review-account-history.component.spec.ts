import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountHistoryComponent } from './fines-mac-review-account-history.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesMacReviewAccountHistoryComponent', () => {
  let component: FinesMacReviewAccountHistoryComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountHistoryComponent);
    component = fixture.componentInstance;
    component.defendantName = 'John Smith';
    component.accountStatus = 'Rejected';
    component.timelineData = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display API timeline statuses using the review history labels', () => {
    component.timelineData = [
      { status: 'Submitted', username: 'User One', status_date: '2026-08-01', reason_text: null },
      { status: 'Resubmitted', username: 'User Two', status_date: '2026-08-02', reason_text: null },
      { status: 'Rejected', username: 'User Three', status_date: '2026-08-03', reason_text: 'Reason' },
    ];

    fixture.detectChanges();

    const timelineTitles = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.moj-timeline__title'));
    expect(timelineTitles.map(({ textContent }) => textContent?.trim())).toEqual(['Created', 'Submitted', 'Rejected']);
  });
});
