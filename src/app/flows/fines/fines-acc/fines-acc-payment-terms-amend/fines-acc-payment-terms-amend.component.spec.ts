import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccPaymentTermsAmendComponent } from './fines-acc-payment-terms-amend.component';

describe('FinesAccPaymentTermsAmendComponent', () => {
  let component: FinesAccPaymentTermsAmendComponent;
  let fixture: ComponentFixture<FinesAccPaymentTermsAmendComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentTermsAmendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPaymentTermsAmendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
