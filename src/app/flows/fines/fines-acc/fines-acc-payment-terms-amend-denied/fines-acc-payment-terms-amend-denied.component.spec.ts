import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPaymentTermsAmendDeniedComponent } from './fines-acc-payment-terms-amend-denied.component';

describe('FinesAccPaymentTermsAmendDeniedComponent', () => {
  let component: FinesAccPaymentTermsAmendDeniedComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendDeniedComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentTermsAmendDeniedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPaymentTermsAmendDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
