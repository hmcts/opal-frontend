import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';
import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

import { FINES_FINANCE_INTERFACE_FILES_DATE_TIME_FORMATS } from '../../constants/fines-finance-interface-files-date-time-formats.constant';
import { FINES_FINANCE_INTERFACE_FILES_STATUS_LABELS } from '../../constants/fines-finance-interface-files-status-labels.constant';
import { FINES_FINANCE_INTERFACE_FILES_TIMEZONE_PATTERN } from '../../constants/fines-finance-interface-files-timezone-pattern.constant';
import type { FinesFinanceInterfaceFileDateTime } from '../../types/fines-finance-interface-file-date-time.type';
import { canDownloadInterfaceFile } from './fines-finance-interface-file-download.utils';

/**
 * Resolves a reference label while retaining unknown or missing API values.
 * @param value - The code returned by the API.
 * @param options - Known names and values.
 * @returns The matching name or the original value.
 */
export function getInterfaceFileDisplayName(
  value: string | null,
  options: IAlphagovAccessibleAutocompleteItem[],
): string | null {
  return options.find((option) => String(option.value) === value)?.name ?? value;
}

/**
 * Produces local display text and sortable milliseconds, treating unzoned API timestamps as UTC.
 * @param timestamp - An API timestamp, which may be invalid or missing.
 * @param dateService - Timestamp parser and formatter.
 * @returns A sort value and local display text, retaining invalid text for display.
 */
function getFileDateTime(timestamp: string | null, dateService: DateService): FinesFinanceInterfaceFileDateTime {
  const dateTime = timestamp
    ? dateService.getFromIso(
        FINES_FINANCE_INTERFACE_FILES_TIMEZONE_PATTERN.test(timestamp) ? timestamp : timestamp + 'Z',
      )
    : null;
  return {
    'Date and time': dateTime?.isValid ? dateTime.toMillis() : null,
    dateTimeDisplay: dateTime?.isValid
      ? dateService.toFormat(dateTime.setLocale('en-gb'), FINES_FINANCE_INTERFACE_FILES_DATE_TIME_FORMATS.display)
      : timestamp,
  };
}

/**
 * Maps metadata shared by inbound and outbound Finance file rows.
 * @param file - File metadata returned by the service.
 * @param businessUnits - Reference names for business-unit codes.
 * @param dateService - Timestamp parser and local formatter.
 * @returns Common cells with Download or an empty action label for sorting, retaining files without a business unit.
 */
export function mapInterfaceFileToTableData(
  file: IOpalFileHandlingInterfaceFile,
  businessUnits: IAlphagovAccessibleAutocompleteItem[],
  dateService: DateService,
): ICustomFileInterfaceViewerTableData {
  const status = file.status ? (FINES_FINANCE_INTERFACE_FILES_STATUS_LABELS[file.status] ?? file.status) : null;
  return {
    'File ID': file.interface_file_id,
    ...getFileDateTime(file.created_datetime, dateService),
    Title: file.file_name,
    'Business unit':
      file.business_unit_codes?.map((code) => getInterfaceFileDisplayName(code, businessUnits)).join(', ') ?? null,
    Status: status,
    Actions: canDownloadInterfaceFile({ 'File ID': file.interface_file_id, Status: status }) ? 'Download' : '',
  };
}
