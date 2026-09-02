import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-outstanding-auto-payment-counts.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiSelectBusComponent } from './fines-api-select-bus.component';
import { FinesApiStore } from '../stores/fines-api.store';

describe('FinesApiSelectBusComponent', () => {
  let component: FinesApiSelectBusComponent;
  let fixture: ComponentFixture<FinesApiSelectBusComponent>;
  let finesApiStore: InstanceType<typeof FinesApiStore>;
  let routerNavigate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    routerNavigate = vi.fn().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [FinesApiSelectBusComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                businessUnitCounts: OPAL_FINES_BUSINESS_UNIT_OUTSTANDING_AUTO_PAYMENT_COUNTS_MOCK,
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

    expect(nativeElement.textContent).toContain('Select at least 1 business unit');
    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('should clear validation errors and navigate to process allocate when continue is selected with a business unit', () => {
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const continueButton = nativeElement.querySelector<HTMLButtonElement>('#fines-api-select-business-units-continue');
    continueButton!.click();
    fixture.detectChanges();
    expect(nativeElement.textContent).toContain('Select at least 1 business unit');

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
});
