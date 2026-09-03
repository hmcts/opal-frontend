import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-outstanding-auto-payment-counts.mock';
import { IOpalFinesBusinessUnitOutstandingAutoPaymentCounts } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-counts.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiSelectBusComponent } from './fines-api-select-bus.component';
import { FinesApiStore } from '../stores/fines-api.store';
import { FINES_API_SELECT_BUS_ERRORS } from './constants/fines-api-select-bus-errors.constant';

describe('FinesApiSelectBusComponent', () => {
  let component: FinesApiSelectBusComponent;
  let fixture: ComponentFixture<FinesApiSelectBusComponent>;
  let finesApiStore: InstanceType<typeof FinesApiStore>;
  let routerNavigate: ReturnType<typeof vi.fn>;
  let businessUnitCounts: IOpalFinesBusinessUnitOutstandingAutoPaymentCounts;

  beforeEach(async () => {
    routerNavigate = vi.fn().mockResolvedValue(true);
    businessUnitCounts = OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesApiSelectBusComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                get businessUnitCounts() {
                  return businessUnitCounts;
                },
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: routerNavigate,
          },
        },
      ],
    }).compileComponents();

    finesApiStore = TestBed.inject(FinesApiStore);
    finesApiStore.resetFinesApiState();
    fixture = TestBed.createComponent(FinesApiSelectBusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render business units from route data in the resolver order', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const textContent = nativeElement.textContent;
    const businessUnitNames = OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK.business_units.map(
      ({ business_unit_name }) => business_unit_name,
    );

    expect(textContent).toContain('Automatic Cash Input');
    expect(textContent).toContain('Select business units');
    expect(businessUnitNames).toEqual([
      'Camberwell Green',
      'Camden and Islington',
      'N E Region',
      'West London',
      'Westminster - North (Wells Street)',
    ]);
    expect(textContent.indexOf('Camberwell Green')).toBeLessThan(textContent.indexOf('Camden and Islington'));
  });

  it('should initialise with no business units when resolver data is missing', () => {
    businessUnitCounts = null as unknown as IOpalFinesBusinessUnitOutstandingAutoPaymentCounts;

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const continueButton = nativeElement.querySelector<HTMLButtonElement>('#fines-api-select-business-units-continue');
    const selectAllCheckbox = nativeElement.querySelector<HTMLInputElement>('#fines-api-select-business-units');

    expect(component['businessUnits']).toEqual([]);
    expect(component.hasBusinessUnits).toBe(false);
    expect(component.allBusinessUnitsSelected).toBe(false);
    expect(component.someBusinessUnitsSelected).toBe(false);
    expect(nativeElement.textContent).toContain('There are no business units available.');
    expect(continueButton?.disabled).toBe(true);
    expect(selectAllCheckbox).toBeNull();
  });

  it('should not show a validation error or navigate when continue is triggered without available business units', () => {
    businessUnitCounts = { business_units: [] };

    fixture.detectChanges();

    component['continue']();

    expect(component['formErrorSummaryMessage']).toEqual([]);
    expect(component['hasBusinessUnitSelectionError']).toBe(false);
    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('should report partial and complete business unit selection states', () => {
    fixture.detectChanges();

    component['toggleBusinessUnit']({ rowId: 77, checked: true });

    expect(component.allBusinessUnitsSelected).toBe(false);
    expect(component.someBusinessUnitsSelected).toBe(true);

    component['toggleAllBusinessUnits'](true);

    expect(component.allBusinessUnitsSelected).toBe(true);
    expect(component.someBusinessUnitsSelected).toBe(false);
  });

  it('should store selected business unit ids when a row checkbox changes', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const checkbox = nativeElement.querySelector<HTMLInputElement>('#fines-api-business-unit-77');
    checkbox!.checked = true;
    checkbox!.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([77]);
    expect(finesApiStore.unsavedChanges()).toBe(true);
  });

  it('should remove a selected business unit id when a row checkbox is unchecked', () => {
    finesApiStore.setSelectedBusinessUnitIds([77, 65]);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const checkbox = nativeElement.querySelector<HTMLInputElement>('#fines-api-business-unit-77');
    checkbox!.checked = false;
    checkbox!.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([65]);
    expect(finesApiStore.unsavedChanges()).toBe(true);
  });

  it('should clear stored business unit ids that are not in the resolver data', () => {
    businessUnitCounts = {
      business_units: [
        {
          business_unit_id: 65,
          business_unit_name: 'Camden and Islington',
          file_count: 0,
          till_count: 0,
        },
      ],
    };
    finesApiStore.setSelectedBusinessUnitIds([77]);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const continueButton = nativeElement.querySelector<HTMLButtonElement>('#fines-api-select-business-units-continue');
    continueButton!.click();
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([]);
    expect(finesApiStore.unsavedChanges()).toBe(false);
    expect(nativeElement.textContent).toContain(FINES_API_SELECT_BUS_ERRORS.selectAtLeastOneBusinessUnit);
    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('should keep stored business unit ids that are still in the resolver data', () => {
    finesApiStore.setSelectedBusinessUnitIds([77, 65, 999]);
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([77, 65]);
    expect(finesApiStore.unsavedChanges()).toBe(true);
  });

  it('should select and clear all business units from the top-level checkbox', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const selectAllCheckbox = nativeElement.querySelector<HTMLInputElement>('#fines-api-select-business-units');
    selectAllCheckbox!.checked = true;
    selectAllCheckbox!.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([77, 65, 78, 73, 80]);

    selectAllCheckbox!.checked = false;
    selectAllCheckbox!.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([]);
    expect(finesApiStore.unsavedChanges()).toBe(false);
  });

  it('should ignore row selection events that do not contain a numeric business unit id', () => {
    fixture.detectChanges();

    component['toggleBusinessUnit']({ rowId: 'not-a-business-unit-id', checked: true });

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([]);
    expect(component['selectedBusinessUnitIds']).toEqual(new Set<number>());
  });

  it('should fall back to the local selection set when checking a business unit that is not displayed', () => {
    fixture.detectChanges();

    component['selectedBusinessUnitIds'] = new Set([999]);

    expect(component['isBusinessUnitSelected'](999)).toBe(true);
    expect(component['isBusinessUnitSelected'](1000)).toBe(false);
  });

  it('should initialise and synchronise business unit checkbox controls', () => {
    fixture.detectChanges();

    const [businessUnit] = component['businessUnits'];
    const control = component['businessUnitControls'].get(businessUnit.business_unit_id);

    expect(component['businessUnitControls'].size).toBe(component['businessUnits'].length);
    expect(control?.value).toBe(false);

    component['selectedBusinessUnitIds'] = new Set([businessUnit.business_unit_id]);
    component['syncSelectionControls']();

    expect(component['businessUnitControls'].get(businessUnit.business_unit_id)).toBe(control);
    expect(control?.value).toBe(true);

    component['syncSelectionControls']();

    expect(component['businessUnitControls'].get(businessUnit.business_unit_id)).toBe(control);
    expect(control?.value).toBe(true);
  });

  it('should remove checkbox controls for business units that are no longer displayed', () => {
    fixture.detectChanges();

    const firstBusinessUnit = component['businessUnits'][0];
    const staleControl = component['businessUnitControls'].get(firstBusinessUnit.business_unit_id);
    component['businessUnits'] = [component['businessUnits'][1]];
    component['selectedBusinessUnitIds'] = new Set([component['businessUnits'][0].business_unit_id]);

    component['syncSelectionControls']();

    expect(component['businessUnitControls'].has(firstBusinessUnit.business_unit_id)).toBe(false);
    expect(component['businessUnitControls'].get(component['businessUnits'][0].business_unit_id)?.value).toBe(true);
    expect(staleControl?.value).toBe(false);
  });

  it('should update existing controls when sync selection state changes', () => {
    fixture.detectChanges();

    const firstBusinessUnit = component['businessUnits'][0];
    component['businessUnitControls'].set(
      firstBusinessUnit.business_unit_id,
      new FormControl(false, { nonNullable: true }),
    );
    component['selectedBusinessUnitIds'] = new Set([firstBusinessUnit.business_unit_id]);

    component['syncSelectionControls']();

    expect(component['businessUnitControls'].get(firstBusinessUnit.business_unit_id)?.value).toBe(true);
    expect(component['selectAllControl'].value).toBe(false);
  });

  it('should show a validation error and remain on the page when continue is selected without a business unit', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const continueButton = nativeElement.querySelector<HTMLButtonElement>('#fines-api-select-business-units-continue');
    continueButton!.click();
    fixture.detectChanges();

    expect(nativeElement.textContent).toContain(FINES_API_SELECT_BUS_ERRORS.selectAtLeastOneBusinessUnit);
    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('should clear validation errors and navigate to process allocate when continue is selected with a business unit', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const continueButton = nativeElement.querySelector<HTMLButtonElement>('#fines-api-select-business-units-continue');
    continueButton!.click();
    fixture.detectChanges();
    expect(nativeElement.textContent).toContain(FINES_API_SELECT_BUS_ERRORS.selectAtLeastOneBusinessUnit);

    const checkbox = nativeElement.querySelector<HTMLInputElement>('#fines-api-business-unit-77');
    checkbox!.checked = true;
    checkbox!.dispatchEvent(new Event('change', { bubbles: true }));

    continueButton!.click();
    fixture.detectChanges();

    expect(component['formErrorSummaryMessage']).toEqual([]);
    expect(routerNavigate).toHaveBeenCalledWith(['/', 'fines', 'auto-payment-in', 'process-allocate']);
  });

  it('should navigate to the finance tab and reset state when cancel navigation succeeds', async () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const cancelLink = nativeElement.querySelector<HTMLAnchorElement>('a');
    cancelLink!.click();
    await fixture.whenStable();

    expect(routerNavigate).toHaveBeenCalledWith(['/', 'fines', 'dashboard', 'finance']);
    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([]);
  });

  it('should keep selections when cancel navigation is blocked by the route guard', async () => {
    routerNavigate.mockResolvedValue(false);
    finesApiStore.setSelectedBusinessUnitIds([77]);

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const cancelLink = nativeElement.querySelector<HTMLAnchorElement>('a');
    cancelLink!.click();
    await fixture.whenStable();

    expect(routerNavigate).toHaveBeenCalledWith(['/', 'fines', 'dashboard', 'finance']);
    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([77]);
  });

  it('should focus the element matching an error summary field id', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const checkbox = nativeElement.querySelector<HTMLInputElement>('#fines-api-select-business-units');
    const focusSpy = vi.spyOn(checkbox!, 'focus');

    component['scrollTo']('fines-api-select-business-units');

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should not throw when an error summary field id does not match an element', () => {
    fixture.detectChanges();

    expect(() => component['scrollTo']('missing-field-id')).not.toThrow();
  });
});
