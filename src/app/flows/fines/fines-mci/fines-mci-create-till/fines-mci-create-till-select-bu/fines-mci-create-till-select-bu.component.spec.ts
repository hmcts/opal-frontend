import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Navigation, Router, provideRouter } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesMciCreateTillSelectBuComponent } from './fines-mci-create-till-select-bu.component';
import { FinesMciStore } from '../../stores/fines-mci.store';

describe('FinesMciCreateTillSelectBuComponent', () => {
  let component: FinesMciCreateTillSelectBuComponent;
  let fixture: ComponentFixture<FinesMciCreateTillSelectBuComponent>;
  let router: Router;
  let finesMciStore: InstanceType<typeof FinesMciStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSelectBuComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    finesMciStore = TestBed.inject(FinesMciStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use empty business unit data when the route has no resolved data', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSelectBuComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Create till');
    expect(fixture.nativeElement.querySelector('opal-lib-alphagov-accessible-autocomplete')).toBeTruthy();
  });

  it('should render a create till business unit autocomplete page', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;
    const text = nativeElement.textContent;

    expect(text).toContain('Create till');
    expect(text).toContain('Select a business unit');
    expect(nativeElement.querySelector('.govuk-button-group')?.classList).toContain(
      'fines-mci-create-till-select-bu-button-group',
    );
    expect(nativeElement.querySelector('opal-lib-govuk-cancel-link')).toBeTruthy();
  });

  it('should navigate to create and allocate when cancel is selected', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    finesMciStore.setBusinessUnit(businessUnit);
    component['form'].controls.fmci_create_till_business_unit_id.setValue(null);

    fixture.debugElement.query(By.css('opal-lib-govuk-cancel-link')).triggerEventHandler('linkClickEvent', true);

    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create-allocate']);
    expect(finesMciStore.businessUnit()).toEqual(businessUnit);
    expect(component.canDeactivate()).toBe(false);

    component.ngOnDestroy();

    expect(finesMciStore.businessUnit()).toBeNull();
  });

  it('should retain the selected business unit for the till details step', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component['form'].controls.fmci_create_till_business_unit_id.setValue(61);

    component.handleSubmit();

    expect(finesMciStore.businessUnit()).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    expect(finesMciStore.tills()).toHaveLength(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
  });

  it('should mark the business unit field as touched when submit has no selection', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.handleSubmit();

    expect(finesMciStore.businessUnit()).toBeNull();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component['form'].controls.fmci_create_till_business_unit_id.touched).toBe(true);
  });

  it('should navigate to till details after storing the selected business unit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component['form'].controls.fmci_create_till_business_unit_id.setValue(61);

    component.handleSubmit();

    expect(finesMciStore.businessUnit()).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    expect(navigateSpy).toHaveBeenCalledWith(['/', 'fines', 'manual-cash-input', 'create', 'till', 'details']);
  });

  it('should keep the user on the selection page when no business unit is chosen', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.handleSubmit();

    expect(finesMciStore.businessUnit()).toBeNull();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component['form'].controls.fmci_create_till_business_unit_id.touched).toBe(true);
  });

  it('should render selected business unit summary when the user has one business unit', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateTillSelectBuComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                businessUnits: {
                  count: 1,
                  refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]],
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const text = nativeElement.textContent;

    expect(nativeElement.querySelector('opal-lib-govuk-summary-list')).toBeTruthy();
    expect(text).toContain('Business unit');
    expect(text).toContain('Historical Debt');
    expect(text).not.toContain('The till will be created in Historical Debt');
    expect(nativeElement.querySelector('opal-lib-alphagov-accessible-autocomplete')).toBeFalsy();
  });

  it('should retain a previously selected business unit as the initial value', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    finesMciStore.setBusinessUnit(businessUnit);

    component['setInitialBusinessUnit']();

    expect(component['form'].controls.fmci_create_till_business_unit_id.value).toBe(businessUnit.business_unit_id);
  });

  it('should clear a previous journey selection on fresh entry', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    finesMciStore.setBusinessUnit(businessUnit);
    Object.defineProperty(router, 'currentNavigation', { configurable: true, value: signal<Navigation | null>(null) });

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;

    expect(finesMciStore.businessUnit()).toBeNull();
    expect(component['form'].controls.fmci_create_till_business_unit_id.value).toBeNull();
  });

  it('should preserve the business unit when returning from till details', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    finesMciStore.setBusinessUnit(businessUnit);
    Object.defineProperty(router, 'currentNavigation', {
      configurable: true,
      value: signal<Navigation | null>({
        extras: { state: { preserveBusinessUnit: true } },
      } as unknown as Navigation),
    });

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;

    expect(finesMciStore.businessUnit()).toEqual(businessUnit);
    expect(component['form'].controls.fmci_create_till_business_unit_id.value).toBe(businessUnit.business_unit_id);
  });

  it('should normalize a missing stored business unit ID to an empty form value', () => {
    const originalRefData = component['businessUnitsRefData'].refData;
    component['businessUnitsRefData'].refData = [
      { ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0], business_unit_id: undefined as never },
    ];
    finesMciStore.setBusinessUnit({ business_unit_id: undefined } as never);

    component['setInitialBusinessUnit']();

    expect(component['form'].controls.fmci_create_till_business_unit_id.value).toBeNull();
    finesMciStore.reset();
    component['businessUnitsRefData'].refData = originalRefData;
  });

  it('should prevent deactivation after the user changes to a valid business unit', () => {
    expect(component.canDeactivate()).toBe(true);

    component['form'].controls.fmci_create_till_business_unit_id.setValue(61);
    component['form'].controls.fmci_create_till_business_unit_id.markAsDirty();

    expect(component.canDeactivate()).toBe(false);
  });

  it('should block deactivation and beforeunload when a business unit is selected', () => {
    component['form'].controls.fmci_create_till_business_unit_id.setValue(61);
    component['form'].controls.fmci_create_till_business_unit_id.markAsDirty();

    expect(component.canDeactivate()).toBe(false);
    expect(component.handleBeforeUnload()).toBe(false);
  });

  it('should warn before leaving when a restored business unit selection is pristine', () => {
    const businessUnit = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0];
    finesMciStore.setBusinessUnit(businessUnit);
    Object.defineProperty(router, 'currentNavigation', {
      configurable: true,
      value: signal<Navigation | null>({
        extras: { state: { preserveBusinessUnit: true } },
      } as unknown as Navigation),
    });

    fixture = TestBed.createComponent(FinesMciCreateTillSelectBuComponent);
    component = fixture.componentInstance;

    expect(component['form'].pristine).toBe(true);
    expect(component.canDeactivate()).toBe(false);
  });

  it('should allow beforeunload when no business unit is selected', () => {
    expect(component.handleBeforeUnload()).toBe(true);
  });

  it('should run the beforeunload listener registered on the window', () => {
    const event = new Event('beforeunload');

    expect(window.dispatchEvent(event)).toBe(true);
  });

  it('should preserve the selection error when a subsequent selection is invalid', () => {
    component.handleSubmit();
    component['form'].controls.fmci_create_till_business_unit_id.setValue(999);

    expect(component['businessUnitSelectionError']).toBe('Select business unit');
  });

  it('should focus a field referenced by the error summary', () => {
    const focus = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue({ focus } as unknown as HTMLElement);

    component['scrollTo']('fmci_create_till_business_unit_id-autocomplete');

    expect(focus).toHaveBeenCalled();
  });
});
