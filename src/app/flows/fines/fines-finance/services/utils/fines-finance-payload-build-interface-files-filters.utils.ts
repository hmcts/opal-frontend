import { AbstractReportSummaryListBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base';
import { ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';
import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type { IOpalFileHandlingInterfaceFileParams } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import { FINES_FINANCE_INTERFACE_FILES_DATE_FILTER_CONFIG } from '../../constants/fines-finance-interface-files-date-filter-config.constant';
import type { IFinesFinanceInterfaceFilesForm } from '../../interfaces/fines-finance-interface-files-form.interface';

/**
 * Converts shared local calendar filters into inclusive UTC API boundaries.
 * @param formData - Current business-unit and date selections.
 * @param dateService - Calendar parser and formatter.
 * @returns Optional search parameters, omitting blank selections.
 */
export function buildInterfaceFilesFilters(
  formData: IFinesFinanceInterfaceFilesForm,
  dateService: DateService,
): IOpalFileHandlingInterfaceFileParams {
  const params: IOpalFileHandlingInterfaceFileParams = {};
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
        FINES_FINANCE_INTERFACE_FILES_DATE_FILTER_CONFIG.utcTimestampFormat,
      );
    }
    if (toDate) {
      params.to_date =
        dateService.toFormat(
          dateService.getFromIso(toDate).endOf('day').toUTC(),
          FINES_FINANCE_INTERFACE_FILES_DATE_FILTER_CONFIG.utcTimestampFormat,
        ) + FINES_FINANCE_INTERFACE_FILES_DATE_FILTER_CONFIG.inclusiveEndFraction;
    }
  }
  if (formData.businessUnit) params.business_unit_code = formData.businessUnit;
  return params;
}
