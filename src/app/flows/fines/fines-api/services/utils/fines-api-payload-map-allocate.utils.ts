import { FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT } from '../../fines-api-process-allocate/fines-api-allocate-tab/fines-api-allocate-tills-table-wrapper/constants/fines-api-allocate-tills-table-wrapper-content.constant';
import { IFinesApiAllocateTillsTableWrapperTableData } from '../../fines-api-process-allocate/fines-api-allocate-tab/fines-api-allocate-tills-table-wrapper/interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';
import { IOpalFinesTillsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-tills-response.interface';
import { IFinesApiAllocateData } from '../../fines-api-process-allocate/fines-api-allocate-tab/interfaces/fines-api-allocate-data.interface';
import { FINES_API_INTERFACE_JOB_SOURCE_LABELS } from '../constants/fines-api-interface-job-source-labels.constant';

const UNAVAILABLE = '—';
const DATE_FORMAT = "dd MMMM yyyy 'at' HH:mm";

/**
 * Converts a till identifier to a stable selection and navigation key without losing string precision.
 *
 * @param id The numeric or digit-only string identifier supplied by the API.
 * @returns The validated identifier as a string.
 * @throws Error when the identifier is negative, fractional, unsafe as a number or not digit-only.
 */
const mapTillId = (id: number | string): string => {
  if (typeof id === 'number' && (!Number.isSafeInteger(id) || id < 0)) {
    throw new Error('Invalid till identifier in Get Tills response');
  }
  if (!/^\d+$/.test(String(id))) {
    throw new Error('Invalid till identifier in Get Tills response');
  }
  return String(id);
};

/**
 * Maps an ISO timestamp to a chronological sort value and a separately formatted display label.
 *
 * @param value The processing timestamp supplied by the API, which may be absent.
 * @param dateService The shared service used to parse and format dates.
 * @returns Epoch milliseconds and the display label, or zero and an em dash for missing or invalid dates.
 */
const mapDateProcessed = (
  value: string | null | undefined,
  dateService: DateService,
): Pick<IFinesApiAllocateTillsTableWrapperTableData, 'Date processed' | 'dateProcessedDisplay'> => {
  if (!value) {
    return {
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.dateProcessed]: 0,
      dateProcessedDisplay: UNAVAILABLE,
    };
  }
  const date = dateService.getFromIso(value);
  return {
    [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.dateProcessed]: date.isValid ? date.toMillis() : 0,
    dateProcessedDisplay: date.isValid ? dateService.toFormat(date.setLocale('en-gb'), DATE_FORMAT) : UNAVAILABLE,
  };
};

/**
 * Maps complete, BU/status-filtered endpoint responses without the Process tab's row cap.
 * Each returned processing job represents one file; business-unit names are unique.
 *
 * @param jobsResponse Processing jobs already filtered to the selected business units and status.
 * @param tillsResponse Eligible automatic-payment tills in the backend's default display order.
 * @param dateService The shared service used to derive date sort values and display labels.
 * @returns Processing totals, alphabetically ordered business-unit counts and sortable till rows in API order.
 * @throws Error when a till has an unusable identifier.
 */
export const mapAllocateData = (
  jobsResponse: IOpalFinesInterfaceJobsSummaryResponse,
  tillsResponse: IOpalFinesTillsResponse,
  dateService: DateService,
): IFinesApiAllocateData => {
  const counts = new Map<string, number>();
  for (const job of jobsResponse.interface_jobs) {
    counts.set(job.business_unit_name, (counts.get(job.business_unit_name) ?? 0) + 1);
  }

  return {
    processingTotal: jobsResponse.interface_jobs.length,
    processingByBusinessUnit: Array.from(counts, ([businessUnitName, count]) => ({ businessUnitName, count })).sort(
      (left, right) => left.businessUnitName.localeCompare(right.businessUnitName, 'en-GB'),
    ),
    tills: tillsResponse.tills.map((till) => ({
      tillId: mapTillId(till.till_id),
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.tillNumber]: till.till_number,
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.errors]: till.errors ?? null,
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.fileName]: till.file_name || UNAVAILABLE,
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.source]: till.source
        ? (FINES_API_INTERFACE_JOB_SOURCE_LABELS[till.source.trim().toUpperCase()] ?? till.source)
        : UNAVAILABLE,
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.amount]: Number(till.amount),
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.businessUnit]: till.business_unit_name,
      [FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.columns.processedBy]: till.processed_by,
      ...mapDateProcessed(till.date_processed, dateService),
    })),
  };
};
