import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable, Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_API_ROUTING_PATHS } from '../routing/constants/fines-api-routing-paths.constant';
import { FinesApiStore } from '../stores/fines-api.store';
import { FinesApiProcessAllocateComponent } from './fines-api-process-allocate.component';
import { FinesApiProcessComponent } from './fines-api-process-tab/fines-api-process.component';
import { IFinesApiProcessData } from './fines-api-process-tab/interfaces/fines-api-process-data.interface';

@Component({
  selector: 'app-fines-api-process',
  template: `
    <div id="fines-api-process-tab-content">{{ tabData.tableData[0]?.['File name'] }}</div>
    <button id="fines-api-process-refresh-stub" type="button" (click)="refreshRequested.emit()">Refresh</button>
  `,
})
class FinesApiProcessStubComponent {
  @Input({ required: true }) public tabData!: IFinesApiProcessData;
  @Output() public readonly refreshRequested = new EventEmitter<void>();
}

const PROCESS_JOBS: IOpalFinesInterfaceJobSummary[] = [
  {
    business_unit_name: 'Camberwell Green',
    completed_datetime: null,
    created_datetime: '2026-09-03T08:15:00.000Z',
    file_name: 'payments_natwest_001.dat',
    interface_file_id: 1701,
    interface_job_id: 701,
    source: 'NATWEST',
    status: 'CREATED',
  },
  {
    business_unit_name: 'West London',
    completed_datetime: null,
    created_datetime: '2026-09-02T10:45:00.000Z',
    file_name: 'payments_dwp_002.dat',
    interface_file_id: 1702,
    interface_job_id: 702,
    source: 'DWP_AEA',
    status: 'CREATED',
  },
];

