import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountFailedBannerComponent } from './fines-mac-review-account-failed-banner.component';

describe('FinesMacReviewAccountFailedBannerComponent', () => {
  let component: FinesMacReviewAccountFailedBannerComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountFailedBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountFailedBannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountFailedBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
