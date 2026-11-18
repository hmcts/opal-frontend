import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFinesFpuBusinessUnit } from '../../interfaces/fines-fpu-business-unit.interface';
import { FinesFpuToPublishFormComponent } from './fines-fpu-to-publish-form.component';

describe('FinesFpuToPublishFormComponent', () => {
  const businessUnits: readonly IFinesFpuBusinessUnit[] = [
    { business_unit_id: 12, business_unit_name: 'North', ticket_count: 3 },
    { business_unit_id: 34, business_unit_name: 'Central', ticket_count: 8 },
  ];
  let fixture: ComponentFixture<FinesFpuToPublishFormComponent>;
  let component: FinesFpuToPublishFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesFpuToPublishFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesFpuToPublishFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('businessUnits', businessUnits);
  });

  it('copies restored selections into the form without mutating inputs or emitting user changes', () => {
    const selectedIds = Object.freeze([34]);
    const selectionChanged = vi.spyOn(component.selectionChanged, 'emit');
    const unsavedChanges = vi.spyOn(component['unsavedChanges'], 'emit');
    fixture.componentRef.setInput('selectedBusinessUnitIds', selectedIds);
    fixture.detectChanges();

    const control = component.form.controls.selectedBusinessUnitIds;
    const element = fixture.nativeElement as HTMLElement;

    expect(control.value).toEqual([34]);
    expect(control.value).not.toBe(selectedIds);
    expect(control.pristine).toBe(true);
    expect(element.querySelector<HTMLInputElement>('#fines-fpu-business-unit-34')?.checked).toBe(true);
    expect(selectionChanged).not.toHaveBeenCalled();
    expect(unsavedChanges).not.toHaveBeenCalled();
    expect(selectedIds).toEqual([34]);
  });

  it('marks the selection dirty and emits the value held by the form after checkbox interaction', () => {
    const selectionChanged = vi.spyOn(component.selectionChanged, 'emit');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('#fines-fpu-business-unit-12')!.click();
    fixture.detectChanges();

    expect(component.form.getRawValue()).toEqual({ selectedBusinessUnitIds: [12] });
    expect(component.form.dirty).toBe(true);
    expect(selectionChanged).toHaveBeenCalledExactlyOnceWith([12]);
    expect(element.querySelector<HTMLInputElement>('#fines-fpu-business-unit-12')?.checked).toBe(true);
  });

  it('stops the inherited form subscription when the component is destroyed', () => {
    const unsavedChanges = vi.spyOn(component['unsavedChanges'], 'emit');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLInputElement>('#fines-fpu-business-unit-12')!.click();
    fixture.detectChanges();

    expect(unsavedChanges).toHaveBeenCalledExactlyOnceWith(true);

    fixture.destroy();
    component.form.controls.selectedBusinessUnitIds.setValue([34]);

    expect(unsavedChanges).toHaveBeenCalledTimes(1);
  });
});
