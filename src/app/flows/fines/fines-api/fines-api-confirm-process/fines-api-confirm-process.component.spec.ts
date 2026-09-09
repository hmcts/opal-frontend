import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { IOpalFinesBusinessUnitOutstandingAutoPaymentCount } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-count.interface';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { EMPTY, Observable, Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FINES_API_PROCESS_ALLOCATE_TABS_KEYS } from '../fines-api-process-allocate/constants/fines-api-process-allocate-tabs-keys.constant';
import { FINES_API_ROUTING_PATHS } from '../routing/constants/fines-api-routing-paths.constant';
import { FinesApiStore } from '../stores/fines-api.store';
import { FinesApiConfirmProcessComponent } from './fines-api-confirm-process.component';

const PROCESS_JOBS: IOpalFinesInterfaceJobSummary[] = [
  {
    business_unit_name: 'West London',
    completed_datetime: null,
    created_datetime: '2026-09-03T10:15:00.000Z',
    file_name: 'payments_dwp_001.dat',
    interface_file_id: 501,
    interface_job_id: 1001,
    source: 'DWP_AEA',
    status: 'CREATED',
  },
  {
    business_unit_name: 'Camberwell Green',
    completed_datetime: null,
    created_datetime: '2026-09-03T10:16:00.000Z',
    file_name: 'payments_natwest_001.dat',
    interface_file_id: 502,
    interface_job_id: 1002,
    source: 'NATWEST',
    status: 'CREATED',
  },
  {
    business_unit_name: 'Camberwell Green',
    completed_datetime: null,
    created_datetime: '2026-09-03T10:17:00.000Z',
    file_name: 'payments_aea_001.dat',
    interface_file_id: 503,
    interface_job_id: 1003,
    source: 'AEA',
    status: 'FAILED',
  },
  {
    business_unit_name: 'Camden and Islington',
    completed_datetime: null,
    created_datetime: '2026-09-03T10:18:00.000Z',
    file_name: 'payments_not_selected.dat',
    interface_file_id: 504,
    interface_job_id: 1004,
    source: 'DWP/AEA',
    status: 'CREATED',
  },
];

const BUSINESS_UNITS: IOpalFinesBusinessUnitOutstandingAutoPaymentCount[] = [
  {
    business_unit_id: 65,
    business_unit_name: 'Camden and Islington',
    file_count: 1,
    till_count: 0,
  },
  {
    business_unit_id: 77,
    business_unit_name: 'Camberwell Green',
    file_count: 2,
    till_count: 0,
  },
  {
    business_unit_id: 80,
    business_unit_name: 'West London',
    file_count: 1,
    till_count: 0,
  },
];

