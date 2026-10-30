import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';
import { FileService } from '@hmcts/opal-frontend-common/services/file-service';
import { OpalFileHandlingService } from '@hmcts/opal-frontend-common/services/opal-file-handling-service';
import type {
  IOpalFileHandlingInterfaceFile,
  IOpalFileHandlingInterfaceFileParams,
  IOpalFileHandlingInterfaceFilesRefData,
} from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { FinesFinanceInterfaceFilesPayloadService } from '../../services/fines-finance-interface-files-payload.service';
import type { IFinesFinanceInterfaceFilesForm } from '../../interfaces/fines-finance-interface-files-form.interface';
import { FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } from '../../mocks/fines-finance-business-unit-ref-data.mock';
import { FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK } from '../../fines-finance-inbound-files/mocks/fines-finance-inbound-files-response.mock';
import { FinesFinanceInterfaceFilesBaseDirective } from './fines-finance-interface-files-base.directive';

@Component({ template: '' })
class TestInterfaceFilesComponent extends FinesFinanceInterfaceFilesBaseDirective<
  IFinesFinanceInterfaceFilesForm,
  ICustomFileInterfaceViewerTableData
> {
  public readonly isInbound = true;

  public readonly initialFilterState: IFinesFinanceInterfaceFilesForm = {
    businessUnit: null,
    dateFilter: 'last7Days',
    days: '',
    dateFrom: '',
    dateTo: '',
  };

  public readonly buildSearchParams = vi.fn(
    (formData: IFinesFinanceInterfaceFilesForm): IOpalFileHandlingInterfaceFileParams =>
      formData.businessUnit ? { business_unit_code: formData.businessUnit } : {},
  );

  public readonly mapFilesToTableData = vi
    .fn<
      (
        files: IOpalFileHandlingInterfaceFile[] | null | undefined,
        businessUnits: IAlphagovAccessibleAutocompleteItem[],
      ) => ICustomFileInterfaceViewerTableData[]
    >()
    .mockReturnValue([]);

  public override readonly selectFiles = vi.fn<
    (
      files: IOpalFileHandlingInterfaceFile[] | null | undefined,
      formData: IFinesFinanceInterfaceFilesForm,
    ) => IOpalFileHandlingInterfaceFile[] | null | undefined
  >((files) => files);
}

