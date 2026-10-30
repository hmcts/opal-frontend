import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type { IOpalFileHandlingInterfaceFileParams } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import type { IFinesFinanceInterfaceFilesForm } from '../../interfaces/fines-finance-interface-files-form.interface';
import { buildInterfaceFilesFilters } from '../../services/utils/fines-finance-payload-build-interface-files-filters.utils';
import { FINES_FINANCE_OUTBOUND_FILES_SEARCH_SCOPE } from '../constants/fines-finance-outbound-files-search-scope.constant';

/**
 * Limits searches to files originating in Opal for external recipients.
 * The API business-unit predicate excludes files without a unit, so unit selection
 * is applied to the returned metadata instead.
 * @param formData - Current business-unit and date selections.
 * @param dateService - Calendar parser and formatter.
 * @returns Outbound restrictions and date filters, including files without a unit.
 */
export function buildOutboundFilesSearchParams(
  formData: IFinesFinanceInterfaceFilesForm,
  dateService: DateService,
): IOpalFileHandlingInterfaceFileParams {
  return {
    ...FINES_FINANCE_OUTBOUND_FILES_SEARCH_SCOPE,
    not_status: [...FINES_FINANCE_OUTBOUND_FILES_SEARCH_SCOPE.not_status],
    ...buildInterfaceFilesFilters({ ...formData, businessUnit: null }, dateService),
  };
}
