import type { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer/interfaces';
import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import {
  getInterfaceFileDisplayName,
  mapInterfaceFileToTableData,
} from '../../services/utils/fines-finance-payload-map-interface-files.utils';
import type { IFinesFinanceInboundFilesTableOptions } from '../interfaces/fines-finance-inbound-files-table-options.interface';

/**
 * Adds Finance source and type labels to the shared file metadata.
 * @param files - Returned files, or an absent list.
 * @param options - Business-unit, source and type labels.
 * @param dateService - Timestamp parser and local formatter.
 * @returns Localized rows for the inbound viewer.
 */
export function mapInboundFilesToTableData(
  files: IOpalFileHandlingInterfaceFile[] | null | undefined,
  options: IFinesFinanceInboundFilesTableOptions,
  dateService: DateService,
): ICustomFileInterfaceViewerInboundTableWrapperTableData[] {
  return (
    files?.map((file) => ({
      ...mapInterfaceFileToTableData(file, options.businessUnits, dateService),
      Type: getInterfaceFileDisplayName(file.type, options.types),
      Source: getInterfaceFileDisplayName(file.source, options.sources),
    })) ?? []
  );
}
