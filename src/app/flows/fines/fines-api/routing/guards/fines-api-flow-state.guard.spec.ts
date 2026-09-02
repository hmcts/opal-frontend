import { TestBed } from '@angular/core/testing';
import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiStore } from '../../stores/fines-api.store';
import { FINES_API_ROUTING_PATHS } from '../constants/fines-api-routing-paths.constant';
import { finesApiFlowStateGuard } from './fines-api-flow-state.guard';

describe('finesApiFlowStateGuard', () => {
  let mockRouter: {
    createUrlTree: ReturnType<typeof vi.fn>;
    parseUrl: ReturnType<typeof vi.fn>;
  };
  let store: InstanceType<typeof FinesApiStore>;

  const processAllocateUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.autoPaymentIn.root}/${FINES_API_ROUTING_PATHS.children.processAllocate}`;
  const selectBusinessUnitsUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.autoPaymentIn.root}/${FINES_API_ROUTING_PATHS.children.selectBusinessUnits}`;

  beforeEach(() => {
    mockRouter = {
      createUrlTree: vi.fn().mockReturnValue(new UrlTree()),
      parseUrl: vi.fn().mockImplementation((url: string) => {
        const urlTree = new UrlTree();
        const urlSegment = new UrlSegment(url, {});
        urlTree.root = new UrlSegmentGroup([urlSegment], {});
        return urlTree;
      }),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    store = TestBed.inject(FinesApiStore);
    store.resetFinesApiState();
  });

  it('should allow navigation when at least one business unit has been selected', () => {
    store.setSelectedBusinessUnitIds([101]);

    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFlowStateGuard, processAllocateUrl)(),
    );

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to select business units when no business unit has been selected', () => {
    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFlowStateGuard, processAllocateUrl)(),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([selectBusinessUnitsUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });
});
