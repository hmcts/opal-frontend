import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccPaymentHoldAddComponent } from './fines-acc-payment-hold-add.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesAccPaymentHoldAddComponent', () => {
  let component: FinesAccPaymentHoldAddComponent;
  let fixture: ComponentFixture<FinesAccPaymentHoldAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentHoldAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPaymentHoldAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