describe('FinesApiProcessAllocateComponent', () => {
  let component: FinesApiProcessAllocateComponent;
  let fixture: ComponentFixture<FinesApiProcessAllocateComponent>;
  let finesApiStore: InstanceType<typeof FinesApiStore>;
  let processJobs: IOpalFinesInterfaceJobSummary[];
  let getInterfaceJobsSummary: ReturnType<typeof vi.fn>;
  let routerNavigate: ReturnType<typeof vi.fn>;
  const activatedRouteParent = { routeConfig: {} };
  const activatedRoute = {
    parent: activatedRouteParent,
    snapshot: { fragment: 'process' as string | null },
    fragment: of('process'),
  };

  beforeEach(async () => {
    processJobs = PROCESS_JOBS;
    activatedRoute.snapshot.fragment = 'process';
    routerNavigate = vi.fn().mockResolvedValue(true);
    getInterfaceJobsSummary = vi.fn(
      (): Observable<IOpalFinesInterfaceJobsSummaryResponse> => of({ interface_jobs: processJobs }),
    );

    await TestBed.configureTestingModule({
      imports: [FinesApiProcessAllocateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: Router,
          useValue: { navigate: routerNavigate },
        },
        {
          provide: OpalFines,
          useValue: { getInterfaceJobsSummary },
        },
      ],
    })
      .overrideComponent(FinesApiProcessAllocateComponent, {
        remove: { imports: [FinesApiProcessComponent] },
        add: { imports: [FinesApiProcessStubComponent] },
      })
      .compileComponents();

    finesApiStore = TestBed.inject(FinesApiStore);
    finesApiStore.resetFinesApiState();
    finesApiStore.setSelectedBusinessUnitIds([77, 80]);
  });

  const render = (): void => {
    fixture = TestBed.createComponent(FinesApiProcessAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should render the shell and load the Process tab component by default', () => {
    render();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('h1')?.textContent?.trim()).toBe('Automatic Cash Input');
    expect(nativeElement.querySelector('app-fines-api-process')).toBeTruthy();
    expect(nativeElement.querySelector('#fines-api-process-tab-content')).toBeTruthy();
    expect(nativeElement.textContent).toContain('payments_natwest_001.dat');
    expect(getInterfaceJobsSummary).toHaveBeenCalledOnce();
    expect(getInterfaceJobsSummary).toHaveBeenCalledWith({
      business_unit_ids: [77, 80],
      statuses: ['CREATED'],
      interface_name: 'payments_in',
    });
    expect(finesApiStore.processInterfaceJobs()).toEqual(PROCESS_JOBS);

    const processTabContent = nativeElement.querySelector('#fines-api-process-tab-content');
    const sectionBreakContainer = nativeElement.querySelector('#fines-api-process-allocate-section-break-container');
    const sectionBreak = nativeElement.querySelector('#fines-api-process-allocate-section-break');
    const cancelContainer = nativeElement.querySelector('#fines-api-process-allocate-cancel');
    expect(processTabContent?.parentElement?.nextElementSibling).toBe(sectionBreakContainer);
    expect(sectionBreakContainer?.querySelector('hr')).toBe(sectionBreak);
    expect(sectionBreak?.classList.contains('govuk-section-break--l')).toBe(true);
    expect(sectionBreak?.classList.contains('govuk-section-break--visible')).toBe(true);
    expect(sectionBreakContainer?.nextElementSibling).toBe(cancelContainer);
    expect(cancelContainer?.querySelector('a')?.textContent?.trim()).toBe('Cancel');
  });

  it('should fetch current Process data on initial entry instead of rendering retained data', () => {
    finesApiStore.setProcessInterfaceJobs([{ ...PROCESS_JOBS[0], file_name: 'payments_stale.dat' }]);
    processJobs = [{ ...PROCESS_JOBS[0], file_name: 'payments_current.dat' }];

    render();

    const textContent = (fixture.nativeElement as HTMLElement).textContent;
    expect(getInterfaceJobsSummary).toHaveBeenCalledOnce();
    expect(finesApiStore.processInterfaceJobs()).toEqual(processJobs);
    expect(textContent).toContain('payments_current.dat');
    expect(textContent).not.toContain('payments_stale.dat');
  });

  it('should switch tabs, clear Process selections, and load Process again when selected', () => {
    render();
    finesApiStore.setSelectedFileIds(['1701']);

    component['handleTabSwitch']('allocate');
    fixture.detectChanges();

    expect(finesApiStore.activeTab()).toBe('allocate');
    expect(finesApiStore.selectedFileIds()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).querySelector('app-fines-api-process')).toBeNull();
    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: activatedRoute,
      fragment: 'allocate',
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });

    activatedRoute.snapshot.fragment = 'allocate';
    processJobs = [{ ...PROCESS_JOBS[0], file_name: 'payments_after_return.dat' }];
    component['handleTabSwitch']('process');
    fixture.detectChanges();

    expect(finesApiStore.activeTab()).toBe('process');
    expect((fixture.nativeElement as HTMLElement).querySelector('app-fines-api-process')).toBeTruthy();
    expect(getInterfaceJobsSummary).toHaveBeenCalledTimes(2);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('payments_after_return.dat');
  });

  it('should reload Process data when the child emits Refresh', () => {
    render();
    processJobs = [
      {
        ...PROCESS_JOBS[0],
        file_name: 'payments_refreshed_003.dat',
        interface_file_id: 1703,
        interface_job_id: 703,
      },
    ];

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#fines-api-process-refresh-stub')!.click();
    fixture.detectChanges();

    expect(getInterfaceJobsSummary).toHaveBeenCalledTimes(2);
    expect(finesApiStore.processInterfaceJobs()).toEqual(processJobs);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('payments_refreshed_003.dat');
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('payments_natwest_001.dat');
  });

  it('should ignore an older Refresh response after a newer Refresh completes', () => {
    render();
    const olderProcessResponse = new Subject<IOpalFinesInterfaceJobsSummaryResponse>();
    const newerJob = { ...PROCESS_JOBS[0], file_name: 'payments_latest.dat', interface_job_id: 799 };

    getInterfaceJobsSummary
      .mockImplementationOnce(() => olderProcessResponse.asObservable())
      .mockImplementationOnce(() => of({ interface_jobs: [newerJob] }));

    component['refreshProcessData']();
    component['refreshProcessData']();
    fixture.detectChanges();

    olderProcessResponse.next({ interface_jobs: PROCESS_JOBS });
    olderProcessResponse.complete();
    fixture.detectChanges();

    expect(finesApiStore.processInterfaceJobs()).toEqual([newerJob]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('payments_latest.dat');
  });

  it('should not present an initial API failure as valid empty Process data', () => {
    getInterfaceJobsSummary.mockImplementation(() => throwError(() => new Error('summary unavailable')));

    render();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-fines-api-process')).toBeNull();
    expect(finesApiStore.processInterfaceJobs()).toBeNull();
  });

  it('should retain the last rendered Process data if Refresh fails', () => {
    render();
    getInterfaceJobsSummary.mockImplementation(() => throwError(() => new Error('summary unavailable')));

    component['refreshProcessData']();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('payments_natwest_001.dat');
    expect(finesApiStore.processInterfaceJobs()).toEqual(PROCESS_JOBS);
  });

  it('should switch to the Ignored files tab without loading Process content', () => {
    render();

    component['handleTabSwitch']('ignored');
    fixture.detectChanges();

    expect(finesApiStore.activeTab()).toBe('ignored');
    expect((fixture.nativeElement as HTMLElement).querySelector('app-fines-api-process')).toBeNull();
  });

  it('should ignore an unsupported tab fragment', () => {
    render();

    component['handleTabSwitch']('unsupported');

    expect(finesApiStore.activeTab()).toBe('process');
  });

  it('should clear the flow only after Back navigation succeeds', async () => {
    render();
    finesApiStore.setSelectedFileIds(['1701']);

    component['navigateBack']();
    await fixture.whenStable();

    expect(routerNavigate).toHaveBeenCalledWith([FINES_API_ROUTING_PATHS.children.selectBusinessUnits], {
      relativeTo: activatedRouteParent,
      state: { resetFinesApiState: true },
    });
    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([]);
    expect(finesApiStore.selectedFileIds()).toEqual([]);
  });

  it('should retain flow state when Back navigation is rejected by the route guard', async () => {
    routerNavigate.mockResolvedValue(false);
    render();
    finesApiStore.setSelectedFileIds(['1701']);

    component['navigateBack']();
    await fixture.whenStable();

    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([77, 80]);
    expect(finesApiStore.selectedFileIds()).toEqual(['1701']);
  });

  it('should navigate to the Finance dashboard and clear flow state when Cancel navigation succeeds', async () => {
    render();
    finesApiStore.setSelectedFileIds(['1701']);

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLAnchorElement>('#fines-api-process-allocate-cancel a')!
      .click();
    await fixture.whenStable();

    expect(routerNavigate).toHaveBeenCalledWith(['/', 'fines', 'dashboard', 'finance']);
    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([]);
    expect(finesApiStore.selectedFileIds()).toEqual([]);
    expect(finesApiStore.processInterfaceJobs()).toBeNull();
  });

  it('should retain flow state when Cancel navigation is rejected by the route guard', async () => {
    routerNavigate.mockResolvedValue(false);
    render();
    finesApiStore.setSelectedFileIds(['1701']);

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLAnchorElement>('#fines-api-process-allocate-cancel a')!
      .click();
    await fixture.whenStable();

    expect(routerNavigate).toHaveBeenCalledWith(['/', 'fines', 'dashboard', 'finance']);
    expect(finesApiStore.selectedBusinessUnitIds()).toEqual([77, 80]);
    expect(finesApiStore.selectedFileIds()).toEqual(['1701']);
  });

  it('should baseline unsaved changes against file selection rather than selected business units', () => {
    expect(finesApiStore.unsavedChanges()).toBe(true);

    render();

    expect(finesApiStore.unsavedChanges()).toBe(false);
  });
});
