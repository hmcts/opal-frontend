import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountHistoryComponent } from './fines-mac-review-account-history.component';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';

describe('FinesMacReviewAccountHistoryComponent', () => {
  let component: FinesMacReviewAccountHistoryComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountHistoryComponent>;
  let globalStore: InstanceType<typeof GlobalStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountHistoryComponent);
    component = fixture.componentInstance;
    globalStore = TestBed.inject(GlobalStore);
    globalStore.setFeatureFlags({});
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

  it.each([
    { description: 'level 2', enabled: false, expectedHeading: 'H2' },
    { description: 'level 3', enabled: true, expectedHeading: 'H3' },
  ])(
    'should render review history timeline events as $description headings when release-1a-1-2 is $enabled',
    ({ enabled, expectedHeading }) => {
      globalStore.setFeatureFlags({ [RELEASE_1A_1_2_FEATURE_FLAG]: enabled });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.moj-timeline__title'))?.nativeElement.tagName).toBe(expectedHeading);
    },
  );
});
