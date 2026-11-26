import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
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
    getSuspenseItemSummary.mockReset();
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
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(FinesSuspenseItemSearchComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('supplies the available BUs and initial selection to the form', () => {
    TestBed.inject(FinesSuspenseItemStore).setSelectedBusinessUnit(22, 'Test business unit');
    fixture.detectChanges();
    const form: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;

    expect(form.autoCompleteItems).toEqual(FINES_SUSPENSE_ITEM_SEARCH_BUSINESS_UNITS_MOCK);
    expect(TestBed.inject(FinesSuspenseItemStore).selectedBusinessUnitName()).toBe('Test business unit');
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
    expect(store.selectedBusinessUnitName()).toBe('Avon and Somerset');
  });

  it('updates the ID and name together when the BU changes, and clears both when deselected', () => {
    fixture.detectChanges();
    const child: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;
    const store = TestBed.inject(FinesSuspenseItemStore);
    child.form.get('fsis_business_unit_id')!.setValue(11);
    expect(store.selectedBusinessUnitId()).toBe(11);
    expect(store.selectedBusinessUnitName()).toBe('Avon and Somerset');
    child.form.get('fsis_business_unit_id')!.setValue(22);
    expect(store.selectedBusinessUnitId()).toBe(22);
    expect(store.selectedBusinessUnitName()).toBe('Test business unit');
    child.form.get('fsis_business_unit_id')!.setValue(null);
    expect(store.selectedBusinessUnitId()).toBeNull();
    expect(store.selectedBusinessUnitName()).toBeNull();
  });

  it('refreshes the retained name from the resolved BU options', () => {
    const store = TestBed.inject(FinesSuspenseItemStore);
    store.setSelectedBusinessUnit(22, 'Old display name');
    fixture.detectChanges();
    expect(store.selectedBusinessUnitId()).toBe(22);
    expect(store.selectedBusinessUnitName()).toBe('Test business unit');
  });

  it('opens temporary results with the normalised reference and matching BU without requesting a summary', () => {
    fixture.detectChanges();
    const child: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;
    child.form.setValue({ fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(TestBed.inject(Router).navigate).toHaveBeenCalledExactlyOnceWith(
      ['/', 'fines', 'suspense-item', '1234', 'results'],
      { onSameUrlNavigation: 'reload' },
    );
    expect(TestBed.inject(FinesSuspenseItemStore).selectedBusinessUnitId()).toBe(22);
    expect(TestBed.inject(FinesSuspenseItemStore).selectedBusinessUnitName()).toBe('Test business unit');
    expect(getSuspenseItemSummary).not.toHaveBeenCalled();
    expect(clearCache).not.toHaveBeenCalled();
  });

  it('does not navigate when submitted criteria have no BU', () => {
    fixture.detectChanges();
    component.handleFormSubmit({
      formData: { fsis_business_unit_id: null, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    });
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
    expect(getSuspenseItemSummary).not.toHaveBeenCalled();
  });

  it('does not navigate for an invalid form', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
    expect(getSuspenseItemSummary).not.toHaveBeenCalled();
  });

  it.each(['001234', '0', '0000', '123456789012345678'])(
    'preserves the entered reference %s in the URL without numeric conversion',
    (reference) => {
      fixture.detectChanges();
      component.handleFormSubmit({
        formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: reference },
        nestedFlow: false,
      });
      expect(TestBed.inject(Router).navigate).toHaveBeenCalledExactlyOnceWith(
        ['/', 'fines', 'suspense-item', reference, 'results'],
        { onSameUrlNavigation: 'reload' },
      );
    },
  );

  it('requires confirmation after editing but allows navigation after a valid submission', () => {
    fixture.detectChanges();
    const store = TestBed.inject(FinesSuspenseItemStore);
    expect(store.unsavedChanges()).toBe(false);
    expect(component['canDeactivate']()).toBe(true);
    const child = fixture.debugElement.query(By.directive(FinesSuspenseItemSearchFormComponent)).componentInstance;
    child.form.markAsDirty();
    child.form.setValue({ fsis_business_unit_id: 22, fsis_suspense_reference_number: '1234' });
    expect(component['canDeactivate']()).toBe(false);
    expect(store.unsavedChanges()).toBe(true);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(component['canDeactivate']()).toBe(true);
    expect(store.unsavedChanges()).toBe(false);
  });

  it.each([
    ['fsis_business_unit_id', 11],
    ['fsis_suspense_reference_number', '5678'],
  ])('restores the leave warning after changing %s following a search', (field, value) => {
    fixture.detectChanges();
    const child: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
      By.directive(FinesSuspenseItemSearchFormComponent),
    ).componentInstance;
    child.form.markAsDirty();
    child.form.setValue({ fsis_business_unit_id: 22, fsis_suspense_reference_number: '1234' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(component['canDeactivate']()).toBe(true);

    child.form.get(field)!.setValue(value);

    expect(component['canDeactivate']()).toBe(false);
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(true);
  });

  it('does not restore a destroyed search form after a pending lookup fails', async () => {
    let failNavigation!: (error: Error) => void;
    vi.mocked(TestBed.inject(Router).navigate).mockReturnValue(
      new Promise<boolean>((_resolve, reject) => {
        failNavigation = reject;
      }),
    );
    fixture.detectChanges();
    component.handleFormSubmit({
      formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    });
    fixture.destroy();
    failNavigation(new Error('Lookup failed after leaving'));
    await Promise.resolve();
    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
  });

  it.each(['cancelled', 'rejected'])(
    'restores the parent warning after %s navigation and allows a retry',
    async (outcome) => {
      const navigate = vi.mocked(TestBed.inject(Router).navigate);
      if (outcome === 'cancelled') {
        navigate.mockResolvedValueOnce(false);
      } else {
        navigate.mockRejectedValueOnce(new Error('Lookup failed'));
      }
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('#fsis_suspense_reference_number');
      component.handleBusinessUnitChange(22);
      const child: FinesSuspenseItemSearchFormComponent = fixture.debugElement.query(
        By.directive(FinesSuspenseItemSearchFormComponent),
      ).componentInstance;
      child.form.controls['fsis_business_unit_id'].setValue(22);
      input.value = '001234';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const submit = () =>
        fixture.nativeElement
          .querySelector('form')
          .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      submit();
      await fixture.whenStable();

      expect(component['canDeactivate']()).toBe(false);
      expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(true);
      expect(input.value).toBe('1234');

      navigate.mockResolvedValueOnce(true);
      submit();
      expect(component['canDeactivate']()).toBe(true);
      await fixture.whenStable();
      expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
      expect(component['canDeactivate']()).toBe(true);
      expect(navigate).toHaveBeenCalledTimes(2);
    },
  );

  it('does not restore a warning after the search page has been destroyed', async () => {
    let finishNavigation!: (navigated: boolean) => void;
    vi.mocked(TestBed.inject(Router).navigate).mockReturnValueOnce(
      new Promise<boolean>((resolve) => {
        finishNavigation = resolve;
      }),
    );
    fixture.detectChanges();
    component.handleFormSubmit({
      formData: { fsis_business_unit_id: 22, fsis_suspense_reference_number: '001234' },
      nestedFlow: false,
    });
    fixture.destroy();
    finishNavigation(false);
    await Promise.resolve();

    expect(TestBed.inject(FinesSuspenseItemStore).unsavedChanges()).toBe(false);
  });

  it('keeps the warning while the dirty page remains and clears it on destruction', () => {
    fixture.detectChanges();
    const store = TestBed.inject(FinesSuspenseItemStore);
    component.handleUnsavedChanges(true);
    expect(component['canDeactivate']()).toBe(false);
    expect(store.unsavedChanges()).toBe(true);

    fixture.destroy();
    expect(store.unsavedChanges()).toBe(false);
  });
});
