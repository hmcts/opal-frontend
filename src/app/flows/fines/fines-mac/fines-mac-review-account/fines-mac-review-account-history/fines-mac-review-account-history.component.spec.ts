import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountHistoryComponent } from './fines-mac-review-account-history.component';
import { By } from '@angular/platform-browser';
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
    component.defendantName = 'Test defendant';
    component.accountStatus = 'Submitted';
    component.timelineData = [
      {
        status: 'Submitted',
        username: 'Test user',
        status_date: '2026-01-01',
        reason_text: null,
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render review history timeline events as level 3 headings', () => {
    expect(fixture.debugElement.query(By.css('.moj-timeline__title'))?.nativeElement.tagName).toBe('H3');
    expect(fixture.debugElement.query(By.css('h2.moj-timeline__title'))).toBeNull();
  });
});
