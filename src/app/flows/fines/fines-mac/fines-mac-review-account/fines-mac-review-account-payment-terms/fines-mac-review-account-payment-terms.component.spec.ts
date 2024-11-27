import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountPaymentTermsComponent } from './fines-mac-review-account-payment-terms.component';

xdescribe('FinesMacReviewAccountPaymentTermsComponent', () => {
  let component: FinesMacReviewAccountPaymentTermsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountPaymentTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountPaymentTermsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountPaymentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
