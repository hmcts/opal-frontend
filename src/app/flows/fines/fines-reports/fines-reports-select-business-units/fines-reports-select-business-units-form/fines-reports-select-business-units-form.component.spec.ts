import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormRecord } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesReportsSelectBusinessUnitsFormComponent } from './fines-reports-select-business-units-form.component';

describe('FinesReportsSelectBusinessUnitsFormComponent', () => {
  let component: FinesReportsSelectBusinessUnitsFormComponent;
  let fixture: ComponentFixture<FinesReportsSelectBusinessUnitsFormComponent>;

  const businessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData.slice(0, 3);

  const setup = async (units = businessUnits) => {
    await TestBed.configureTestingModule({
      imports: [FinesReportsSelectBusinessUnitsFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesReportsSelectBusinessUnitsFormComponent);
    component = fixture.componentInstance;
    component.businessUnits = units;
    fixture.detectChanges();

    return { component, fixture };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create one unchecked checkbox control per business unit', async () => {
    const { component } = await setup();
    const record = component['form'].get('fines_reports_select_business_unit_ids') as FormRecord<FormControl<boolean>>;
    const selectAllControl = component['form'].get(
      'fines_reports_select_business_unit_ids_select_all',
    ) as FormControl<boolean>;

    expect(Object.keys(record.controls)).toEqual(['61', '67', '68']);
    expect(record.get('61')?.value).toBe(false);
    expect(record.get('67')?.value).toBe(false);
    expect(record.get('68')?.value).toBe(false);
    expect(selectAllControl.value).toBe(false);
  });

  it('should render a master checkbox and one checkbox row per business unit', async () => {
    const { component, fixture } = await setup();

    expect(component.businessUnitRows).toHaveLength(3);
    expect(Array.from(fixture.nativeElement.querySelectorAll('input[type="checkbox"]'))).toHaveLength(4);
    expect(fixture.nativeElement.textContent).toContain('Historical Debt');
    expect(fixture.nativeElement.textContent).toContain('London Central & South East');
    expect(fixture.nativeElement.textContent).toContain('London Confiscation Orders');
  });

  it('should update selected business unit ids and count when checkbox values change', async () => {
    const { component } = await setup();
    const record = component['form'].get('fines_reports_select_business_unit_ids') as FormRecord<FormControl<boolean>>;

    record.get('61')?.setValue(true);
    record.get('68')?.setValue(true);

    expect(component.selectedBusinessUnitIds()).toEqual([61, 68]);
    expect(component.selectedCount()).toBe(2);
    expect(component.isAllSelected()).toBe(false);
  });

  it('should select every business unit when the master checkbox is selected', async () => {
    const { component } = await setup();
    const record = component['form'].get('fines_reports_select_business_unit_ids') as FormRecord<FormControl<boolean>>;

    component.allBusinessUnitsControl.setValue(true);

    expect(record.get('61')?.value).toBe(true);
    expect(record.get('67')?.value).toBe(true);
    expect(record.get('68')?.value).toBe(true);
    expect(component.selectedBusinessUnitIds()).toEqual([61, 67, 68]);
    expect(component.selectedCount()).toBe(3);
    expect(component.isAllSelected()).toBe(true);
    expect(component.allBusinessUnitsControl.value).toBe(true);
  });

  it('should deselect every business unit when the master checkbox is deselected', async () => {
    const { component } = await setup();
    const record = component['form'].get('fines_reports_select_business_unit_ids') as FormRecord<FormControl<boolean>>;

    component.allBusinessUnitsControl.setValue(true);
    component.allBusinessUnitsControl.setValue(false);

    expect(record.get('61')?.value).toBe(false);
    expect(record.get('67')?.value).toBe(false);
    expect(record.get('68')?.value).toBe(false);
    expect(component.selectedBusinessUnitIds()).toEqual([]);
    expect(component.selectedCount()).toBe(0);
    expect(component.isAllSelected()).toBe(false);
    expect(component.allBusinessUnitsControl.value).toBe(false);
  });

  it('should keep the master checkbox deselected when only some business units are selected', async () => {
    const { component } = await setup();
    const record = component['form'].get('fines_reports_select_business_unit_ids') as FormRecord<FormControl<boolean>>;

    record.get('61')?.setValue(true);
    record.get('68')?.setValue(true);

    expect(component.selectedBusinessUnitIds()).toEqual([61, 68]);
    expect(component.isAllSelected()).toBe(false);
    expect(component.allBusinessUnitsControl.value).toBe(false);
  });

  it('should select the master checkbox when every business unit is selected individually', async () => {
    const { component } = await setup();
    const record = component['form'].get('fines_reports_select_business_unit_ids') as FormRecord<FormControl<boolean>>;

    record.get('61')?.setValue(true);
    record.get('67')?.setValue(true);
    record.get('68')?.setValue(true);

    expect(component.selectedBusinessUnitIds()).toEqual([61, 67, 68]);
    expect(component.selectedCount()).toBe(3);
    expect(component.isAllSelected()).toBe(true);
    expect(component.allBusinessUnitsControl.value).toBe(true);
  });

  it('should show a single business unit as read-only information', async () => {
    const singleBusinessUnit = [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]];
    const { component, fixture } = await setup(singleBusinessUnit);

    expect(component.businessUnitRows).toEqual([]);
    expect(component.selectedBusinessUnitIds()).toEqual([61]);
    expect(component.selectedCount()).toBe(1);
    expect(component.isAllSelected()).toBe(true);
    expect(fixture.nativeElement.querySelector('input[type="checkbox"]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Historical Debt');
  });

  it('should emit cancelSelection when cancel is selected', async () => {
    const { component, fixture } = await setup();
    const cancelSpy = vi.spyOn(component.cancelSelection, 'emit');
    const cancelLink = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement;

    cancelLink.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should render the cancel link after the continue button', async () => {
    const { fixture } = await setup();
    const continueButton = fixture.nativeElement.querySelector('#continue-create-report') as HTMLButtonElement;
    const cancelLink = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement;
    const buttonGroupText = fixture.nativeElement.querySelector('.govuk-button-group')?.textContent ?? '';

    expect(continueButton.textContent?.trim()).toBe('Continue');
    expect(cancelLink.textContent?.trim()).toBe('Cancel');
    expect(buttonGroupText.indexOf('Continue')).toBeLessThan(buttonGroupText.indexOf('Cancel'));
  });
});
