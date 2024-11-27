import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountAccountDetailsComponent } from './fines-mac-review-account-account-details.component';

describe('FinesMacReviewAccountAccountDetailsComponent', () => {
  let component: FinesMacReviewAccountAccountDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountAccountDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
