import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillCourtFeeCheckComponent } from './fines-mci-create-till-court-fee-check.component';

describe('FinesMciCreateTillCourtFeeCheckComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillCourtFeeCheckComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('protects the in-memory till from unintended navigation', () => {
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });

  it.each(['cancelled', 'rejected'])('restores leave protection if Back navigation is %s', async (outcome) => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');
    if (outcome === 'cancelled') navigate.mockResolvedValue(false);
    else navigate.mockRejectedValue(new Error('Navigation failed'));
    const fixture = TestBed.createComponent(FinesMciCreateTillCourtFeeCheckComponent);
    fixture.detectChanges();
    fixture.componentInstance.handleBack();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['../court-fee-payment-details'], {
      relativeTo: TestBed.inject(ActivatedRoute),
    });
    await fixture.whenStable();
    expect(fixture.componentInstance.canDeactivate()).toBe(false);
  });
});
