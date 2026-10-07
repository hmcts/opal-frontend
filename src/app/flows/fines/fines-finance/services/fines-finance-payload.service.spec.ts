import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesFinancePayloadService } from './fines-finance-payload.service';
import {
  FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
} from '../constants/fines-finance-autocomplete.constant';
import {
  InterfaceFileViewerFileSource,
  InterfaceFileViewerFileStatus,
  InterfaceFileViewerFileType,
  InterfaceFileViewerSupportedDomain,
} from '../constants/fines-finance-enums.constant';
import { IFinesFinanceInboundFilesForm } from './interfaces/fines-finance-inbound-files-form.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

describe('FinesFinancePayloadService', () => {
  let service: FinesFinancePayloadService;
  let dateServiceMock: { getDateRange: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dateServiceMock = {
      getDateRange: vi.fn((pastDays: number) =>
        pastDays === 6 ? { from: '30/09/2026', to: '06/10/2026' } : { from: '23/09/2026', to: '06/10/2026' },
      ),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: DateService, useValue: dateServiceMock }],
    });
    service = TestBed.inject(FinesFinancePayloadService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should build inbound interface file search params and omit all-filter values', () => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS,
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
      fileType: FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
      source: FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
    };

    const params = service.buildInboundFilesSearchParams(formData);

    expect(params).toEqual({
      domain: InterfaceFileViewerSupportedDomain.Fines,
      from_date: '30/09/2026',
      not_status: [
        InterfaceFileViewerFileStatus.Duplicate,
        InterfaceFileViewerFileStatus.Superseded,
        InterfaceFileViewerFileStatus.FailedSuperseded,
      ],
      not_target: [InterfaceFileViewerFileSource.Source],
      target: 'SOURCE_JSON,TRANSFORMED_JSON',
      to_date: '06/10/2026',
    });
    expect(dateServiceMock.getDateRange).toHaveBeenCalledWith(6, 0, 'dd/MM/yyyy');
  });

  it('should include selected business unit, file type, source, and custom days', () => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: '77',
      dateFilter: 'customDays',
      days: '14',
      dateFrom: '',
      dateTo: '',
      fileType: InterfaceFileViewerFileSource.SourceJson,
      source: InterfaceFileViewerFileType.Opal,
    };

    const params = service.buildInboundFilesSearchParams(formData);

    expect(params).toEqual({
      business_unit_code: '77',
      domain: InterfaceFileViewerSupportedDomain.Fines,
      from_date: '23/09/2026',
      not_status: [
        InterfaceFileViewerFileStatus.Duplicate,
        InterfaceFileViewerFileStatus.Superseded,
        InterfaceFileViewerFileStatus.FailedSuperseded,
      ],
      not_target: [InterfaceFileViewerFileSource.Source],
      source: InterfaceFileViewerFileSource.SourceJson,
      target: 'SOURCE_JSON,TRANSFORMED_JSON',
      to_date: '06/10/2026',
      type: InterfaceFileViewerFileType.Opal,
    });
    expect(dateServiceMock.getDateRange).toHaveBeenCalledWith(13, 0, 'dd/MM/yyyy');
  });

  it('should include date range values when the date range filter is selected', () => {
    const formData: IFinesFinanceInboundFilesForm = {
      businessUnit: null,
      dateFilter: 'dateRange',
      days: '',
      dateFrom: '01/10/2026',
      dateTo: '05/10/2026',
      fileType: null,
      source: null,
    };

    const params = service.buildInboundFilesSearchParams(formData);

    expect(params).toEqual({
      domain: InterfaceFileViewerSupportedDomain.Fines,
      from_date: '01/10/2026',
      not_status: [
        InterfaceFileViewerFileStatus.Duplicate,
        InterfaceFileViewerFileStatus.Superseded,
        InterfaceFileViewerFileStatus.FailedSuperseded,
      ],
      not_target: [InterfaceFileViewerFileSource.Source],
      target: 'SOURCE_JSON,TRANSFORMED_JSON',
      to_date: '05/10/2026',
    });
  });
});
