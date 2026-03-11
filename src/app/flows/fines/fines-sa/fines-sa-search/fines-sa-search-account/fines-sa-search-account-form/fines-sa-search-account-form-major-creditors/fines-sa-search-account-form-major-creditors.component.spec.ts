import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesSaSearchAccountFormMajorCreditorsComponent } from './fines-sa-search-account-form-major-creditors.component';
import { FinesSaStoreType } from '../../../../stores/types/fines-sa.type';
import { FinesSaStore } from '../../../../stores/fines-sa.store';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OPAL_FINES_MAJOR_CREDITOR_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-autocomplete-items.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesSaSearchAccountFormMajorCreditorsComponent', () => {
  let component: FinesSaSearchAccountFormMajorCreditorsComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormMajorCreditorsComponent>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormMajorCreditorsComponent, ReactiveFormsModule],
      providers: [{ provide: ActivatedRoute, useValue: { fragment: of('majorCreditors'), parent: 'search' } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormMajorCreditorsComponent);
    component = fixture.componentInstance;

    // Provide an empty parent FormGroup; the component under test will add its own controls in ngOnInit
    component.form = new FormGroup({});
    // Provide the required inputs expected by the abstract base
    component.formControlErrorMessages = {};
    component.majorCreditorsAutoCompleteItems = OPAL_FINES_MAJOR_CREDITOR_AUTOCOMPLETE_ITEMS_MOCK;

    mockFinesSaStore = TestBed.inject(FinesSaStore);
    mockFinesSaStore.setBusinessUnitIds([1]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce filter link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesSaSearchAccountFormMajorCreditorsComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesSaSearchAccountFormMajorCreditorsComponent as any).ɵcmp?.template?.toString() as string | undefined) ??
      '';
    const filterLinkConsts = templateConsts.filter(
      (entry) => entry.includes('govuk-link') && entry.includes('href') && entry.includes('click'),
    );

    expect(filterLinkConsts.length).toBeGreaterThanOrEqual(1);
    filterLinkConsts.forEach((entry) => {
      expect(entry).toContain('govuk-link--no-visited-state');
      expect(entry).toContain('href');
      expect(entry).toContain('');
      expect(entry).not.toContain('tabindex');
    });
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should initialize the form on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'setupMajorCreditorForm');
    component.ngOnInit();
    expect(component['setupMajorCreditorForm']).toHaveBeenCalled();
  });

  it('should build major creditor form controls', () => {
    const formGroup = component['buildMajorCreditorFormControls']();
    expect(formGroup.contains('fsa_search_account_major_creditors_major_creditor_id')).toBe(true);
    expect(formGroup.get('fsa_search_account_major_creditors_major_creditor_id')?.validator).toBeTruthy();
  });

  it('should set up the major creditor form', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'addControlsToNestedFormGroup');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(mockFinesSaStore, 'resetDefendantSearchCriteria');

    component['setupMajorCreditorForm']();

    expect(component['addControlsToNestedFormGroup']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(null);
    expect(mockFinesSaStore.resetDefendantSearchCriteria).toHaveBeenCalled();
  });

  it('should prevent default and emit when onFilterBusinessUnitClick is called', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.filterBusinessUnitClicked, 'emit');

    component.onFilterBusinessUnitClick(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should pass $event to onFilterBusinessUnitClick from filter link click', () => {
    mockFinesSaStore.setBusinessUnitIds([1, 2]);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Filter by business unit link not found');

    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const handlerSpy = vi.spyOn(component, 'onFilterBusinessUnitClick');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.filterBusinessUnitClicked, 'emit');

    link.dispatchEvent(event);

    expect(handlerSpy).toHaveBeenCalledWith(event);
    expect(event.defaultPrevented).toBe(true);
    expect(emitSpy).toHaveBeenCalled();
  });
});
