import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';
import { FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT } from '../../fines-api-process-allocate/fines-api-process-tab/fines-api-process-files-table-wrapper/constants/fines-api-process-files-table-wrapper-content.constant';
import { IFinesApiProcessFilesTableWrapperTableData } from '../../fines-api-process-allocate/fines-api-process-tab/fines-api-process-files-table-wrapper/interfaces/fines-api-process-files-table-wrapper-table-data.interface';
import { FINES_API_INTERFACE_JOB_SOURCE_LABELS } from '../constants/fines-api-interface-job-source-labels.constant';

export const FINES_API_INTERFACE_JOBS_MAX_RESULTS = 500;

const DATE_UPLOADED_OUTPUT_FORMAT = "dd MMMM yyyy 'at' HH:mm";

/**
 * Maps an interface source code to the label shown on the Process tab.
 *
 * Unknown source values are returned unchanged so newly introduced sources remain visible.
 */
const formatSource = (source: string): string => {
  return FINES_API_INTERFACE_JOB_SOURCE_LABELS[source.trim().toUpperCase()] ?? source;
};

/**
 * Converts a UTC ISO timestamp into the local date/time label and numeric table sort value.
 */
const mapDateUploaded = (
  createdDatetime: string,
  dateService: DateService,
): Pick<IFinesApiProcessFilesTableWrapperTableData, 'Date uploaded' | 'dateUploadedDisplay'> => {
  const parsedDate = dateService.getFromIso(createdDatetime);

  if (!parsedDate.isValid) {
    return {
      [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.dateUploaded]: 0,
      dateUploadedDisplay: createdDatetime || FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.unavailableDate,
    };
  }

  return {
    [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.dateUploaded]: parsedDate.toMillis(),
    dateUploadedDisplay: dateService.toFormat(parsedDate.setLocale('en-gb'), DATE_UPLOADED_OUTPUT_FORMAT),
  };
};

/**
 * Extracts interface jobs from the API response and applies the frontend result cap.
 */
export const extractInterfaceJobs = (response: unknown): IOpalFinesInterfaceJobSummary[] => {
  if (!response || typeof response !== 'object') {
    return [];
  }

  const interfaceJobs = (response as Partial<IOpalFinesInterfaceJobsSummaryResponse>).interface_jobs;

  return Array.isArray(interfaceJobs) ? interfaceJobs.slice(0, FINES_API_INTERFACE_JOBS_MAX_RESULTS) : [];
};

/**
 * Maps raw interface job summaries into sortable Process table rows.
 *
 * The API response order is retained until a user explicitly selects a sortable table header.
 */
export const mapInterfaceJobs = (
  interfaceJobs: IOpalFinesInterfaceJobSummary[],
  dateService: DateService,
): IFinesApiProcessFilesTableWrapperTableData[] => {
  return interfaceJobs.slice(0, FINES_API_INTERFACE_JOBS_MAX_RESULTS).map((interfaceJob) => ({
    [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.fileName]: interfaceJob.file_name,
    [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.source]: formatSource(interfaceJob.source),
    [FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.columns.businessUnit]: interfaceJob.business_unit_name,
    ...mapDateUploaded(interfaceJob.created_datetime, dateService),
    interfaceJobId: interfaceJob.interface_job_id.toString(),
    interfaceFileId: interfaceJob.interface_file_id.toString(),
    status: interfaceJob.status,
  }));
};
