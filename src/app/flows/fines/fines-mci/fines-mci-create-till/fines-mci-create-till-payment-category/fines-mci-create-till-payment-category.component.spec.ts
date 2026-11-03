import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillPaymentCategoryComponent } from './fines-mci-create-till-payment-category.component';

describe('FinesMciCreateTillPaymentCategoryComponent', () => {
  let fixture: ComponentFixture<FinesMciCreateTillPaymentCategoryComponent>;
  let router: Router;
  let finesMciStore: InstanceType<typeof FinesMciStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillPaymentCategoryComponent],
      providers: [provideRouter([]), FinesMciStore],
    }).compileComponents();

    finesMciStore = TestBed.inject(FinesMciStore);
    finesMciStore.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    finesMciStore.ensureTill();
    fixture = TestBed.createComponent(FinesMciCreateTillPaymentCategoryComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('shows the selected business unit and payment category options', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Payment category');
    expect(element.textContent).toContain('Historical Debt');
    expect(element.querySelectorAll('input[type="radio"]')).toHaveLength(3);
    expect(element.textContent).toContain('Criminal');
    expect(element.textContent).toContain('Court fee');
    expect(element.textContent).toContain('Suspense');
  });

  it('navigates to Search for an account for the Criminal category', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.handleSubmit({
      formData: { paymentCategory: 'criminal' },
      nestedFlow: false,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['search-account'], { relativeTo: null });
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(false);
    expect(finesMciStore.draftJourney()).toBe('criminal');
    expect(finesMciStore.tills()[0].payments).toEqual([]);
  });

  it('keeps the page and leave warning when submitted without a category', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.handleSubmit({
      formData: { paymentCategory: null },
      nestedFlow: false,
    });

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(true);
    expect(finesMciStore.tills()[0].payments).toEqual([]);
  });

  it.each([
    ['courtFee', 'court-fee-details'],
    ['suspense', 'suspense-details'],
  ] as const)('saves a %s draft and navigates to its details page', (category, route) => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.handleSubmit({
      formData: { paymentCategory: category },
      nestedFlow: false,
    });

    expect(navigateSpy).toHaveBeenCalledWith([route], { relativeTo: null });
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(false);
    expect(finesMciStore.draftJourney()).toBe(category);
    expect(finesMciStore.tills()[0].payments).toEqual([]);
  });

  it('does not add another payment when changing category after returning from an unfinished journey', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.handleSubmit({
      formData: { paymentCategory: 'criminal' },
      nestedFlow: false,
    });
    expect(finesMciStore.tills()[0].payments).toHaveLength(0);

    fixture.componentInstance.handleSubmit({
      formData: { paymentCategory: 'courtFee' },
      nestedFlow: false,
    });

    expect(navigateSpy).toHaveBeenLastCalledWith(['court-fee-details'], { relativeTo: null });
    expect(finesMciStore.draftJourney()).toBe('courtFee');
    expect(finesMciStore.tills()[0].payments).toHaveLength(0);
  });

  it('navigates to Till Details when Cancel is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    finesMciStore.setDraftJourney('criminal');

    fixture.componentInstance.handleCancel();

    expect(navigateSpy).toHaveBeenCalledWith(['details'], { relativeTo: null });
    expect(finesMciStore.draftJourney()).toBeNull();
  });

  it('keeps leave protection active when Cancel is selected after changing category', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const component = fixture.componentInstance;
    component.handleUnsavedChanges(true);

    component.handleCancel();

    expect(component['canDeactivate']()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['details'], { relativeTo: null });
    expect(finesMciStore.draftJourney()).toBeNull();
  });

  it('tracks child form changes for route and browser leave warnings', () => {
    fixture.componentInstance.handleUnsavedChanges(true);
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });

  it('restores leave protection for a seeded draft before any further input', () => {
    finesMciStore.setDraftJourney('criminal');
    const draftFixture = TestBed.createComponent(FinesMciCreateTillPaymentCategoryComponent);
    draftFixture.detectChanges();
    const component = draftFixture.componentInstance;
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(
      (draftFixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#paymentCategory')?.checked,
    ).toBe(true);
    expect(component['canDeactivate']()).toBe(false);
    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });
});
