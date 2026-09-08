import { TestBed } from '@angular/core/testing';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_API_STATE } from './constants/fines-api-state.constant';
import { FinesApiStore } from './fines-api.store';

describe('FinesApiStore', () => {
  let store: InstanceType<typeof FinesApiStore>;
  const processInterfaceJobs: IOpalFinesInterfaceJobSummary[] = [
    {
      business_unit_name: 'Camberwell Green',
      completed_datetime: null,
      created_datetime: '2026-09-03T11:29:54.794Z',
      file_name: 'payments.csv',
      interface_file_id: 501,
      interface_job_id: 701,
      source: 'NATWEST',
      status: 'CREATED',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FinesApiStore);
    store.resetFinesApiState();
  });

  it('should be created with the initial state', () => {
    expect(store).toBeTruthy();
    expect(store.selectedBusinessUnitIds()).toEqual(FINES_API_STATE.selectedBusinessUnitIds);
    expect(store.selectedFileIds()).toEqual(FINES_API_STATE.selectedFileIds);
    expect(store.overrideInhibitFileIds()).toEqual(FINES_API_STATE.overrideInhibitFileIds);
    expect(store.processInterfaceJobs()).toBeNull();
    expect(store.selectedInterfaceJobIds()).toEqual([]);
    expect(store.activeTab()).toBe(FINES_API_STATE.activeTab);
    expect(store.stateChanges()).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should set selected business unit ids and clear dependent process state', () => {
    store.setSelectedFileIds(['501']);
    store.setOverrideInhibitFileIds(['501']);
    store.setProcessInterfaceJobs(processInterfaceJobs);
    store.setActiveTab('ignored');

    store.setSelectedBusinessUnitIds([101, 202]);

    expect(store.selectedBusinessUnitIds()).toEqual([101, 202]);
    expect(store.selectedFileIds()).toEqual([]);
    expect(store.overrideInhibitFileIds()).toEqual([]);
    expect(store.processInterfaceJobs()).toBeNull();
    expect(store.activeTab()).toBe('process');
    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(true);
  });

  it('should compute whether business units have been selected', () => {
    expect(store.hasSelectedBusinessUnits()).toBe(false);

    store.setSelectedBusinessUnitIds([101]);

    expect(store.hasSelectedBusinessUnits()).toBe(true);
  });

  it('should retain process state when the selected business units have not changed', () => {
    store.setSelectedBusinessUnitIds([101, 202]);
    store.setSelectedFileIds(['501']);
    store.setOverrideInhibitFileIds(['501']);
    store.setProcessInterfaceJobs(processInterfaceJobs);
    store.setActiveTab('ignored');

    store.setSelectedBusinessUnitIds([202, 101]);

    expect(store.selectedFileIds()).toEqual(['501']);
    expect(store.overrideInhibitFileIds()).toEqual(['501']);
    expect(store.processInterfaceJobs()).toEqual(processInterfaceJobs);
    expect(store.activeTab()).toBe('ignored');
  });

  it('should clear selected business unit ids and dependent selections', () => {
    store.setSelectedBusinessUnitIds([101]);
    store.setSelectedFileIds(['501']);
    store.setOverrideInhibitFileIds(['501']);
    store.setProcessInterfaceJobs(processInterfaceJobs);
    store.setActiveTab('allocate');

    store.clearSelectedBusinessUnitIds();

    expect(store.selectedBusinessUnitIds()).toEqual([]);
    expect(store.selectedFileIds()).toEqual([]);
    expect(store.overrideInhibitFileIds()).toEqual([]);
    expect(store.processInterfaceJobs()).toBeNull();
    expect(store.activeTab()).toBe('process');
    expect(store.stateChanges()).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });

  it('should store stringified interface file ids and clear override inhibits', () => {
    store.setOverrideInhibitFileIds(['501']);

    store.setSelectedFileIds(['502']);

    expect(store.selectedFileIds()).toEqual(['502']);
    expect(store.overrideInhibitFileIds()).toEqual([]);
    expect(store.hasSelectedFiles()).toBe(true);
    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(true);
  });

  it('should map selected interface files to unique job ids for processing', () => {
    const jobsWithSharedJobId = [
      processInterfaceJobs[0],
      {
        ...processInterfaceJobs[0],
        file_name: 'payments-part-2.csv',
        interface_file_id: 502,
      },
      {
        ...processInterfaceJobs[0],
        file_name: 'payments-separate-job.csv',
        interface_file_id: 503,
        interface_job_id: 702,
      },
    ];
    store.setProcessInterfaceJobs(jobsWithSharedJobId);

    store.setSelectedFileIds(['501', '502', '503']);

    expect(store.selectedInterfaceJobIds()).toEqual([701, 702]);
  });

  it('should set and clear retained process interface jobs', () => {
    store.setProcessInterfaceJobs(processInterfaceJobs);

    expect(store.processInterfaceJobs()).toEqual(processInterfaceJobs);
    expect(store.processInterfaceJobs()).not.toBe(processInterfaceJobs);

    store.clearProcessInterfaceJobs();

    expect(store.processInterfaceJobs()).toBeNull();
  });

  it('should set override inhibit file ids', () => {
    store.setOverrideInhibitFileIds(['file-1', 'file-2']);

    expect(store.overrideInhibitFileIds()).toEqual(['file-1', 'file-2']);
  });

  it('should set the active tab', () => {
    store.setActiveTab('allocate');

    expect(store.activeTab()).toBe('allocate');
  });

  it('should set state and unsaved change flags explicitly', () => {
    store.setStateChanges(true);
    store.setUnsavedChanges(true);

    expect(store.stateChanges()).toBe(true);
    expect(store.unsavedChanges()).toBe(true);
  });

  it('should reset to the initial state', () => {
    store.setSelectedBusinessUnitIds([101]);
    store.setSelectedFileIds(['501']);
    store.setOverrideInhibitFileIds(['501']);
    store.setProcessInterfaceJobs(processInterfaceJobs);
    store.setActiveTab('ignored');

    store.resetFinesApiState();

    expect(store.selectedBusinessUnitIds()).toEqual(FINES_API_STATE.selectedBusinessUnitIds);
    expect(store.selectedFileIds()).toEqual(FINES_API_STATE.selectedFileIds);
    expect(store.overrideInhibitFileIds()).toEqual(FINES_API_STATE.overrideInhibitFileIds);
    expect(store.processInterfaceJobs()).toBeNull();
    expect(store.activeTab()).toBe(FINES_API_STATE.activeTab);
    expect(store.stateChanges()).toBe(false);
    expect(store.unsavedChanges()).toBe(false);
  });
});
