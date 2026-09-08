import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_API_ROUTING_PATHS } from '../../routing/constants/fines-api-routing-paths.constant';
import { FinesApiStore } from '../../stores/fines-api.store';
import { FINES_API_PROCESS_ERRORS } from './constants/fines-api-process-errors.constant';
import { IFinesApiProcessData } from './interfaces/fines-api-process-data.interface';
import { FinesApiProcessComponent } from './fines-api-process.component';

const PROCESS_TAB_DATA: IFinesApiProcessData = {
  tableData: [
    {
      'File name': 'payments_natwest_001.dat',
      Source: 'NatWest',
      'Business unit': 'Camberwell Green',
      'Date uploaded': 1_788_425_700_000,
      dateUploadedDisplay: '3 September 2026 at 09:15',
      interfaceJobId: '701',
      interfaceFileId: '1701',
      status: 'CREATED',
    },
    {
      'File name': 'payments_dwp_002.dat',
      Source: 'DWP/AEA',
      'Business unit': 'West London',
      'Date uploaded': 1_788_344_100_000,
      dateUploadedDisplay: '2 September 2026 at 10:45',
      interfaceJobId: '702',
      interfaceFileId: '1702',
      status: 'CREATED',
    },
  ],
};

describe('FinesApiProcessComponent', () => {
  let component: FinesApiProcessComponent;
  let fixture: ComponentFixture<FinesApiProcessComponent>;
  let finesApiStore: InstanceType<typeof FinesApiStore>;
  let routerNavigate: ReturnType<typeof vi.fn>;
  let scrollToTop: ReturnType<typeof vi.fn>;
  const activatedRouteParent = { routeConfig: {} };

  beforeEach(async () => {
    routerNavigate = vi.fn().mockResolvedValue(true);
    scrollToTop = vi.fn();

    await TestBed.configureTestingModule({
      imports: [FinesApiProcessComponent],
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
          provide: UtilsService,
          useValue: { scrollToTop },
        },
      ],
    }).compileComponents();

    finesApiStore = TestBed.inject(FinesApiStore);
    finesApiStore.resetFinesApiState();
    finesApiStore.setSelectedBusinessUnitIds([77, 80]);
  });

  const render = (tabData: IFinesApiProcessData = PROCESS_TAB_DATA): void => {
    fixture = TestBed.createComponent(FinesApiProcessComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabData', tabData);
    fixture.detectChanges();
  };

  it('should render the supplied Process tab data and expected actions', () => {
    render();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('#fines-api-process-tab-content')).toBeTruthy();
    expect(nativeElement.textContent).toContain('payments_natwest_001.dat');
    expect(nativeElement.textContent).toContain('NatWest');
    expect(nativeElement.textContent).toContain('DWP/AEA');
    expect(nativeElement.querySelector('#fines-api-process-files-heading')?.textContent?.trim()).toBe('Process files');
    expect(nativeElement.querySelector('#fines-api-process-files-description')?.textContent?.trim()).toBe(
      'Select the files you want to process',
    );
    expect(nativeElement.querySelector('#fines-api-process-files-selected-count')?.textContent?.trim()).toBe(
      '0 of 2 files selected',
    );

    const filesDescription = nativeElement.querySelector('#fines-api-process-files-description');
    const actions = nativeElement.querySelector('#fines-api-process-actions');
    const refreshButton = nativeElement.querySelector('#fines-api-process-refresh');
    const processButton = nativeElement.querySelector('#fines-api-process-submit');
    expect(filesDescription?.nextElementSibling).toBe(actions);
    expect(actions?.children[0]).toBe(refreshButton);
    expect(actions?.children[1]).toBe(processButton);
    expect(refreshButton?.classList.contains('govuk-button--secondary')).toBe(true);
    expect(processButton?.classList.contains('govuk-button--secondary')).toBe(false);
  });

  it('should show the exact empty state and hide the table controls when no files are eligible', () => {
    render({ tableData: [] });

    const nativeElement = fixture.nativeElement as HTMLElement;
    const emptyHeading = nativeElement.querySelector('#fines-api-process-files-empty');
    const emptyDescription = nativeElement.querySelector('#fines-api-process-files-description-empty');
    const refreshButton = nativeElement.querySelector('#fines-api-process-empty-refresh');
    expect(emptyHeading?.textContent?.trim()).toBe('Process files');
    expect(emptyDescription?.textContent?.trim()).toBe('There are no uploaded files to process');
    expect(emptyHeading?.nextElementSibling).toBe(emptyDescription);
    expect(emptyDescription?.nextElementSibling).toBe(refreshButton);
    expect(nativeElement.querySelector('#fines-api-process-submit')).toBeNull();
    expect(nativeElement.querySelector('#fines-api-process-files-selected-count')).toBeNull();
  });

  it('should show the exact validation error and remain on the tab when Process has no selection', () => {
    render();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('#fines-api-process-submit')!.click();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(component['formErrorSummaryMessage']).toEqual([
      {
        fieldId: 'fines-api-process-files-select-all-checkbox',
        message: FINES_API_PROCESS_ERRORS.selectAtLeastOneFile,
      },
    ]);
    expect(nativeElement.querySelector('#fines-api-process-files-error')?.textContent).toContain(
      'Select at least 1 file',
    );
    expect(
      nativeElement.querySelector('#fines-api-process-files-select-all-group')?.getAttribute('aria-describedby'),
    ).toBe('fines-api-process-files-description fines-api-process-files-selected-count fines-api-process-files-error');
    expect(routerNavigate).not.toHaveBeenCalled();
    expect(scrollToTop).toHaveBeenCalledOnce();
  });

  it('should persist selected interface file IDs, clear validation, and navigate to Confirm Process', () => {
    render();
    component['process']();

    component['handleSelectedInterfaceFileIdsChange'](['1701', '1702']);
    component['process']();

    expect(finesApiStore.selectedFileIds()).toEqual(['1701', '1702']);
    expect(component['formErrorSummaryMessage']).toEqual([]);
    expect(routerNavigate).toHaveBeenCalledWith([FINES_API_ROUTING_PATHS.children.confirmProcess], {
      relativeTo: activatedRouteParent,
    });
  });

  it('should retain the validation error when the selected file IDs remain empty', () => {
    render();
    component['process']();

    component['handleSelectedInterfaceFileIdsChange']([]);

    expect(finesApiStore.selectedFileIds()).toEqual([]);
    expect(component['formErrorSummaryMessage']).toEqual([
      {
        fieldId: 'fines-api-process-files-select-all-checkbox',
        message: FINES_API_PROCESS_ERRORS.selectAtLeastOneFile,
      },
    ]);
  });

  it('should clear selection state and ask the parent to refresh Process data', () => {
    render();
    const refreshRequested = vi.fn();
    component.refreshRequested.subscribe(refreshRequested);
    component['handleSelectedInterfaceFileIdsChange'](['1701']);

    component['refresh']();

    expect(finesApiStore.selectedFileIds()).toEqual([]);
    expect(component['formErrorSummaryMessage']).toEqual([]);
    expect(refreshRequested).toHaveBeenCalledOnce();
  });
});
