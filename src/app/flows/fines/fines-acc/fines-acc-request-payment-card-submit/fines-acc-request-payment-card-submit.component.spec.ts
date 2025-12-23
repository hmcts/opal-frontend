import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesAccRequestPaymentCardSubmitComponent } from './fines-acc-request-payment-card-submit.component';

describe('FinesAccRequestPaymentCardSubmitComponent', () => {
  let component: FinesAccRequestPaymentCardSubmitComponent;
  let fixture: ComponentFixture<FinesAccRequestPaymentCardSubmitComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccRequestPaymentCardSubmitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccRequestPaymentCardSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
