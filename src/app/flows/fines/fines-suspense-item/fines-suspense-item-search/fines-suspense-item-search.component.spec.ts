import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK } from './mocks/fines-suspense-item-search-business-units.mock';
import { FinesSuspenseItemSearchFormComponent } from './fines-suspense-item-search-form/fines-suspense-item-search-form.component';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { FinesSuspenseItemSearchComponent } from './fines-suspense-item-search.component';

describe('FinesSuspenseItemSearchComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemSearchComponent>;
  let component: FinesSuspenseItemSearchComponent;
  let businessUnits: IOpalFinesBusinessUnitRefData;

  beforeEach(async () => {
    businessUnits = {
      count: 2,
      refData: FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK.map((item) => ({
        ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
        business_unit_id: Number(item.value),
        business_unit_name: item.name,
      })),
    };
    await TestBed.configureTestingModule({
      imports: [FinesSuspenseItemSearchComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: { snapshot: { data: { businessUnits } } } }],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemSearchComponent);
    component = fixture.componentInstance;
  });

  it('supplies the available BUs and initial selection to the form', () => {
    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnitId(22);
    fixture.detectChanges();
    const form: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;

    expect(form.autoCompleteItems).toEqual(FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK);
    expect(form.initialBusinessUnitId).toBe(22);
    expect(form.form.get('fsis_business_unit_id')?.value).toBe(22);
  });

  it('shows no fabricated choices when the resolved list is empty', () => {
    businessUnits.refData = [];
    businessUnits.count = 0;
    fixture.detectChanges();
    const form: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;

    expect(form.autoCompleteItems).toEqual([]);
    expect(form.form.get('fsis_business_unit_id')?.value).toBeNull();
  });

  it('returns to Finance when the child Cancel link is clicked', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;

    page.querySelector<HTMLAnchorElement>('opal-lib-govuk-cancel-link a')!.click();

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/', 'fines', 'dashboard', 'finance']);
  });
  it('retains a changed BU across page recreation, with a blank reference', () => {
    fixture.detectChanges();
    const child = fixture.debugElement.query(By.directive(FinesSuspenseItemSearchFormComponent)).componentInstance;
    child.form.get('fsis_business_unit_id').setValue(22);
    child.form.get('fsis_suspense_reference_number').setValue('001234');
    fixture.destroy();

    const returnedPage = TestBed.createComponent(FinesSuspenseItemSearchComponent);
    returnedPage.detectChanges();
    const returnedForm = returnedPage.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;
    expect(returnedForm.form.get('fsis_business_unit_id').value).toBe(22);
    expect(returnedForm.form.get('fsis_suspense_reference_number').value).toBe('');
    returnedPage.destroy();
  });

  it('automatically selects the sole available BU when there is no saved selection', () => {
    const store = TestBed.inject(FinesSuspenseItemStore);
    businessUnits.refData = [businessUnits.refData[0]];
    businessUnits.count = 1;
    fixture.detectChanges();
    expect(component.initialBusinessUnitId).toBe(11);
    expect(store.selectedBusinessUnitId()).toBe(11);
  });

  it('retains the latest submitted criteria from the child', () => {
    fixture.detectChanges();
    const child: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;
    child.form.setValue({ fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(TestBed.inject(FinesSuspenseItemStore).submittedCriteria()).toEqual({
      fsis_business_unit_id: 22,
      fsis_suspense_reference_number: '001234',
    });
  });
});
