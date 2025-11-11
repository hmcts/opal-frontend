import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinesSaSearchAccountFormComponent } from './fines-sa-search-account-form.component';
import { FinesSaStore } from '../../../stores/fines-sa.store';
import { FinesSaStoreType } from '../../../stores/types/fines-sa.type';
import { FormControl, FormGroup } from '@angular/forms';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK } from './fines-sa-search-account-form-individuals/mocks/fines-sa-search-account-form-individuals-state.mock';
import { FINES_SA_SEARCH_ACCOUNT_STATE } from '../constants/fines-sa-search-account-state.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-pretty-name.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';

describe('FinesSaSearchAccountFormComponent', () => {
  let component: FinesSaSearchAccountFormComponent;
  let fixture: ComponentFixture<FinesSaSearchAccountFormComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockFinesSaStore: FinesSaStoreType;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockOpalFinesService = {
      getMajorCreditorPrettyName: jasmine
        .createSpy('getMajorCreditorPrettyName')
        .and.returnValue(OPAL_FINES_MAJOR_CREDITOR_PRETTY_NAME_MOCK),
    };

    await TestBed.configureTestingModule({
      imports: [FinesSaSearchAccountFormComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('individuals'),
            parent: 'search',
          },
        },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaSearchAccountFormComponent);
    component = fixture.componentInstance;

    component.businessUnitRefData = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData;
    component.majorCreditorsRefData = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.refData;
    mockFinesSaStore = TestBed.inject(FinesSaStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router with correct args when handleFormSubmit detects conflicting inputs (AC6)', () => {
    const expectedValue = {
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_number: '12345678',
      fsa_search_account_reference_case_number: 'REF123',
      fsa_search_account_individuals_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE_MOCK,
    };

    // Component is already initialised in beforeEach via fixture.detectChanges()
    // Patch multiple criteria to trigger the AC6 conflict error
    component.form.patchValue(expectedValue);

    // Force form validation to run
    component.form.updateValueAndValidity({ emitEvent: false });
    fixture.detectChanges();

    // The validator should detect conflicting inputs (multiple criteria populated)
    expect(component.form.errors?.['atLeastOneCriteriaRequired']).toBeTrue();

    // Submit
    const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true });
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
      'fsa_search_account_major_creditors_search_criteria',
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
      component.form.get('fsa_search_account_major_creditors_search_criteria') as FormGroup,
    );
  });

  it('should return empty FormGroup for unknown tab', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component.finesSaStore, 'activeTab').and.returnValue('unknown' as any);
    expect(component.searchCriteriaForm).toEqual(jasmine.any(FormGroup));
    expect(Object.keys(component.searchCriteriaForm.controls)).toEqual([]);
  });

  it('should select the majorCreditors FormGroup when switching to that tab', () => {
    component['switchTab']('majorCreditors');
    expect(component.searchCriteriaForm).toBe(
      component.form.get('fsa_search_account_major_creditors_search_criteria') as FormGroup,
    );
  });

  it('should return an empty FormGroup when switching to an unknown tab', () => {
    component['switchTab']('unknown');
    expect(component.searchCriteriaForm instanceof FormGroup).toBeTrue();
    expect(Object.keys(component.searchCriteriaForm.controls)).toEqual([]);
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

  it('businessUnitText should return "All business units" when all ids are selected', () => {
    const allIds = component.businessUnitRefData.map((bu) => bu.business_unit_id);

    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_business_unit_ids: allIds,
    });

    expect(component.businessUnitText).toBe('All business units');
  });

  it('businessUnitText should return a comma-separated list of selected business unit names when a subset is selected', () => {
    const allIds = component.businessUnitRefData.map((bu) => bu.business_unit_id);
    const subset = allIds.slice(0, 2);

    mockFinesSaStore.setSearchAccount({
      ...FINES_SA_SEARCH_ACCOUNT_STATE,
      fsa_search_account_business_unit_ids: subset,
    });

    const expected = component.businessUnitRefData
      .filter((bu) => subset.includes(bu.business_unit_id))
      .map((bu) => bu.business_unit_name)
      .join(', ');

    expect(component.businessUnitText).toBe(expected);
  });

  describe('updateFormErrorSummaryMessages', () => {
    it('should update formErrorSummaryMessage with provided messages', () => {
      const mockMessages = [
        { fieldId: 'fsa_search_account_number', message: 'Invalid account number' },
        { fieldId: 'fsa_search_account_reference_case_number', message: 'Invalid reference' },
      ];
      component.updateFormErrorSummaryMessages(mockMessages);
      expect(component.formErrorSummaryMessage).toBe(mockMessages);
    });

    it('should set formErrorSummaryMessage to an empty array if given an empty array', () => {
      component.updateFormErrorSummaryMessages([]);
      expect(component.formErrorSummaryMessage).toEqual([]);
    });
  });
});
