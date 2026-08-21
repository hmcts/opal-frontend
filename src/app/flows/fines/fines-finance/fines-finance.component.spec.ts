import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { FinesFinanceComponent } from './fines-finance.component';

describe('FinesFinance', () => {
  let component: FinesFinanceComponent;
  let fixture: ComponentFixture<FinesFinanceComponent>;

  beforeAll(async () => {
    await resolveComponentResources(() => Promise.resolve(''));
  });

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
