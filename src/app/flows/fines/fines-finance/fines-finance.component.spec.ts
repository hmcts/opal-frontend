import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesFinanceComponent } from './fines-finance.component';

describe('FinesFinance', () => {
  let component: FinesFinanceComponent;
  let fixture: ComponentFixture<FinesFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesFinanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
