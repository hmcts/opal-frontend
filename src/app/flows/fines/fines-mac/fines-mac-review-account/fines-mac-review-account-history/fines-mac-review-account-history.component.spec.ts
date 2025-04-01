import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountHistoryComponent } from './fines-mac-review-account-history.component';

describe('FinesMacReviewAccountHistoryComponent', () => {
  let component: FinesMacReviewAccountHistoryComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
