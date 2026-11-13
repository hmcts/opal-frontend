import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ResolveStart, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
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

    expect(navigateSpy).toHaveBeenCalledWith(['payment', 'category', 'criminal', 'search'], {
      relativeTo: TestBed.inject(ActivatedRoute).parent,
    });
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

    const returnedFixture = TestBed.createComponent(FinesMciCreateTillPaymentCategoryComponent);
    returnedFixture.detectChanges();
    returnedFixture.componentInstance.handleSubmit({
      formData: { paymentCategory: 'courtFee' },
      nestedFlow: false,
    });

    expect(navigateSpy).toHaveBeenLastCalledWith(['court-fee-details'], { relativeTo: null });
    expect(finesMciStore.draftJourney()).toBe('courtFee');
    expect(finesMciStore.tills()[0].payments).toHaveLength(0);
  });

  it('navigates to Till Details when Cancel is selected', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    finesMciStore.setDraftJourney('criminal');

    fixture.componentInstance.handleCancel();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['details'], { relativeTo: null });
    expect(finesMciStore.draftJourney()).toBeNull();
  });

  it('preserves the selected category when leaving is cancelled', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(false);
    const component = fixture.componentInstance;
    finesMciStore.setDraftJourney('courtFee');
    component.handleUnsavedChanges(true);

    component.handleCancel();
    await fixture.whenStable();

    expect(component['canDeactivate']()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['details'], { relativeTo: null });
    expect(finesMciStore.draftJourney()).toBe('courtFee');
  });

  it('tracks child form changes for route and browser leave warnings', () => {
    fixture.componentInstance.handleUnsavedChanges(true);
    const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

    expect(fixture.componentInstance['canDeactivate']()).toBe(false);
    expect(window.dispatchEvent(beforeUnloadEvent)).toBe(false);
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
  });

  it('protects the till while court fees are loading and restores protection if navigation is cancelled', async () => {
    const events = new Subject<ResolveStart>();
    vi.spyOn(router, 'events', 'get').mockReturnValue(events.asObservable());
    let finishNavigation!: (navigated: boolean) => void;
    vi.spyOn(router, 'navigate').mockReturnValue(new Promise((resolve) => (finishNavigation = resolve)));
    const pendingFixture = TestBed.createComponent(FinesMciCreateTillPaymentCategoryComponent);
    pendingFixture.detectChanges();
    const component = pendingFixture.componentInstance;

    component.handleSubmit({ formData: { paymentCategory: 'courtFee' }, nestedFlow: false });
    pendingFixture.detectChanges();
    const element = pendingFixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Loading next screen');
    expect(element.querySelector('input[type="radio"]')).toBeNull();
    expect(component.handleBeforeUnload()).toBe(false);
    events.next(new ResolveStart(1, '/payment-category', '/court-fee-details', {} as RouterStateSnapshot));
    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(false);

    finishNavigation(false);
    await pendingFixture.whenStable();
    pendingFixture.detectChanges();
    expect(element.textContent).not.toContain('Loading next screen');
    expect(element.querySelector<HTMLInputElement>('input[type="radio"]:checked')?.value).toBe('courtFee');
    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('restores leave protection if navigation rejects', async () => {
    vi.spyOn(router, 'navigate').mockRejectedValue(new Error('Navigation failed'));
    const component = fixture.componentInstance;

    component.handleSubmit({ formData: { paymentCategory: 'courtFee' }, nestedFlow: false });
    await fixture.whenStable();

    expect(component['canDeactivate']()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
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
