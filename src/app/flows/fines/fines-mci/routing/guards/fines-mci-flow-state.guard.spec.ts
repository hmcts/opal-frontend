import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FINES_MCI_ROUTING_PATHS } from '../constants/fines-mci-routing-paths.constant';
import { finesMciFlowStateGuard } from './fines-mci-flow-state.guard';

describe('finesMciFlowStateGuard', () => {
  const selectionUrl = `${FINES_ROUTING_PATHS.root}/${FINES_MCI_ROUTING_PATHS.root}/${FINES_MCI_ROUTING_PATHS.children.create}/${FINES_MCI_ROUTING_PATHS.children.till}/${FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit}`;
  const tillDetailsUrl = `${FINES_ROUTING_PATHS.root}/${FINES_MCI_ROUTING_PATHS.root}/${FINES_MCI_ROUTING_PATHS.children.create}/${FINES_MCI_ROUTING_PATHS.children.till}/${FINES_MCI_ROUTING_PATHS.children.details}`;
  const mockRouter = { createUrlTree: vi.fn().mockReturnValue(new UrlTree()), parseUrl: vi.fn() };
  let store: InstanceType<typeof FinesMciStore>;

  beforeEach(() => {
    mockRouter.createUrlTree.mockClear();
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: mockRouter }] });
    store = TestBed.inject(FinesMciStore);
    store.reset();
  });

  it('allows navigation when a business unit is selected', () => {
    store.setBusinessUnit(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);

    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesMciFlowStateGuard, tillDetailsUrl)(),
    );

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to business unit selection when no business unit is selected', () => {
    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesMciFlowStateGuard, tillDetailsUrl)(),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([selectionUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });
});
