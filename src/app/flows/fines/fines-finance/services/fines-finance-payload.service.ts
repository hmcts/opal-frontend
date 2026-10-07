import { inject, Injectable } from '@angular/core';
import {
  FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
  FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
} from '../constants/fines-finance-autocomplete.constant';
import {
  InterfaceFileViewerFileSource,
  InterfaceFileViewerFileType,
  InterfaceFileViewerSupportedDomain,
} from '../constants/fines-finance-enums.constant';
import { IFinesFinanceInboundFilesForm } from './interfaces/fines-finance-inbound-files-form.interface';
import { IFinesFinanceInterfaceFilesSearchParams } from './interfaces/fines-finance-interface-files-search-params.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

@Injectable({
  providedIn: 'root',
})
/**
 * Facade service for building Finance file-handling payload data.
 */
export class FinesFinancePayloadService {
  /**
   * Builds file-handling search parameters from the inbound interface files filter form.
   */

  readonly dateService = inject(DateService);

  private toBackendDateTime(value: string, time: 'T00:00:00' | 'T23:59:59'): string {
    const inputFormat = value.includes('/') ? 'dd/MM/yyyy' : 'yyyy-MM-dd';
    const ISODate = this.dateService.getFromFormatToFormat(value, inputFormat, 'yyyy-MM-dd');
    return `${ISODate}${time}`;
  }
  private buildDateFilterParams(
    formData: IFinesFinanceInboundFilesForm,
  ): Pick<IFinesFinanceInterfaceFilesSearchParams, 'from_date' | 'to_date'> {
    switch (formData.dateFilter) {
      case 'dateRange':
        console.log('Building date range filter params - daterange');
        return {
          ...(formData.dateFrom ? { from_date: this.toBackendDateTime(formData.dateFrom, 'T00:00:00') } : {}),
          ...(formData.dateTo ? { to_date: this.toBackendDateTime(formData.dateTo, 'T23:59:59') } : {}),
        };

      case 'customDays': {
        console.log('Building date range filter params - customDays');

        if (!formData.days) return {};
        const numberOfDays = parseInt(formData.days, 10);
        const { from, to } = this.dateService.getDateRange(numberOfDays - 1, 0, 'yyyy-MM-dd');
        return {
          from_date: this.toBackendDateTime(from, 'T00:00:00'),
          to_date: this.toBackendDateTime(to, 'T23:59:59'),
        };
      }

      case 'last7Days': {
        console.log('Building date range filter params - last7Days');

        const { from, to } = this.dateService.getDateRange(6, 0, 'yyyy-MM-dd');
        return {
          from_date: this.toBackendDateTime(from, 'T00:00:00'),
          to_date: this.toBackendDateTime(to, 'T23:59:59'),
        };
      }
      default:
        return {};
    }
  }

  private setParamIfNotAll<T extends keyof IFinesFinanceInterfaceFilesSearchParams>(
    params: IFinesFinanceInterfaceFilesSearchParams,
    key: T,
    value: string | null,
    allValue: string,
    transform: (value: string) => IFinesFinanceInterfaceFilesSearchParams[T],
  ): void {
    if (value && value !== allValue) {
      params[key] = transform(value);
    }
  }

  public buildInboundFilesSearchParams(
    formData: IFinesFinanceInboundFilesForm,
  ): IFinesFinanceInterfaceFilesSearchParams {
    const params: IFinesFinanceInterfaceFilesSearchParams = {
      domain: InterfaceFileViewerSupportedDomain.Fines,
      not_target: [],
      not_status: [],
      target: [],
      not_type: [InterfaceFileViewerFileSource.SourceJson],
      ...this.buildDateFilterParams(formData),
    };

    this.setParamIfNotAll(
      params,
      'business_unit_code',
      formData.businessUnit,
      FINES_FINANCE_INBOUND_FILES_ALL_BUSINESS_UNITS,
      (value) => value,
    );
    this.setParamIfNotAll(
      params,
      'source',
      formData.source,
      FINES_FINANCE_INBOUND_FILES_ALL_FILE_SOURCES,
      (value) => value as InterfaceFileViewerFileSource,
    );
    this.setParamIfNotAll(
      params,
      'type',
      formData.fileType,
      FINES_FINANCE_INBOUND_FILES_ALL_FILE_TYPES,
      (value) => value as InterfaceFileViewerFileType,
    );

    return params;
  }
}
