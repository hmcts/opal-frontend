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
});
