import { AbstractReportSummaryListBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base';
import { ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';
import type { IOpalFileHandlingInterfaceFileParams } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_FINANCE_INBOUND_FILES_DATE_FILTER_CONFIG } from '../../constants/fines-finance-inbound-files-date-filter-config.constant';
import { FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE } from '../../constants/fines-finance-inbound-files-search-scope.constant';
import type { IFinesFinanceInboundFilesForm } from '../interfaces/fines-finance-inbound-files-form.interface';

/**
 * Builds inbound criteria by converting local report calendar boundaries to inclusive UTC API timestamps.
 * The upper boundary includes the selected local day's final database microsecond.
 * @param formData - Current filter values, with date-range inputs in DD/MM/YYYY format.
 * @param dateService - Date calculator and formatter passed to the shared report helper.
 * @returns Independent parameters with offset-free UTC timestamps and blank optional selections omitted.
 */
export function buildInboundFilesSearchParams(
  formData: IFinesFinanceInboundFilesForm,
  dateService: DateService,
): IOpalFileHandlingInterfaceFileParams {
  const params: IOpalFileHandlingInterfaceFileParams = {
    ...FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE,
    type: [...FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE.type],
    not_status: [...FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE.not_status],
  };
  if (formData.dateFilter && (formData.dateFilter !== ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS || formData.days)) {
    const { fromDate, toDate } = AbstractReportSummaryListBaseComponent.getReportQueryFromFilters(
      {
        dateFilter: formData.dateFilter,
        days: formData.days ?? '',
        dateFrom: formData.dateFrom ?? '',
        dateTo: formData.dateTo ?? '',
      },
      dateService,
    );
    if (fromDate) {
      params.from_date = dateService.toFormat(
        dateService.getFromIso(fromDate).startOf('day').toUTC(),
        FINES_FINANCE_INBOUND_FILES_DATE_FILTER_CONFIG.utcTimestampFormat,
      );
    }
    if (toDate) {
      params.to_date =
        dateService.toFormat(
          dateService.getFromIso(toDate).endOf('day').toUTC(),
          FINES_FINANCE_INBOUND_FILES_DATE_FILTER_CONFIG.utcTimestampFormat,
        ) + FINES_FINANCE_INBOUND_FILES_DATE_FILTER_CONFIG.inclusiveEndFraction;
    }
  }
  if (formData.businessUnit) params.business_unit_code = formData.businessUnit;
  if (formData.source) params.source = formData.source;
  if (formData.fileType) params.type = [formData.fileType];
  return params;
}
