import { TestBed } from '@angular/core/testing';
import { GuardResult, MaybeAsync, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { getGuardWithDummyUrl } from '@hmcts/opal-frontend-common/guards/helpers';
import { IOpalFinesBusinessUnitOutstandingAutoPaymentCount } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-count.interface';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiStore } from '../../stores/fines-api.store';
import { FINES_API_ROUTING_PATHS } from '../constants/fines-api-routing-paths.constant';
import { finesApiFileSelectionGuard } from './fines-api-file-selection.guard';

const BUSINESS_UNITS: IOpalFinesBusinessUnitOutstandingAutoPaymentCount[] = [
  {
    business_unit_id: 77,
    business_unit_name: 'Camberwell Green',
    file_count: 1,
    till_count: 0,
  },
  {
    business_unit_id: 80,
    business_unit_name: 'West London',
    file_count: 1,
    till_count: 0,
  },
];

const PROCESS_INTERFACE_JOBS: IOpalFinesInterfaceJobSummary[] = [
  {
    business_unit_name: 'Camberwell Green',
    completed_datetime: null,
    created_datetime: '2026-09-03T08:15:00.000Z',
    file_name: 'payments_natwest_001.dat',
    interface_file_id: 1701,
    interface_job_id: 701,
    source: 'NATWEST',
    status: 'FAILED',
  },
  {
    business_unit_name: 'West London',
    completed_datetime: null,
    created_datetime: '2026-09-02T10:45:00.000Z',
    file_name: 'payments_dwp_002.dat',
    interface_file_id: 1702,
    interface_job_id: 702,
    source: 'DWP',
    status: 'CREATED',
  },
];

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

  const expectRedirectToProcessAllocate = (result: MaybeAsync<GuardResult>): void => {
    expect(result).toBeInstanceOf(UrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([processAllocateUrl], {
      queryParams: undefined,
      fragment: undefined,
    });
  };

  const arrangeValidFileSelection = (): void => {
    store.setAvailableBusinessUnits(BUSINESS_UNITS);
    store.setSelectedBusinessUnitIds([77, 80]);
    store.setProcessInterfaceJobs(PROCESS_INTERFACE_JOBS);
    store.setSelectedFileIds(['1701']);
  };

  it('should allow navigation when selected files can be resolved to selected business units', () => {
    arrangeValidFileSelection();

    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFileSelectionGuard, confirmProcessUrl)(),
    );

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to Process and Allocate when no file has been selected', () => {
    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFileSelectionGuard, confirmProcessUrl)(),
    );

    expectRedirectToProcessAllocate(result);
  });

  it('should redirect to Process and Allocate when a selected file is missing from the process jobs', () => {
    arrangeValidFileSelection();
    store.setSelectedFileIds(['1701', '9999']);

    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFileSelectionGuard, confirmProcessUrl)(),
    );

    expectRedirectToProcessAllocate(result);
  });

  it('should redirect to Process and Allocate when a selected file cannot resolve to a selected business unit', () => {
    store.setAvailableBusinessUnits(BUSINESS_UNITS);
    store.setSelectedBusinessUnitIds([77]);
    store.setProcessInterfaceJobs(PROCESS_INTERFACE_JOBS);
    store.setSelectedFileIds(['1702']);

    const result = TestBed.runInInjectionContext(() =>
      getGuardWithDummyUrl(finesApiFileSelectionGuard, confirmProcessUrl)(),
    );

    expectRedirectToProcessAllocate(result);
  });
});
