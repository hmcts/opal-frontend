import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { finesConFlowStateGuard } from './fines-con-flow-state.guard';
import { FinesConStore } from '../stores/fines-con.store';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_CON_ROUTING_PATHS } from '../routing/constants/fines-con-routing-paths.constant';
import { FinesConStoreType } from '../stores/types/fines-con-store.type';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { runFinesConFlowStateGuardWithContext } from './helpers/run-fines-con-flow-state-guard-with-context';
import { FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK } from '../select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-individual.mock';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from '../select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-company.mock';
import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { of } from 'rxjs';

describe('finesConFlowStateGuard', () => {
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
    createUrlTree: ReturnType<typeof vi.fn>;
    parseUrl: ReturnType<typeof vi.fn>;
  };
  let mockFinesConStore: InstanceType<FinesConStoreType>;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.con.root}/${FINES_CON_ROUTING_PATHS.children.consolidateAcc}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.con.root}/${FINES_CON_ROUTING_PATHS.children.selectBusinessUnit}`;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn(),
      createUrlTree: vi.fn(),
      parseUrl: vi.fn().mockImplementation((url: string) => {
        const urlTree = new UrlTree();
        const urlSegment = new UrlSegment(url, {});
        urlTree.root = new UrlSegmentGroup([urlSegment], {});
        return urlTree;
      }),
    };

    TestBed.configureTestingModule({
      providers: [FinesConStore, { provide: Router, useValue: mockRouter }],
    });

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());

    mockFinesConStore = TestBed.inject(FinesConStore);
  });

  it('should return true if stateChanges is true and BU ID and defendant type are present (individual)', async () => {
    mockFinesConStore.updateSelectBuFormComplete(FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK);
    mockFinesConStore.setStateChanges(true);

    const result = await runFinesConFlowStateGuardWithContext(getGuardWithDummyUrl(finesConFlowStateGuard, urlPath));
    expect(result).toBe(true);
  });

  it('should return true if stateChanges is true and BU ID and defendant type are present (company)', async () => {
    mockFinesConStore.updateSelectBuFormComplete(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK);
    mockFinesConStore.setStateChanges(true);

    const result = await runFinesConFlowStateGuardWithContext(getGuardWithDummyUrl(finesConFlowStateGuard, urlPath));
    expect(result).toBe(true);
  });

  it('should return false and redirect if business unit ID is missing', async () => {
    mockFinesConStore.updateSelectBuForm({
      fcon_select_bu_business_unit_id: null,
      fcon_select_bu_defendant_type: 'individual',
    });

    const result = await runFinesConFlowStateGuardWithContext(getGuardWithDummyUrl(finesConFlowStateGuard, urlPath));
    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should return false and redirect if defendant type is missing', async () => {
    mockFinesConStore.updateSelectBuForm({
      fcon_select_bu_business_unit_id: 123,
      fcon_select_bu_defendant_type: null,
    });

    const result = await runFinesConFlowStateGuardWithContext(getGuardWithDummyUrl(finesConFlowStateGuard, urlPath));
    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should return false and redirect if stateChanges is false', async () => {
    mockFinesConStore.updateSelectBuFormComplete(FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK);
    mockFinesConStore.setStateChanges(false);

    const result = await runFinesConFlowStateGuardWithContext(getGuardWithDummyUrl(finesConFlowStateGuard, urlPath));
    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should return false and redirect if both business unit ID and defendant type are missing', async () => {
    mockFinesConStore.updateSelectBuForm({
      fcon_select_bu_business_unit_id: null,
      fcon_select_bu_defendant_type: null,
    });

    const result = await runFinesConFlowStateGuardWithContext(getGuardWithDummyUrl(finesConFlowStateGuard, urlPath));
    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should return false and redirect even with stateChanges true if BU ID is missing', async () => {
    mockFinesConStore.updateSelectBuForm({
      fcon_select_bu_business_unit_id: null,
      fcon_select_bu_defendant_type: 'individual',
    });

    const result = await runFinesConFlowStateGuardWithContext(getGuardWithDummyUrl(finesConFlowStateGuard, urlPath));
    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should handle observable result correctly', async () => {
    const mockResult = true;
    const guardReturningObservable = () => of(mockResult);

    const result = await runFinesConFlowStateGuardWithContext(guardReturningObservable);

    expect(result).toBe(mockResult);
  });
});
