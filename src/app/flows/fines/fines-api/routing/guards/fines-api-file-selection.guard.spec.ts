import { TestBed } from '@angular/core/testing';
import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiStore } from '../../stores/fines-api.store';
import { FINES_API_ROUTING_PATHS } from '../constants/fines-api-routing-paths.constant';
import { finesApiFileSelectionGuard } from './fines-api-file-selection.guard';

describe('finesApiFileSelectionGuard', () => {
  let mockRouter: {
    createUrlTree: ReturnType<typeof vi.fn>;
    parseUrl: ReturnType<typeof vi.fn>;
  };
  let store: InstanceType<typeof FinesApiStore>;

  const confirmProcessUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.autoPaymentIn.root}/${FINES_API_ROUTING_PATHS.children.confirmProcess}`;
  const processAllocateUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.autoPaymentIn.root}/${FINES_API_ROUTING_PATHS.children.processAllocate}`;

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

  it('should allow navigation when at least one interface job id has been selected', () => {
    store.setSelectedFileIds(['701']);

    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFileSelectionGuard, confirmProcessUrl)(),
    );

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to process and allocate when no interface job id has been selected', () => {
    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFileSelectionGuard, confirmProcessUrl)(),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([processAllocateUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });
});
