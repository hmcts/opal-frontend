import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('should store selected business unit ids when a row checkbox changes', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const checkbox = nativeElement.querySelector<HTMLInputElement>('#fines-api-business-unit-77');
    checkbox!.checked = true;
    checkbox!.dispatchEvent(new Event('change'));
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
    checkbox!.dispatchEvent(new Event('change'));
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
    selectAllCheckbox!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([77, 65, 78, 73, 80]);

    selectAllCheckbox!.checked = false;
    selectAllCheckbox!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([]);
    expect(finesApiStore.unsavedChanges()).toBe(false);
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
    checkbox!.dispatchEvent(new Event('change'));

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
