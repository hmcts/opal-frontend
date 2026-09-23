import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillDetailsComponent } from './fines-mci-create-till-details.component';

describe('FinesMciCreateTillDetailsComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillDetailsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillDetailsComponent],
      providers: [provideRouter([]), FinesMciStore],
    }).compileComponents();

    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciCreateTillDetailsComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should display the selected business unit and empty till content', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.textContent).toContain('Till details');
    expect(nativeElement.textContent).toContain('Business unit');
    expect(nativeElement.textContent).toContain('Historical Debt');
    expect(nativeElement.textContent).toContain('Payments');
    expect(nativeElement.textContent).toContain('There are no payments');
    expect(nativeElement.textContent).toContain('Create till');
    expect(nativeElement.textContent).toContain('You must add at least 1 payment to the till.');
    expect(nativeElement.querySelector('#fines-mci-add-payment')?.classList).toContain('govuk-button--secondary');
    const deleteTillLink = nativeElement.querySelector('#fines-mci-delete-till');
    expect(deleteTillLink?.tagName).toBe('A');
    expect(deleteTillLink?.classList).toContain('govuk-error-colour');
    expect(deleteTillLink?.textContent?.trim()).toBe('Delete till');
  });

  it('should clear the journey and navigate back to Manual Cash Input', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const store = TestBed.inject(FinesMciStore);

    fixture.debugElement.query(By.css('opal-lib-govuk-back-link')).triggerEventHandler('clickEvent');

    expect(store.businessUnit()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create-allocate']);
  });

  it('should navigate to payment category when Add payment is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.debugElement.query(By.css('opal-lib-govuk-button')).triggerEventHandler('buttonClickEvent');

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create/till/payment-category']);
  });

  it('should navigate to cancel till creation when Delete till is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.debugElement.query(By.css('#fines-mci-delete-till')).triggerEventHandler('click', new Event('click'));

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create/till/cancel']);
  });
});
