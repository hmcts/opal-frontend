import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccDefendantAlternatePaymentReferenceAccessDeniedComponent } from './fines-acc-defendant-alternate-payment-reference-access-denied.component';

describe('FinesAccDefendantAlternatePaymentReferenceAccessDeniedComponent', () => {
  let fixture: ComponentFixture<FinesAccDefendantAlternatePaymentReferenceAccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantAlternatePaymentReferenceAccessDeniedComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ accountId: '123' }) } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantAlternatePaymentReferenceAccessDeniedComponent);
  });

  it('should display the generic access denied message and a link back to payment terms for the same account', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Access Denied');
    expect(fixture.nativeElement.textContent).toContain(
      'You do not have the appropriate permissions to access this page.',
    );
    const link = fixture.nativeElement.querySelector('#go-back') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Go back');
    expect(link.getAttribute('href')).toBe('/fines/account/defendant/123/details#payment-terms');
  });

  it('should return to the account payment terms when Go back is selected', () => {
    const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('#go-back') as HTMLAnchorElement).click();

    expect(navigateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ fragment: 'payment-terms' }),
      expect.objectContaining({ skipLocationChange: false }),
    );
    const url = navigateSpy.mock.calls[0][0];
    expect(TestBed.inject(Router).serializeUrl(url as UrlTree)).toBe(
      '/fines/account/defendant/123/details#payment-terms',
    );
  });
});
