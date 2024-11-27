import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountContactDetailsComponent } from './fines-mac-review-account-contact-details.component';

describe('FinesMacReviewAccountContactDetailsComponent', () => {
  let component: FinesMacReviewAccountContactDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountContactDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
