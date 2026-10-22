import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import type { ICustomFileInterfaceViewerOutboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-outbound-file-viewer';
import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import {
  getInterfaceFileDisplayName,
  mapInterfaceFileToTableData,
} from '../../services/utils/fines-finance-payload-map-interface-files.utils';
import { FINES_FINANCE_OUTBOUND_FILES_TARGET_OPTIONS } from '../constants/fines-finance-outbound-files-target-options.constant';

/**
 * Adds recipient labels to the shared Finance file metadata.
 * @param files - Returned files, or an absent list.
 * @param businessUnits - Reference names for business-unit codes.
 * @param dateService - Timestamp parser and local formatter.
 * @returns Localized rows for the outbound viewer.
 */
export function mapOutboundFilesToTableData(
  files: IOpalFileHandlingInterfaceFile[] | null | undefined,
  businessUnits: IAlphagovAccessibleAutocompleteItem[],
  dateService: DateService,
): ICustomFileInterfaceViewerOutboundTableWrapperTableData[] {
  return (
    files?.map((file) => ({
      ...mapInterfaceFileToTableData(file, businessUnits, dateService),
      Target: getInterfaceFileDisplayName(file.target, FINES_FINANCE_OUTBOUND_FILES_TARGET_OPTIONS),
    })) ?? []
  );
}
