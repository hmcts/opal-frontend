import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaSearchAccountFormComponent } from './fines-sa-search-account-form.component';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaService } from '../../../services/fines-sa.service';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS } from './fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-controls.constant';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { FormControl, FormGroup } from '@angular/forms';
import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS } from './fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-controls.constant';
import { FinesSaSearchAccountFormMinorCreditorsComponent } from './fines-sa-search-account-form-minor-creditors/fines-sa-search-account-form-minor-creditors.component';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS } from './fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-controls.constant';

describe('FinesSaSearchAccountFormComponent', () => {
  let component: FinesSaSearchAccountFormComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockFinesSaStore: FinesSaStoreType;
  let mockFinesSaService: jasmine.SpyObj<FinesSaService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockFinesSaService = jasmine.createSpyObj(FinesSaService, ['hasAnySearchCriteriaPopulated']);

    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { fragment: of('individuals'), parent: 'search' } },
        { provide: Router, useValue: routerSpy },
        { provide: FinesSaService, useValue: mockFinesSaService },
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

  it('should call router with correct args when handleFormSubmit detects conflicting inputs (AC6)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'rePopulateForm');
    component.form.get('fsa_search_account_number')?.setValue('12345678');
    component.form.get('fsa_search_account_reference_case_number')?.setValue('REF123');
    component['finesSaService'].hasAnySearchCriteriaPopulated = () => true;

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(mockFinesSaStore.searchAccount()).toEqual(component.form.value);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['problem'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should clear all tab-specific form groups and should clear all error messages', () => {
    const tabKeys = [
      'fsa_search_account_individual_search_criteria',
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

  it('should call applyMinorCreditorValidation when active tab is minorCreditors', () => {
    component.finesSaStore.setActiveTab('minorCreditors');
    component.minorCreditorsComponent = jasmine.createSpyObj('FinesSaSearchAccountFormMinorCreditorsComponent', [
      'applyMinorCreditorValidation',
    ]) as FinesSaSearchAccountFormMinorCreditorsComponent;

    component['validateTabSpecificFields']();

    expect(component.minorCreditorsComponent.applyMinorCreditorValidation).toHaveBeenCalled();
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
    mockFinesSaService.hasAnySearchCriteriaPopulated.and.returnValue(false);

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(superSubmitSpy).toHaveBeenCalled();
  });
});
