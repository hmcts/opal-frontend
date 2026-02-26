import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesAccPaymentHoldRemoveComponent } from './fines-acc-payment-hold-remove.component';
import { beforeEach, describe, expect, it } from 'vitest';

describe('FinesAccPaymentHoldRemoveComponent', () => {
  let component: FinesAccPaymentHoldRemoveComponent;
  let fixture: ComponentFixture<FinesAccPaymentHoldRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPaymentHoldRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPaymentHoldRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
