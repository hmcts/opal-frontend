import { Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { finesMacFlowStateGuard } from './fines-mac-flow-state.guard';
import { TestBed } from '@angular/core/testing';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { runFinesMacEmptyFlowGuardWithContext } from '../helpers/run-fines-mac-empty-flow-guard-with-context';
import { of } from 'rxjs';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { describe } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('finesMacFlowStateGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  let finesMacStore: FinesMacStoreType;

  const urlPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`;
  const expectedUrl = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`;

  beforeEach(() => {
    mockRouter = createSpyObj(finesMacFlowStateGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.mockImplementation((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE));
  });

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  it('should return true if AccountType and DefendantType are populated', async () => {
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE_MOCK));

    const result = await runFinesMacEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesMacFlowStateGuard, urlPath));

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should navigate to create account page if AccountType and DefendantType are not populated', async () => {
    finesMacStore.setFinesMacStore(structuredClone(FINES_MAC_STATE));

    const result = await runFinesMacEmptyFlowGuardWithContext(getGuardWithDummyUrl(finesMacFlowStateGuard, urlPath));

    expect(result).toEqual(expect.any(UrlTree));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([expectedUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  });

  it('should handle observable result correctly', async () => {
    const mockResult = true;
    const guardReturningObservable = () => of(mockResult);

    const result = await runFinesMacEmptyFlowGuardWithContext(guardReturningObservable);

    expect(result).toBe(mockResult);
  });
});
