import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import type { ICustomFileInterfaceViewerInboundTableWrapperTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/custom-inbound-file-viewer';
import type { IOpalFileHandlingInterfaceFile } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import type { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_FINANCE_INBOUND_FILES_STATUS_LABELS } from '../../constants/fines-finance-inbound-files-status-labels.constant';
import { FINES_FINANCE_INBOUND_FILES_DATE_TIME_FORMATS } from '../../constants/fines-finance-inbound-files-date-time-formats.constant';
import { FINES_FINANCE_INBOUND_FILES_TIMEZONE_PATTERN } from '../../constants/fines-finance-inbound-files-timezone-pattern.constant';
import type { IFinesFinanceInboundFilesTableOptions } from '../interfaces/fines-finance-inbound-files-table-options.interface';
import type { FinesFinanceInboundFileDateTime } from '../types/fines-finance-inbound-file-date-time.type';

/**
 * Resolves a reference label while retaining unknown or missing API values.
 * @param value - The code returned by the API.
 * @param options - Known names and values.
 * @returns The matching name or the original value.
 */
function getDisplayName(value: string | null, options: IAlphagovAccessibleAutocompleteItem[]): string | null {
  return options.find((option) => String(option.value) === value)?.name ?? value;
}

/**
 * Produces local display text and sortable milliseconds, treating unzoned API timestamps as UTC.
 * @param timestamp - An API timestamp, which may be invalid or missing.
 * @param dateService - Timestamp parser and formatter.
 * @returns A sort value and local display text, retaining invalid text for display.
 */
function getFileDateTime(timestamp: string | null, dateService: DateService): FinesFinanceInboundFileDateTime {
  const zonedTimestamp =
    timestamp && !FINES_FINANCE_INBOUND_FILES_TIMEZONE_PATTERN.test(timestamp) ? timestamp + 'Z' : timestamp;
  const dateTime = zonedTimestamp ? dateService.getFromIso(zonedTimestamp) : null;
  return {
    'Date and time': dateTime?.isValid ? dateTime.toMillis() : null,
    dateTimeDisplay: dateTime?.isValid
      ? dateService.toFormat(dateTime.setLocale('en-gb'), FINES_FINANCE_INBOUND_FILES_DATE_TIME_FORMATS.display)
      : timestamp,
  };
}

/**
 * Maps File Handling metadata to Finance table rows without changing the source data.
 * @param files - Returned files, or an absent list.
 * @param options - Business-unit, source and type labels.
 * @param dateService - Timestamp parser and local formatter.
 * @returns Localized table rows, or an empty array when no files were returned.
 */
export function mapInboundFilesToTableData(
  files: IOpalFileHandlingInterfaceFile[] | null | undefined,
  options: IFinesFinanceInboundFilesTableOptions,
  dateService: DateService,
): ICustomFileInterfaceViewerInboundTableWrapperTableData[] {
  return (
    files?.map((file) => ({
      'File ID': file.interface_file_id,
      ...getFileDateTime(file.created_datetime, dateService),
      Title: file.file_name,
      Type: getDisplayName(file.type, options.types),
      'Business unit':
        file.business_unit_codes?.map((code) => getDisplayName(code, options.businessUnits)).join(', ') ?? null,
      Source: getDisplayName(file.source, options.sources),
      Status: file.status ? (FINES_FINANCE_INBOUND_FILES_STATUS_LABELS[file.status] ?? file.status) : null,
      Actions: null,
    })) ?? []
  );
}
