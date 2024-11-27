import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountOffenceDetailsComponent } from './fines-mac-review-account-offence-details.component';

describe('FinesMacReviewAccountOffenceDetailsComponent', () => {
  let component: FinesMacReviewAccountOffenceDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountOffenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountOffenceDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountOffenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
