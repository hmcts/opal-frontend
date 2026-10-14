import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';
import { IOpalFinesTillsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-tills-response.interface';
import { IFinesApiAllocateData } from '../../fines-api-process-allocate/fines-api-allocate-tab/interfaces/fines-api-allocate-data.interface';
import { FINES_API_INTERFACE_JOB_SOURCE_LABELS } from '../constants/fines-api-interface-job-source-labels.constant';

const UNAVAILABLE = '—';
const DATE_FORMAT = "dd MMMM yyyy 'at' HH:mm";

/** Rejects unusable IDs rather than assigning an ambiguous selection/navigation key. */
const mapTillId = (id: number | string): string => {
  if (typeof id === 'number' && (!Number.isSafeInteger(id) || id < 0)) {
    throw new Error('Invalid till identifier in Get Tills response');
  }
  if (!/^\d+$/.test(String(id))) {
    throw new Error('Invalid till identifier in Get Tills response');
  }
  return String(id);
};

const formatDate = (value: string | null | undefined, dateService: DateService): string => {
  if (!value) {
    return UNAVAILABLE;
  }
  const date = dateService.getFromIso(value);
  return date.isValid ? dateService.toFormat(date.setLocale('en-gb'), DATE_FORMAT) : UNAVAILABLE;
};

/**
 * Maps complete, BU/status-filtered endpoint responses without the Process tab's row cap.
 * Each returned processing job represents one file; business-unit names are unique.
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
      tillNumber: String(till.till_number),
      errorsDisplay: till.errors == null ? UNAVAILABLE : String(till.errors),
      fileName: till.file_name || UNAVAILABLE,
      sourceLabel: till.source
        ? (FINES_API_INTERFACE_JOB_SOURCE_LABELS[till.source.trim().toUpperCase()] ?? till.source)
        : UNAVAILABLE,
      amount: till.amount,
      businessUnitName: till.business_unit_name,
      processedByDisplay: till.processed_by,
      dateProcessedDisplay: formatDate(till.date_processed, dateService),
    })),
  };
};
