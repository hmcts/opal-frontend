import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-suspense-item-summary.mock';
import { of, Subject, throwError } from 'rxjs';
import { IOpalFinesSuspenseItemSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-suspense-item-summary.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK } from './mocks/fines-suspense-item-search-business-units.mock';
import { FinesSuspenseItemSearchFormComponent } from './fines-suspense-item-search-form/fines-suspense-item-search-form.component';
import { FinesSuspenseItemStore } from '../stores/fines-suspense-item.store';
import { FinesSuspenseItemSearchComponent } from './fines-suspense-item-search.component';

describe('FinesSuspenseItemSearchComponent', () => {
  let fixture: ComponentFixture<FinesSuspenseItemSearchComponent>;
  let component: FinesSuspenseItemSearchComponent;
  const getSuspenseItemSummary = vi.fn();
  const clearCache = vi.fn();
  let businessUnits: IOpalFinesBusinessUnitRefData;

  beforeEach(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getSuspenseItemSummary.mockReset().mockReturnValue(of(OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK));
    clearCache.mockReset();
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
      providers: [
        { provide: OpalFines, useValue: { getSuspenseItemSummary, clearCache } },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { businessUnits } } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesSuspenseItemSearchComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('requests a summary using the criteria submitted by the child', () => {
    fixture.detectChanges();
    const child: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;
    child.form.setValue({ fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(getSuspenseItemSummary).toHaveBeenCalledExactlyOnceWith(22, '1234');
  });
  it('does not call the service when submitted criteria have no BU', () => {
    fixture.detectChanges();
    component.handleFormSubmit({
      formData: { fsis_business_unit_id: null, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    });
    expect(getSuspenseItemSummary).not.toHaveBeenCalled();
    expect(clearCache).not.toHaveBeenCalled();
  });

  it('does not request a summary for an invalid form', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(getSuspenseItemSummary).not.toHaveBeenCalled();
  });

  it.each([
    ['001234', '1234'],
    ['0', '0'],
    ['0000', '0'],
    ['000123456789012345678901234567890', '123456789012345678901234567890'],
  ])('normalises %s to %s without numeric conversion', (entered, expected) => {
    fixture.detectChanges();
    component.handleFormSubmit({
      formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: entered },
      nestedFlow: false,
    });
    expect(getSuspenseItemSummary).toHaveBeenCalledExactlyOnceWith(22, expected);
  });

  it('requires confirmation after editing but allows navigation after a valid submission', () => {
    fixture.detectChanges();
    expect(component.canDeactivate()).toBe(true);
    const child = fixture.debugElement.query(By.directive(FinesSuspenseItemSearchFormComponent)).componentInstance;
    child.form.markAsDirty();
    child.form.setValue({ fsis_business_unit_id: 22, fsis_suspense_reference_number: '1234' });
    expect(component.canDeactivate()).toBe(false);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(component.canDeactivate()).toBe(true);
  });

  it('logs the response and clears both caches before each lookup', () => {
    fixture.detectChanges();
    const form = {
      formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    };
    component.handleFormSubmit(form);
    expect(clearCache).toHaveBeenCalledWith('suspenseItemSummaryCache$');
    expect(clearCache).toHaveBeenCalledWith('suspenseItemHistoryCache$');
    expect(console.log).toHaveBeenCalledWith('Suspense item summary:', OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK);
    component.handleFormSubmit(form);
    expect(getSuspenseItemSummary).toHaveBeenCalledTimes(2);
    expect(clearCache).toHaveBeenCalledTimes(4);
  });

  it('allows another submission while a request is pending', () => {
    const response = new Subject<IOpalFinesSuspenseItemSummary>();
    getSuspenseItemSummary.mockReturnValue(response);
    fixture.detectChanges();
    const form = {
      formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    };
    component.handleFormSubmit(form);
    component.handleFormSubmit(form);
    expect(getSuspenseItemSummary).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
    response.complete();
  });

  it('handles request failures without logging an error or a successful result', () => {
    const error = new Error('Request failed');
    getSuspenseItemSummary.mockReturnValue(throwError(() => error));
    fixture.detectChanges();
    component.handleFormSubmit({
      formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    });
    expect(console.error).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('unsubscribes from an unfinished lookup when the search component is destroyed', () => {
    const response = new Subject<IOpalFinesSuspenseItemSummary>();
    getSuspenseItemSummary.mockReturnValue(response);
    fixture.detectChanges();
    component.handleFormSubmit({
      formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    });
    fixture.destroy();
    response.next(OPAL_FINES_SUSPENSE_ITEM_SUMMARY_MOCK);
    expect(console.log).not.toHaveBeenCalled();
  });
});
