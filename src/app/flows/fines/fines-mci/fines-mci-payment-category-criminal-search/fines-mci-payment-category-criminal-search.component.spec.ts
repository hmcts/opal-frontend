import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesMciPaymentCategoryCriminalSearchComponent } from './fines-mci-payment-category-criminal-search.component';

describe('FinesMciPaymentCategoryCriminalSearchComponent', () => {
  let component: FinesMciPaymentCategoryCriminalSearchComponent;
  let fixture: ComponentFixture<FinesMciPaymentCategoryCriminalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciPaymentCategoryCriminalSearchComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciPaymentCategoryCriminalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a criminal account search placeholder page', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Search for criminal accounts');
    expect(text).toContain('This page is not available yet.');
    expect(text).toContain('Back to finance');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe('/fines/dashboard/finance');
  });
});
