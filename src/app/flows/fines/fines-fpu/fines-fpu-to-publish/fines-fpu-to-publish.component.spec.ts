import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesFpuBusinessUnit } from '../interfaces/fines-fpu-business-unit.interface';
import { FinesFpuStore } from '../stores/fines-fpu.store';
import { FinesFpuToPublishFormComponent } from './fines-fpu-to-publish-form/fines-fpu-to-publish-form.component';
import { FinesFpuToPublishComponent } from './fines-fpu-to-publish.component';

describe('FinesFpuToPublishComponent', () => {
  const businessUnits: readonly IFinesFpuBusinessUnit[] = [
    { business_unit_id: 12, business_unit_name: 'North', ticket_count: 3 },
    { business_unit_id: 34, business_unit_name: 'Central', ticket_count: 8 },
  ];
  let fixture: ComponentFixture<FinesFpuToPublishComponent>;
  let store: InstanceType<typeof FinesFpuStore>;
  let element: HTMLElement;

  const formComponent = (): FinesFpuToPublishFormComponent =>
    fixture.debugElement.query(By.directive(FinesFpuToPublishFormComponent)).componentInstance;
  const checkbox = (id: string): HTMLInputElement => element.querySelector<HTMLInputElement>(`#${id}`)!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesFpuToPublishComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(FinesFpuStore);
    store.setBusinessUnits(businessUnits);
    fixture = TestBed.createComponent(FinesFpuToPublishComponent);
    element = fixture.nativeElement as HTMLElement;
  });

  it('restores the stored selection into a pristine typed form and its checkbox controls', () => {
    store.setSelectedBusinessUnitIds([34]);
    fixture.detectChanges();

    expect(formComponent().form.getRawValue()).toEqual({ selectedBusinessUnitIds: [34] });
    expect(formComponent().form.pristine).toBe(true);
    expect(checkbox('fines-fpu-business-unit-12').checked).toBe(false);
    expect(checkbox('fines-fpu-business-unit-34').checked).toBe(true);
    expect(checkbox('fines-fpu-select-business-units').indeterminate).toBe(true);
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('writes checkbox selections through the dirty form to the store without enabling leave protection', () => {
    fixture.detectChanges();

    checkbox('fines-fpu-business-unit-12').click();
    fixture.detectChanges();

    expect(formComponent().form.controls.selectedBusinessUnitIds.value).toEqual([12]);
    expect(formComponent().form.controls.selectedBusinessUnitIds.dirty).toBe(true);
    expect(store.selectedBusinessUnitIds()).toEqual([12]);

    checkbox('fines-fpu-business-unit-34').click();
    fixture.detectChanges();

    expect(formComponent().form.controls.selectedBusinessUnitIds.value).toEqual([12, 34]);
    expect(store.selectedBusinessUnitIds()).toEqual([12, 34]);
    expect(checkbox('fines-fpu-select-business-units').checked).toBe(true);

    checkbox('fines-fpu-select-business-units').click();
    fixture.detectChanges();

    expect(formComponent().form.controls.selectedBusinessUnitIds.value).toEqual([]);
    expect(formComponent().form.valid).toBe(true);
    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(fixture.componentInstance.stateUnsavedChanges).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('refreshes rows and external selections without emitting another selection or form value change', () => {
    store.setSelectedBusinessUnitIds([12]);
    fixture.detectChanges();

    const form = formComponent();
    const selectionChanged = vi.spyOn(form.selectionChanged, 'emit');
    const formValueChanged = vi.fn();
    const subscription = form.form.valueChanges.subscribe(formValueChanged);

    store.setBusinessUnits([businessUnits[1], { business_unit_id: 56, business_unit_name: 'South', ticket_count: 4 }]);
    store.setSelectedBusinessUnitIds([56]);
    fixture.detectChanges();

    expect(element.querySelector('#fines-fpu-business-unit-12')).toBeNull();
    expect(checkbox('fines-fpu-business-unit-34').checked).toBe(false);
    expect(checkbox('fines-fpu-business-unit-56').checked).toBe(true);
    expect(form.form.getRawValue()).toEqual({ selectedBusinessUnitIds: [56] });
    expect(form.form.pristine).toBe(true);
    expect(selectionChanged).not.toHaveBeenCalled();
    expect(formValueChanged).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });

  it('restores selections after the tab content is destroyed and recreated', () => {
    fixture.detectChanges();
    checkbox('fines-fpu-business-unit-34').click();
    fixture.detectChanges();

    fixture.destroy();
    fixture = TestBed.createComponent(FinesFpuToPublishComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    expect(formComponent().form.getRawValue()).toEqual({ selectedBusinessUnitIds: [34] });
    expect(formComponent().form.pristine).toBe(true);
    expect(checkbox('fines-fpu-business-unit-34').checked).toBe(true);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('offers selection without a native submit action, publication button or selection validation', () => {
    fixture.detectChanges();

    const formSubmitted = vi.spyOn(formComponent()['formSubmit'], 'emit');
    checkbox('fines-fpu-business-unit-12').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(element.querySelector('form, button, [type="submit"]')).toBeNull();
    expect(formComponent().form.controls.selectedBusinessUnitIds.errors).toBeNull();
    expect(formComponent().form.valid).toBe(true);
    expect(formSubmitted).not.toHaveBeenCalled();
    expect(store.selectedBusinessUnitIds()).toEqual([]);
  });
});