describe('FinesApiConfirmProcessComponent', () => {
  let component: FinesApiConfirmProcessComponent;
  let fixture: ComponentFixture<FinesApiConfirmProcessComponent>;
  let finesApiStore: InstanceType<typeof FinesApiStore>;
  let processInterfaceJobs: ReturnType<typeof vi.fn>;
  let routerNavigate: ReturnType<typeof vi.fn>;
  let scrollToTop: ReturnType<typeof vi.fn>;
  const activatedRouteParent = {};

  const createComponent = (
    processJobs: IOpalFinesInterfaceJobSummary[] = PROCESS_JOBS,
    selectedFileIds: string[] = ['501', '502', '503'],
  ): void => {
    finesApiStore.resetFinesApiState();
    finesApiStore.setAvailableBusinessUnits(BUSINESS_UNITS);
    finesApiStore.setSelectedBusinessUnitIds([77, 80]);
    finesApiStore.setProcessInterfaceJobs(processJobs);
    finesApiStore.setSelectedFileIds(selectedFileIds);

    fixture = TestBed.createComponent(FinesApiConfirmProcessComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    processInterfaceJobs = vi.fn().mockReturnValue(of(undefined));
    routerNavigate = vi.fn().mockResolvedValue(true);
    scrollToTop = vi.fn();

    await TestBed.configureTestingModule({
      imports: [FinesApiConfirmProcessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { parent: activatedRouteParent },
        },
        {
          provide: Router,
          useValue: { navigate: routerNavigate },
        },
        {
          provide: OpalFines,
          useValue: { processInterfaceJobs },
        },
        {
          provide: UtilsService,
          useValue: { scrollToTop },
        },
      ],
    }).compileComponents();

    finesApiStore = TestBed.inject(FinesApiStore);
  });

  it('should render selected file counts and alphabetically sorted business unit totals', () => {
    createComponent();

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const summaryRows = nativeElement.querySelectorAll<HTMLTableRowElement>(
      '#fines-api-confirm-process-business-units tbody tr',
    );

    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('h1')?.textContent?.trim()).toBe('Confirm before processing');
    expect(nativeElement.querySelector('#fines-api-confirm-process-selection-count')?.textContent?.trim()).toBe(
      'You have selected 3 of 3 files to process',
    );
    expect(nativeElement.querySelector('#fines-api-confirm-process-selection-count')?.getAttribute('role')).toBe(
      'status',
    );
    expect(nativeElement.querySelector('#fines-api-confirm-process-selection-count')?.getAttribute('aria-atomic')).toBe(
      'true',
    );
    expect(summaryRows).toHaveLength(2);
    expect(summaryRows[0].textContent).toContain('Camberwell Green');
    expect(summaryRows[0].textContent).toContain('2');
    expect(summaryRows[1].textContent).toContain('West London');
    expect(summaryRows[1].textContent).toContain('1');
  });

  it('should display only selected DWP/AEA files and check every override by default', () => {
    createComponent();

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const overrideSection = nativeElement.querySelector('#fines-api-confirm-process-override-inhibits');
    const overrideCheckboxes = overrideSection?.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]');
    const checkboxFormGroups = overrideSection?.querySelectorAll<HTMLElement>(
      'opal-lib-govuk-checkboxes > .govuk-form-group',
    );

    expect(overrideSection?.textContent).toContain('Override inhibits for DWP/AEA files');
    expect(overrideSection?.classList.contains('govuk-form-group')).toBe(true);
    expect(overrideSection?.classList.contains('govuk-!-margin-bottom-0')).toBe(true);
    expect(checkboxFormGroups?.length).toBeGreaterThan(0);
    expect(
      Array.from(checkboxFormGroups ?? []).every(
        (formGroup) => Number.parseFloat(getComputedStyle(formGroup).marginBottom) === 0,
      ),
    ).toBe(true);
    expect(overrideSection?.textContent).toContain('payments_dwp_001.dat');
    expect(overrideSection?.textContent).toContain('payments_aea_001.dat');
    expect(overrideSection?.textContent).not.toContain('payments_natwest_001.dat');
    expect(overrideSection?.textContent).not.toContain('payments_not_selected.dat');
    expect(overrideCheckboxes).toHaveLength(2);
    expect(Array.from(overrideCheckboxes ?? []).every((checkbox) => checkbox.checked)).toBe(true);
    expect(finesApiStore.overrideInhibitFileIds()).toEqual(['501', '503']);
  });

  it('should reduce the displayed selection count when a DWP/AEA override is unchecked', () => {
    createComponent();
    fixture.detectChanges();

    const checkbox = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
      '#fines-api-confirm-process-override-inhibits-503',
    )!;
    checkbox.click();
    fixture.detectChanges();

    expect(checkbox.checked).toBe(false);
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('#fines-api-confirm-process-selection-count')
        ?.textContent?.trim(),
    ).toBe('You have selected 2 of 3 files to process');
    expect(finesApiStore.overrideInhibitFileIds()).toEqual(['501']);
  });

  it('should hide the override-inhibits section when no selected files are from DWP/AEA', () => {
    createComponent(PROCESS_JOBS, ['502']);

    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelector('#fines-api-confirm-process-selection-count')?.textContent?.trim()).toBe(
      'You have selected 1 of 1 files to process',
    );
    expect(nativeElement.querySelector('#fines-api-confirm-process-override-inhibits')).toBeNull();
  });

  it('should submit every selected job with its override flag and navigate to Allocate', () => {
    createComponent();
    fixture.detectChanges();
    component['toggleOverrideInhibits']({ rowId: '503', checked: false });

    component['process']();

    expect(processInterfaceJobs).toHaveBeenCalledWith({
      interface_jobs: [
        { business_unit_id: 80, interface_job_id: 1001, override_inhibits: true },
        { business_unit_id: 77, interface_job_id: 1002, override_inhibits: false },
        { business_unit_id: 77, interface_job_id: 1003, override_inhibits: false },
      ],
    });
    expect(finesApiStore.activeTab()).toBe(FINES_API_PROCESS_ALLOCATE_TABS_KEYS.allocate);
    expect(finesApiStore.selectedFileIds()).toEqual([]);
    expect(finesApiStore.processInterfaceJobs()).toBeNull();
    expect(finesApiStore.unsavedChanges()).toBe(false);
    expect(routerNavigate).toHaveBeenCalledWith([FINES_API_ROUTING_PATHS.children.processAllocate], {
      relativeTo: activatedRouteParent,
      fragment: FINES_API_PROCESS_ALLOCATE_TABS_KEYS.allocate,
    });
  });

  it('should disable repeat processing while the request is in flight', () => {
    const processResponse = new Subject<void>();
    processInterfaceJobs.mockReturnValue(processResponse as Observable<void>);
    createComponent();
    fixture.detectChanges();

    component['process']();
    component['process']();
    fixture.detectChanges();

    expect(processInterfaceJobs).toHaveBeenCalledOnce();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#fines-api-confirm-process-submit')
        ?.disabled,
    ).toBe(true);

    processResponse.next();
    processResponse.complete();
  });

  it('should prevent cancellation while processing and stop reacting after destruction', () => {
    const processResponse = new Subject<void>();
    processInterfaceJobs.mockReturnValue(processResponse as Observable<void>);
    createComponent();
    fixture.detectChanges();

    component['process']();
    fixture.detectChanges();
    component['cancel']();

    expect(routerNavigate).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).querySelector('opal-lib-govuk-cancel-link')).toBeNull();

    fixture.destroy();
    processResponse.next();
    processResponse.complete();

    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('should remain on the confirmation screen and preserve selections when processing fails', () => {
    processInterfaceJobs.mockReturnValue(throwError(() => new Error('Processing failed')));
    createComponent();
    fixture.detectChanges();

    component['process']();

    expect(scrollToTop).toHaveBeenCalledOnce();
    expect(routerNavigate).not.toHaveBeenCalled();
    expect(finesApiStore.selectedFileIds()).toEqual(['501', '502', '503']);
    expect(finesApiStore.overrideInhibitFileIds()).toEqual(['501', '503']);
    expect(component['isProcessing']()).toBe(false);
  });

  it('should remain on the confirmation screen when an interceptor completes an error response', () => {
    processInterfaceJobs.mockReturnValue(EMPTY);
    createComponent();
    fixture.detectChanges();

    component['process']();

    expect(scrollToTop).toHaveBeenCalledOnce();
    expect(routerNavigate).not.toHaveBeenCalled();
    expect(finesApiStore.selectedFileIds()).toEqual(['501', '502', '503']);
    expect(component['isProcessing']()).toBe(false);
  });

  it('should discard confirmation selections and return to a freshly loaded Process tab on cancel', () => {
    createComponent();
    fixture.detectChanges();
    component['toggleOverrideInhibits']({ rowId: '503', checked: false });

    component['cancel']();

    expect(finesApiStore.activeTab()).toBe(FINES_API_PROCESS_ALLOCATE_TABS_KEYS.process);
    expect(finesApiStore.selectedFileIds()).toEqual([]);
    expect(finesApiStore.overrideInhibitFileIds()).toEqual([]);
    expect(finesApiStore.processInterfaceJobs()).toBeNull();
    expect(finesApiStore.unsavedChanges()).toBe(false);
    expect(routerNavigate).toHaveBeenCalledWith([FINES_API_ROUTING_PATHS.children.processAllocate], {
      relativeTo: activatedRouteParent,
      fragment: FINES_API_PROCESS_ALLOCATE_TABS_KEYS.process,
    });
  });
});
