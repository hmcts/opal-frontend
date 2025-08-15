import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaSearchAccountFormComponent } from './fines-sa-search-account-form.component';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS } from './fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-controls.constant';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { FormControl, FormGroup } from '@angular/forms';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS } from './fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-controls.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS } from './fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-controls.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK } from './fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individuals-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../constants/fines-sa-search-account-state.constant';

describe('FinesSaSearchAccountFormComponent', () => {
  let component: FinesSaSearchAccountFormComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { fragment: of('individuals'), parent: 'search' } },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormComponent);
    component = fixture.componentInstance;

    mockFinesSaStore = TestBed.inject(FinesSaStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch to individual tab and set controls', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setControlsSpy = spyOn<any>(component, 'setControls').and.callThrough();
    component['switchTab']('individuals');
    expect(component['fieldErrors']).toBeDefined();
    expect(setControlsSpy).toHaveBeenCalledWith(FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS);
  });

  it('should switch to company tab and set controls', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setControlsSpy = spyOn<any>(component, 'setControls').and.callThrough();
    component['switchTab']('companies');
    expect(component['fieldErrors']).toBeDefined();
    expect(setControlsSpy).toHaveBeenCalledWith(FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS);
  });

  it('should switch to minor creditors tab and set controls', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setControlsSpy = spyOn<any>(component, 'setControls').and.callThrough();
    component['switchTab']('minorCreditors');
    expect(component['fieldErrors']).toBeDefined();
    expect(setControlsSpy).toHaveBeenCalledWith(FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS);
  });

  it('should call router with correct args when handleFormSubmit detects conflicting inputs (AC6)', async () => {
    const expectedValue = {
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_number: '12345678',
      fsa_search_account_reference_case_number: 'REF123',
      fsa_search_account_individuals_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
    };

    // Ensure the component is fully initialized
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();

    // Set the form values directly
    component.form.patchValue(expectedValue);

    // Mark nested groups as valid to ensure our validator runs
    const individualGroup = component.form.get('fsa_search_account_individuals_search_criteria') as FormGroup;
    if (individualGroup) {
      Object.keys(individualGroup.controls).forEach((key) => {
        individualGroup.get(key)?.clearValidators();
        individualGroup.get(key)?.updateValueAndValidity({ emitEvent: false });
      });
    }

    // Force form validation to run
    component.form.updateValueAndValidity();
    await fixture.whenStable();
    fixture.detectChanges();

    // The validator should detect conflicting inputs (multiple criteria populated)
    expect(component.form.errors?.['atLeastOneCriteriaRequired']).toBeTruthy();

    // Create a proper SubmitEvent
    const submitEvent = new SubmitEvent('submit', {
      bubbles: true,
      cancelable: true,
    });

    // Test the form submission
    component.handleFormSubmit(submitEvent);

    // Verify the store was updated with searchAccountTemporary
    expect(mockFinesSaStore.searchAccount()).toEqual(
      jasmine.objectContaining({
        fsa_search_account_number: '12345678',
        fsa_search_account_reference_case_number: 'REF123',
        fsa_search_account_individuals_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
      }),
    );

    // Verify navigation was called
    expect(routerSpy.navigate).toHaveBeenCalledWith(['problem'], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should clear all tab-specific form groups and should clear all error messages', () => {
    const tabKeys = [
      'fsa_search_account_individuals_search_criteria',
      'fsa_search_account_companies_search_criteria',
      'fsa_search_account_minor_creditors_search_criteria',
      'fsa_search_account_major_creditor_search_criteria',
    ];

    tabKeys.forEach((key) => {
      const group = component.form.get(key) as FormGroup;
      group.addControl('dummy', new FormControl('someValue'));
    });

    component['clearSearchForm']();

    tabKeys.forEach((key) => {
      const group = component.form.get(key) as FormGroup;
      expect(group.get('dummy')?.value).toBeNull();
    });

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should trigger setSearchAccountTemporary and navigate to filter business units', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'handleRoute');
    component.goToFilterBusinessUnits();
    expect(mockFinesSaStore.searchAccount()).toEqual(component.form.value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).handleRoute).toHaveBeenCalledWith('filter-business-units', false, undefined, {
      fragment: 'individuals',
    });
  });

  it('should default to "individuals" and update URL if no fragment is present', () => {
    component['activatedRoute'].fragment = of(null); // simulate no fragment

    component['setupFragmentListener']();

    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      relativeTo: component['activatedRoute'],
      fragment: 'individuals',
      replaceUrl: true,
    });
  });

  it('should return companies FormGroup when activeTab is companies', () => {
    component.finesSaStore.setActiveTab('companies');
    expect(component.searchCriteriaForm).toBe(
      component.form.get('fsa_search_account_companies_search_criteria') as FormGroup,
    );
  });

  it('should return minorCreditors FormGroup when activeTab is minorCreditors', () => {
    component.finesSaStore.setActiveTab('minorCreditors');
    expect(component.searchCriteriaForm).toBe(
      component.form.get('fsa_search_account_minor_creditors_search_criteria') as FormGroup,
    );
  });

  it('should return majorCreditors FormGroup when activeTab is majorCreditors', () => {
    component.finesSaStore.setActiveTab('majorCreditors');
    expect(component.searchCriteriaForm).toBe(
      component.form.get('fsa_search_account_major_creditor_search_criteria') as FormGroup,
    );
  });

  it('should return empty FormGroup for unknown tab', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component.finesSaStore, 'activeTab').and.returnValue('unknown' as any);
    expect(component.searchCriteriaForm).toEqual(jasmine.any(FormGroup));
    expect(Object.keys(component.searchCriteriaForm.controls)).toEqual([]);
  });

  it('should call setControls with empty controls for majorCreditors tab', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setControlsSpy = spyOn<any>(component, 'setControls');
    component['switchTab']('majorCreditors');
    expect(setControlsSpy).toHaveBeenCalledWith({});
  });

  it('should call setControls with empty controls for unknown tab', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setControlsSpy = spyOn<any>(component, 'setControls');
    component['switchTab']('unknown');
    expect(setControlsSpy).toHaveBeenCalledWith({});
  });

  it('should call super.handleFormSubmit when only account number is used', () => {
    const superSubmitSpy = spyOn(FinesSaSearchAccountFormComponent.prototype, 'handleFormSubmit').and.callThrough();

    // only one of the three
    component.form.get('fsa_search_account_number')?.setValue('12345678');
    component.form.get('fsa_search_account_reference_case_number')?.setValue('');

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(superSubmitSpy).toHaveBeenCalled();
  });

  it('should call super.handleFormSubmit when only account number is used', () => {
    const superSubmitSpy = spyOn(FinesSaSearchAccountFormComponent.prototype, 'handleFormSubmit').and.callThrough();

    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_individuals_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
    });

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(superSubmitSpy).toHaveBeenCalled();
  });
});