describe('FinesFinanceInterfaceFilesBaseDirective', () => {
  let fixture: ComponentFixture<TestInterfaceFilesComponent>;
  let component: TestInterfaceFilesComponent;
  let request: Subject<IOpalFileHandlingInterfaceFilesRefData>;
  const permittedOptions = [{ name: 'Camberwell Green', value: '0046' }];
  const displayOptions = [...permittedOptions, { name: 'N E Region', value: '0047' }];
  const mappedRow: ICustomFileInterfaceViewerTableData = {
    'File ID': 1001,
    'Date and time': Date.parse('2026-10-20T12:00:00Z'),
    dateTimeDisplay: '20 Oct 2026 at 13:00',
    Title: 'allpay_1001.xml',
    'Business unit': 'Camberwell Green',
    Status: 'Ready',
    Actions: null,
  };
  const getInterfaceFilesRefData = vi.fn<OpalFileHandlingService['getInterfaceFilesRefData']>();
  const getPermittedBusinessUnitOptions =
    vi.fn<FinesFinanceInterfaceFilesPayloadService['getPermittedBusinessUnitOptions']>();
  const mapBusinessUnitsToOptions = vi.fn<FinesFinanceInterfaceFilesPayloadService['mapBusinessUnitsToOptions']>();

  beforeEach(async () => {
    request = new Subject<IOpalFileHandlingInterfaceFilesRefData>();
    getInterfaceFilesRefData.mockReset().mockReturnValue(request);
    getPermittedBusinessUnitOptions.mockReset().mockReturnValue(permittedOptions);
    mapBusinessUnitsToOptions.mockReset().mockReturnValue(displayOptions);

    await TestBed.configureTestingModule({
      imports: [TestInterfaceFilesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { businessUnits: FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK } } },
        },
        { provide: OpalFileHandlingService, useValue: { getInterfaceFilesRefData } },
        { provide: FileService, useValue: { downloadFile: vi.fn() } },
        {
          provide: FinesFinanceInterfaceFilesPayloadService,
          useValue: { getPermittedBusinessUnitOptions, mapBusinessUnitsToOptions },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestInterfaceFilesComponent);
    component = fixture.componentInstance;
  });

  it('loads a clone of the default form exactly once on entry', () => {
    expect(component.tableData()).toBeNull();
    expect(component.mapFilesToTableData).not.toHaveBeenCalled();

    fixture.detectChanges();
    fixture.detectChanges();

    expect(component.buildSearchParams).toHaveBeenCalledExactlyOnceWith(component.initialFilterState);
    expect(component.buildSearchParams.mock.calls[0][0]).not.toBe(component.initialFilterState);
    expect(getInterfaceFilesRefData).toHaveBeenCalledExactlyOnceWith({});
  });

  it('limits filter choices to permitted units while mapping rows with all reference names and caching the result', () => {
    const mappedRows = [mappedRow];
    component.mapFilesToTableData.mockReturnValue(mappedRows);
    fixture.detectChanges();
    request.next(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);

    expect(component.businessUnits).toBe(permittedOptions);
    expect(getPermittedBusinessUnitOptions).toHaveBeenCalledExactlyOnceWith(
      FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData,
    );
    expect(component.tableData()).toBe(mappedRows);
    expect(component.tableData()).toBe(mappedRows);
    expect(component.mapFilesToTableData).toHaveBeenCalledExactlyOnceWith(
      FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files,
      displayOptions,
    );
    expect(mapBusinessUnitsToOptions).toHaveBeenCalledExactlyOnceWith(
      FINES_FINANCE_BUSINESS_UNIT_REF_DATA_MOCK.refData,
    );
  });

  it.each([{ files: [] }, { files: null }])(
    'distinguishes an unreceived response from an empty file list ($files)',
    ({ files }) => {
      fixture.detectChanges();
      expect(component.tableData()).toBeNull();

      request.next({ number_of_results: 0, interface_files: files });

      expect(component.tableData()).toEqual([]);
      expect(component.mapFilesToTableData).toHaveBeenCalledExactlyOnceWith(files, displayOptions);
    },
  );

  it('retains the last successful rows after a failed refresh', () => {
    const refreshRequest = new Subject<IOpalFileHandlingInterfaceFilesRefData>();
    const mappedRows = [{ ...mappedRow, Title: 'previous-file.xml' }];
    component.mapFilesToTableData.mockReturnValue(mappedRows);
    fixture.detectChanges();
    request.next(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    expect(component.tableData()).toBe(mappedRows);
    getInterfaceFilesRefData.mockReturnValue(refreshRequest);

    component.onFormSubmit({
      formData: { ...component.initialFilterState, businessUnit: '0046' },
      nestedFlow: false,
    });
    refreshRequest.error(new Error('Search failed'));

    expect(component.tableData()).toBe(mappedRows);
    expect(component.mapFilesToTableData).toHaveBeenCalledTimes(1);
    expect(getInterfaceFilesRefData).toHaveBeenLastCalledWith({ business_unit_code: '0046' });
  });

  it('retries after failure and cancels the previous search so only the latest response is used', () => {
    const pendingRequest = new Subject<IOpalFileHandlingInterfaceFilesRefData>();
    const latestRequest = new Subject<IOpalFileHandlingInterfaceFilesRefData>();
    fixture.detectChanges();
    request.error(new Error('Initial search failed'));
    expect(component.tableData()).toBeNull();
    getInterfaceFilesRefData.mockReturnValueOnce(pendingRequest).mockReturnValueOnce(latestRequest);

    component.onFormSubmit({ formData: component.initialFilterState, nestedFlow: false });
    expect(pendingRequest.observed).toBe(true);
    component.onFormSubmit({ formData: component.initialFilterState, nestedFlow: false });

    expect(pendingRequest.observed).toBe(false);
    pendingRequest.next(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    expect(component.tableData()).toBeNull();
    latestRequest.next({ number_of_results: 0, interface_files: [] });
    expect(component.tableData()).toEqual([]);
    expect(component.mapFilesToTableData).toHaveBeenCalledExactlyOnceWith([], displayOptions);
  });

  it('selects returned files using the submitted filter snapshot before mapping rows', () => {
    const formData = { ...component.initialFilterState, businessUnit: '0046' };
    const submittedFormData = { ...formData };
    const selectedFiles = [FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0]];
    const mappedRows = [{ ...mappedRow, Title: 'selected-file.xml' }];
    component.selectFiles.mockReturnValue(selectedFiles);
    component.mapFilesToTableData.mockReturnValue(mappedRows);

    component.onFormSubmit({ formData, nestedFlow: false });
    formData.businessUnit = '0034';
    request.next(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);

    expect(component.tableData()).toBe(mappedRows);
    expect(component.selectFiles).toHaveBeenCalledExactlyOnceWith(
      FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files,
      submittedFormData,
    );
    expect(component.selectFiles.mock.calls[0][1]).not.toBe(formData);
    expect(component.buildSearchParams).toHaveBeenCalledExactlyOnceWith(submittedFormData);
    expect(component.mapFilesToTableData).toHaveBeenCalledExactlyOnceWith(selectedFiles, displayOptions);
  });

  it('unsubscribes from the active request when the component is destroyed', () => {
    fixture.detectChanges();
    expect(request.observed).toBe(true);

    fixture.destroy();

    expect(request.observed).toBe(false);
    request.next(FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK);
    expect(component.tableData()).toBeNull();
    expect(component.mapFilesToTableData).not.toHaveBeenCalled();
  });
});
