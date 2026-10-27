import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillPaymentCategoryComponent } from './fines-mci-create-till-payment-category.component';

describe('FinesMciCreateTillPaymentCategoryComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillPaymentCategoryComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillPaymentCategoryComponent],
      providers: [provideRouter([]), FinesMciStore],
    }).compileComponents();

    TestBed.inject(FinesMciStore).setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    fixture = TestBed.createComponent(FinesMciCreateTillPaymentCategoryComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('shows the payment categories and selected business unit', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Payment category');
    expect(element.textContent).toContain('Historical Debt');
    expect(element.querySelectorAll('input[type="radio"]')).toHaveLength(3);
    expect(element.textContent).toContain('Criminal');
    expect(element.textContent).toContain('Court fee');
    expect(element.textContent).toContain('Suspense');
  });

  it('shows validation when continuing without a category', () => {
    fixture.componentInstance.handleSubmit();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.govuk-form-group.govuk-form-group--error')).not.toBeNull();
    expect(element.querySelector('.govuk-error-message')?.textContent).toContain('Select payment category');
    expect(element.querySelector('.govuk-error-summary__list')?.textContent).toContain('Select payment category');
  });

  it('focuses the first radio when the error summary link is selected', () => {
    fixture.componentInstance.handleSubmit();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLAnchorElement>('.govuk-error-summary__list a')?.click();

    expect(document.activeElement?.id).toBe('paymentCategory-fines-mci-payment-category-criminal');
  });

  it('navigates to search for an account for the Criminal category', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance['form'].controls.paymentCategory.setValue('criminal');

    fixture.componentInstance.handleSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'search-account']);
  });

  it.each(['courtFee', 'suspense'] as const)('does not navigate for %s', (category) => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.componentInstance['form'].controls.paymentCategory.setValue(category);

    fixture.componentInstance.handleSubmit();

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(
      TestBed.inject(FinesMciStore)
        .tills()
        .flatMap(({ payments }) => payments),
    ).toHaveLength(0);
  });

  it('returns to till details from Cancel', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.handleCancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
  });

  it('keeps the leave guard active when Cancel is selected after choosing a category', () => {
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component['form'].controls.paymentCategory.setValue('suspense');

    expect(component.canDeactivate()).toBe(false);

    component.handleCancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
    expect(component.canDeactivate()).toBe(false);
  });

  it('warns before refreshing when a category is selected', () => {
    fixture.componentInstance['form'].controls.paymentCategory.setValue('criminal');
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });
});
