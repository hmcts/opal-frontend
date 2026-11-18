import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MojMultiSelectBodyDirective } from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { beforeEach, describe, expect, it } from 'vitest';
import { IFinesFpuBusinessUnit } from '../../../interfaces/fines-fpu-business-unit.interface';
import { FinesFpuToPublishTableWrapperComponent } from './fines-fpu-to-publish-table-wrapper.component';

const BUSINESS_UNITS: readonly IFinesFpuBusinessUnit[] = Object.freeze([
  { business_unit_id: 12, business_unit_name: 'North', ticket_count: 3 },
  { business_unit_id: 34, business_unit_name: 'Central', ticket_count: 8 },
  { business_unit_id: 56, business_unit_name: 'South', ticket_count: 0 },
]);

@Component({
  imports: [FinesFpuToPublishTableWrapperComponent],
  template: `
    <app-fines-fpu-to-publish-table-wrapper
      [businessUnits]="businessUnits()"
      [selectedBusinessUnitIds]="selectedBusinessUnitIds()"
      (selectedBusinessUnitIdsChange)="updateSelection($event)"
    />
  `,
})
class TestHostComponent {
  public readonly businessUnits = signal<readonly IFinesFpuBusinessUnit[]>(BUSINESS_UNITS);
  public readonly selectedBusinessUnitIds = signal<readonly number[]>([]);
  public readonly emittedSelections: number[][] = [];

  public updateSelection(selectedIds: number[]): void {
    this.emittedSelections.push(selectedIds);
    this.selectedBusinessUnitIds.set(selectedIds);
  }
}

describe('FinesFpuToPublishTableWrapperComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let element: HTMLElement;

  const checkbox = (id: string): HTMLInputElement => element.querySelector<HTMLInputElement>(`#${id}`)!;
  const selectAll = (): HTMLInputElement => checkbox('fines-fpu-select-business-units');
  const selectBusinessUnit = (businessUnitId: number): HTMLInputElement =>
    checkbox(`fines-fpu-business-unit-${businessUnitId}`);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders plain business unit names and numeric ticket counts in the supplied order', () => {
    fixture.detectChanges();

    const headers = Array.from(element.querySelectorAll('th'), (header) => header.textContent?.trim());
    const names = Array.from(element.querySelectorAll('[id^="fines-fpu-business-unit-name-"]'), (name) =>
      name.textContent?.trim(),
    );
    const counts = Array.from(element.querySelectorAll('[id^="fines-fpu-business-unit-ticket-count-"]'));

    expect(headers).toEqual(['Select', 'Business unit', 'Tickets']);
    expect(names).toEqual(['North', 'Central', 'South']);
    expect(counts.map((count) => count.textContent?.trim())).toEqual(['3', '8', '0']);
    expect(counts.every((count) => count.classList.contains('govuk-table__cell--numeric'))).toBe(true);
    expect(element.querySelector('caption')?.textContent).toContain('Tickets to publish by business unit');
    expect(element.querySelector('a, button')).toBeNull();
    expect(selectAll().getAttribute('aria-label')).toBe('Select all business units');
    expect(selectBusinessUnit(12).getAttribute('aria-label')).toBe('Select North');
    expect(selectBusinessUnit(34).getAttribute('aria-label')).toBe('Select Central');
    expect(selectBusinessUnit(56).getAttribute('aria-label')).toBe('Select South');
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(false);
    expect(element.querySelectorAll('.govuk-table__row--selected')).toHaveLength(0);
  });

  it('emits an individual selection and shows the partial header and selected row', () => {
    fixture.detectChanges();

    selectBusinessUnit(34).click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[34]]);
    expect(selectBusinessUnit(34).checked).toBe(true);
    expect(selectBusinessUnit(12).checked).toBe(false);
    expect(selectBusinessUnit(56).checked).toBe(false);
    expect(selectBusinessUnit(34).closest('tr')?.classList).toContain('govuk-table__row--selected');
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(true);
  });

  it('selects every displayed business unit and then clears all using the header checkbox', () => {
    fixture.detectChanges();

    selectAll().click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[12, 34, 56]]);
    expect(selectAll().checked).toBe(true);
    expect(selectAll().indeterminate).toBe(false);
    expect([12, 34, 56].every((id) => selectBusinessUnit(id).checked)).toBe(true);
    expect(element.querySelectorAll('.govuk-table__row--selected')).toHaveLength(3);

    selectAll().click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[12, 34, 56], []]);
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(false);
    expect([12, 34, 56].every((id) => !selectBusinessUnit(id).checked)).toBe(true);
    expect(element.querySelectorAll('.govuk-table__row--selected')).toHaveLength(0);
  });

  it('selects all displayed rows when the header is partially selected', () => {
    host.selectedBusinessUnitIds.set([34]);
    fixture.detectChanges();

    expect(selectAll().indeterminate).toBe(true);

    selectAll().click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[12, 34, 56]]);
    expect(selectAll().checked).toBe(true);
    expect(selectAll().indeterminate).toBe(false);
  });

  it('deselects one row from an existing selection without changing the input array', () => {
    const selectedIds = Object.freeze([12, 34, 56]);
    host.selectedBusinessUnitIds.set(selectedIds);
    fixture.detectChanges();

    selectBusinessUnit(34).click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[12, 56]]);
    expect(selectedIds).toEqual([12, 34, 56]);
    expect(host.emittedSelections[0]).not.toBe(selectedIds);
    expect(selectBusinessUnit(34).checked).toBe(false);
    expect(selectBusinessUnit(34).closest('tr')?.classList).not.toContain('govuk-table__row--selected');
    expect(selectBusinessUnit(12).checked).toBe(true);
    expect(selectBusinessUnit(56).checked).toBe(true);
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(true);
  });

  it('drops stale IDs and emits a unique selection in table order when a row changes', () => {
    const selectedIds = Object.freeze([999, 56, 56]);
    host.selectedBusinessUnitIds.set(selectedIds);
    fixture.detectChanges();

    selectBusinessUnit(12).click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[12, 56]]);
    expect(selectedIds).toEqual([999, 56, 56]);
    expect(selectBusinessUnit(12).checked).toBe(true);
    expect(selectBusinessUnit(56).checked).toBe(true);
  });

  it('ignores non-numeric row identifiers without changing the current business unit selection', () => {
    host.selectedBusinessUnitIds.set([34]);
    fixture.detectChanges();
    const row = fixture.debugElement.query(By.directive(MojMultiSelectBodyDirective));

    row.injector.get(MojMultiSelectBodyDirective).selectionChange.emit({ rowId: '12', checked: true });
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([]);
    expect(host.selectedBusinessUnitIds()).toEqual([34]);
    expect(selectBusinessUnit(12).checked).toBe(false);
    expect(selectBusinessUnit(34).checked).toBe(true);
    expect(selectAll().indeterminate).toBe(true);
  });

  it('selects only displayed rows when incoming selection contains stale IDs', () => {
    const selectedIds = Object.freeze([999]);
    host.selectedBusinessUnitIds.set(selectedIds);
    host.businessUnits.set(BUSINESS_UNITS.slice(0, 2));
    fixture.detectChanges();

    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(false);

    selectAll().click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[12, 34]]);
    expect(selectedIds).toEqual([999]);
    expect(element.querySelector('#fines-fpu-business-unit-56')).toBeNull();
  });

  it('updates existing and new checkbox controls when the parent replaces rows and selection', () => {
    host.businessUnits.set(BUSINESS_UNITS.slice(0, 2));
    host.selectedBusinessUnitIds.set([12]);
    fixture.detectChanges();

    expect(selectBusinessUnit(12).checked).toBe(true);
    expect(selectBusinessUnit(34).checked).toBe(false);

    host.businessUnits.set(BUSINESS_UNITS.slice(1));
    host.selectedBusinessUnitIds.set([34, 999]);
    fixture.detectChanges();

    expect(element.querySelector('#fines-fpu-business-unit-12')).toBeNull();
    expect(selectBusinessUnit(34).checked).toBe(true);
    expect(selectBusinessUnit(56).checked).toBe(false);
    expect(selectAll().checked).toBe(false);
    expect(selectAll().indeterminate).toBe(true);

    host.selectedBusinessUnitIds.set([56, 34]);
    fixture.detectChanges();

    expect(selectBusinessUnit(34).checked).toBe(true);
    expect(selectBusinessUnit(56).checked).toBe(true);
    expect(selectAll().checked).toBe(true);
    expect(selectAll().indeterminate).toBe(false);
    expect(host.emittedSelections).toEqual([]);

    selectBusinessUnit(56).click();
    fixture.detectChanges();

    expect(host.emittedSelections).toEqual([[34]]);
    expect(selectAll().indeterminate).toBe(true);
  });

  it('renders an empty table without a select-all checkbox when no business units are supplied', () => {
    host.businessUnits.set([]);
    host.selectedBusinessUnitIds.set([999]);
    fixture.detectChanges();

    expect(element.querySelectorAll('tbody tr')).toHaveLength(0);
    expect(element.querySelector('input[type="checkbox"]')).toBeNull();
    expect(host.emittedSelections).toEqual([]);
  });
});
