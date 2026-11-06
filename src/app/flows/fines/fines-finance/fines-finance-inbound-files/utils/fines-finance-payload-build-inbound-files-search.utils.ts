import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type { IOpalFileHandlingInterfaceFileParams } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import { buildInterfaceFilesFilters } from '../../services/utils/fines-finance-payload-build-interface-files-filters.utils';
import { FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE } from '../constants/fines-finance-inbound-files-search-scope.constant';
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
    ...buildInterfaceFilesFilters(formData, dateService),
    type: [...FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE.type],
    not_status: [...FINES_FINANCE_INBOUND_FILES_SEARCH_SCOPE.not_status],
  };
  if (formData.source) params.source = formData.source;
  if (formData.fileType) params.type = [formData.fileType];
  return params;
}
