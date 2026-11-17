import { DateTime } from 'luxon';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';
import { IFinesApiIgnoredData } from '../../fines-api-process-allocate/fines-api-ignored-tab/interfaces/fines-api-ignored-data.interface';
import { FINES_API_IGNORED_TIME_ZONE } from './fines-api-ignored-dates.utils';

/**
 * Maps all ignored jobs in backend order, using the same source lookup as Process and Allocate.
 * @param response Raw ignored jobs response from the backend.
 * @param dateService Service for formatting dates.
 * @param sourceLabels Resolved source codes and their display names.
 * @returns Ignored rows with source display names.
 */
export const mapIgnoredData = (
  response: IOpalFinesInterfaceJobsSummaryResponse,
  dateService: DateService,
  sourceLabels: ReadonlyMap<string, string>,
): IFinesApiIgnoredData => ({
  rows: response.interface_jobs.map((job) => {
    // Offset-free endpoint timestamps represent UK wall time, independent of the browser/SSR timezone.
    const completed = DateTime.fromISO(job.completed_datetime ?? '', { zone: FINES_API_IGNORED_TIME_ZONE });
    return {
      interfaceJobId: String(job.interface_job_id),
      interfaceFileId: String(job.interface_file_id),
      'File name': job.file_name,
      Source: sourceLabels.get(job.source.trim().toUpperCase()) ?? job.source,
      'Business unit': job.business_unit_name,
      'Date processed': completed.isValid ? completed.toMillis() : 0,
      dateProcessedDisplay: completed.isValid
        ? dateService.toFormat(completed.setLocale('en-gb'), "dd MMMM yyyy 'at' HH:mm")
        : '—',
    };
  }),
});
