import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FinesConStore } from './fines-con.store';
import { IFinesConSelectBuState } from '../select-business-unit/fines-con-select-bu/interfaces/fines-con-select-bu-state.interface';
import { IFinesConSearchAccountState } from '../consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { FINES_CON_SELECT_BU_FORM } from '../select-business-unit/fines-con-select-bu/constants/fines-con-select-bu-form.constant';
import { FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK } from '../select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-individual.mock';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from '../select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-company.mock';
import { FINES_CON_SEARCH_ACCOUNT_STATE } from '../consolidate-acc/fines-con-search-account/constants/fines-con-search-account-state.constant';

describe('FinesConStore', () => {
  let store: InstanceType<typeof FinesConStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FinesConStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(store.selectBuForm().formData.fcon_select_bu_business_unit_id).toBeNull();
    expect(store.selectBuForm().formData.fcon_select_bu_defendant_type).toBe('individual');
    expect(store.selectBuForm().nestedFlow).toBe(false);
  });

  it('should update business unit and defendant type', () => {
    const testData: IFinesConSelectBuState = FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK.formData;

    store.updateSelectBuForm(testData);

    expect(store.selectBuForm().formData.fcon_select_bu_business_unit_id).toBe(
      FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK.formData.fcon_select_bu_business_unit_id,
    );
    expect(store.selectBuForm().formData.fcon_select_bu_defendant_type).toBe('individual');

    // Verify form is complete with both business unit and defendant type set
    const formData = store.selectBuForm().formData;
    expect(!!formData.fcon_select_bu_business_unit_id && !!formData.fcon_select_bu_defendant_type).toBeTruthy();
  });

  it('should update entire select BU form with nested flow flag', () => {
    store.updateSelectBuFormComplete(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK);

    expect(store.selectBuForm().formData.fcon_select_bu_business_unit_id).toBe(
      FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData.fcon_select_bu_business_unit_id,
    );
    expect(store.selectBuForm().formData.fcon_select_bu_defendant_type).toBe('company');
    expect(store.selectBuForm().nestedFlow).toBe(false);

    // Verify form is complete with both business unit and defendant type set
    const formData = store.selectBuForm().formData;
    expect(!!formData.fcon_select_bu_business_unit_id && !!formData.fcon_select_bu_defendant_type).toBeTruthy();
  });

  it('should reset entire consolidation state', () => {
    store.updateSelectBuForm(FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK.formData);
    store.resetConsolidationState();

    expect(store.selectBuForm().formData.fcon_select_bu_business_unit_id).toBe(
      FINES_CON_SELECT_BU_FORM.formData.fcon_select_bu_business_unit_id,
    );
    expect(store.selectBuForm().formData.fcon_select_bu_defendant_type).toBe(
      FINES_CON_SELECT_BU_FORM.formData.fcon_select_bu_defendant_type,
    );
    expect(store.selectBuForm().nestedFlow).toBe(FINES_CON_SELECT_BU_FORM.nestedFlow);
  });

  it('should compute business unit id correctly', () => {
    store.updateSelectBuForm(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);

    expect(store.getBusinessUnitId()).toBe(
      FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData.fcon_select_bu_business_unit_id,
    );
  });

  it('should compute defendant type correctly', () => {
    store.updateSelectBuForm(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);

    expect(store.getDefendantType()).toBe('company');
  });

  it('should have unsavedChanges initialized to false', () => {
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should set unsavedChanges to true', () => {
    store.setUnsavedChanges(true);

    expect(store.unsavedChanges()).toBe(true);
  });

  it('should set unsavedChanges to false', () => {
    store.setUnsavedChanges(true);
    store.setUnsavedChanges(false);

    expect(store.unsavedChanges()).toBe(false);
  });

  it('should reset unsavedChanges to false on resetConsolidationState', () => {
    store.setUnsavedChanges(true);
    store.resetConsolidationState();

    expect(store.unsavedChanges()).toBe(false);
  });

  it('should compute business unit name correctly', () => {
    store.updateSelectBuForm(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);

    expect(store.getBusinessUnitName()).toBe(
      FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData.fcon_select_bu_business_unit_name,
    );
  });

  it('should update search account form temporarily', () => {
    const testData: IFinesConSearchAccountState = {
      ...FINES_CON_SEARCH_ACCOUNT_STATE,
      fcon_search_account_number: '12345678',
      fcon_search_account_individuals_last_name: 'Smith',
    };

    store.updateSearchAccountFormTemporary(testData);

    expect(store.searchAccountForm().fcon_search_account_number).toBe('12345678');
    expect(store.searchAccountForm().fcon_search_account_individuals_last_name).toBe('Smith');
  });

  it('should reset search account form to initial state', () => {
    const testData: IFinesConSearchAccountState = {
      ...FINES_CON_SEARCH_ACCOUNT_STATE,
      fcon_search_account_number: '12345678',
      fcon_search_account_individuals_last_name: 'Smith',
    };

    store.updateSearchAccountFormTemporary(testData);
    expect(store.searchAccountForm().fcon_search_account_number).toBe('12345678');

    store.resetSearchAccountForm();

    expect(store.searchAccountForm()).toEqual(FINES_CON_SEARCH_ACCOUNT_STATE);
    expect(store.searchAccountForm().fcon_search_account_number).toBeNull();
    expect(store.searchAccountForm().fcon_search_account_individuals_last_name).toBeNull();
  });

  it('should preserve search account form data when updating', () => {
    const initialData: IFinesConSearchAccountState = {
      ...FINES_CON_SEARCH_ACCOUNT_STATE,
      fcon_search_account_number: '12345678',
    };

    store.updateSearchAccountFormTemporary(initialData);

    const updatedData: IFinesConSearchAccountState = {
      ...store.searchAccountForm(),
      fcon_search_account_individuals_last_name: 'Smith',
    };

    store.updateSearchAccountFormTemporary(updatedData);

    expect(store.searchAccountForm().fcon_search_account_number).toBe('12345678');
    expect(store.searchAccountForm().fcon_search_account_individuals_last_name).toBe('Smith');
  });
});
