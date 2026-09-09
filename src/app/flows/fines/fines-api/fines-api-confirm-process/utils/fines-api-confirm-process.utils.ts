import { IOpalFinesBusinessUnitOutstandingAutoPaymentCount } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-count.interface';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { IOpalFinesProcessInterfaceJobsPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-process-interface-jobs-payload.interface';
import { FINES_API_INTERFACE_JOB_SOURCE_LABELS } from '../../services/constants/fines-api-interface-job-source-labels.constant';
import { IFinesApiConfirmProcessBusinessUnitSummary } from '../interfaces/fines-api-confirm-process-business-unit-summary.interface';
import { IFinesApiConfirmProcessInterfaceJob } from '../interfaces/fines-api-confirm-process-interface-job.interface';

/** Returns the retained interface files selected on the Process tab, in API response order. */
export const getSelectedInterfaceJobs = (
  interfaceJobs: IOpalFinesInterfaceJobSummary[] | null,
  selectedFileIds: string[],
): IOpalFinesInterfaceJobSummary[] => {
  const selectedFileIdSet = new Set(selectedFileIds);

  return (interfaceJobs ?? []).filter(({ interface_file_id: interfaceFileId }) =>
    selectedFileIdSet.has(interfaceFileId.toString()),
  );
};

/** Identifies every backend source code displayed as DWP/AEA by the Process journey. */
export const isDwpAeaSource = (source: string): boolean =>
  FINES_API_INTERFACE_JOB_SOURCE_LABELS[source.trim().toUpperCase()] === 'DWP/AEA';

/**
 * Returns every non-DWP/AEA file and only DWP/AEA files that remain selected on confirmation.
 */
export const getInterfaceJobsToProcess = (
  interfaceJobs: IFinesApiConfirmProcessInterfaceJob[],
  overrideInhibitFileIds: ReadonlySet<string>,
): IFinesApiConfirmProcessInterfaceJob[] =>
  interfaceJobs.filter(
    (interfaceJob) =>
      !isDwpAeaSource(interfaceJob.source) || overrideInhibitFileIds.has(interfaceJob.interface_file_id.toString()),
  );

/**
 * Adds the business-unit ID omitted by the summary API by matching each row to the selected
 * business-unit resolver data. Ambiguous or missing names are left out so the route guard can
 * prevent an invalid processing request.
 */
export const enrichInterfaceJobsWithBusinessUnitIds = (
  interfaceJobs: IOpalFinesInterfaceJobSummary[],
  businessUnits: IOpalFinesBusinessUnitOutstandingAutoPaymentCount[],
): IFinesApiConfirmProcessInterfaceJob[] => {
  const businessUnitIdsByName = new Map<string, number | null>();

  businessUnits.forEach(({ business_unit_id: businessUnitId, business_unit_name: businessUnitName }) => {
    const existingBusinessUnitId = businessUnitIdsByName.get(businessUnitName);

    businessUnitIdsByName.set(
      businessUnitName,
      existingBusinessUnitId === undefined || existingBusinessUnitId === businessUnitId ? businessUnitId : null,
    );
  });

  return interfaceJobs.flatMap((interfaceJob) => {
    const businessUnitId = businessUnitIdsByName.get(interfaceJob.business_unit_name);

    return typeof businessUnitId === 'number' ? [{ ...interfaceJob, businessUnitId }] : [];
  });
};

/** Groups selected files by business unit and sorts the resulting rows alphabetically. */
export const buildBusinessUnitSummary = (
  interfaceJobs: IFinesApiConfirmProcessInterfaceJob[],
): IFinesApiConfirmProcessBusinessUnitSummary[] => {
  const businessUnitSummaryById = new Map<number, IFinesApiConfirmProcessBusinessUnitSummary>();

  interfaceJobs.forEach(({ businessUnitId, business_unit_name: businessUnitName }) => {
    const existingSummary = businessUnitSummaryById.get(businessUnitId);

    businessUnitSummaryById.set(businessUnitId, {
      businessUnitId,
      businessUnitName,
      fileCount: (existingSummary?.fileCount ?? 0) + 1,
    });
  });

  return Array.from(businessUnitSummaryById.values()).sort(
    (first, second) =>
      first.businessUnitName.localeCompare(second.businessUnitName, 'en-GB') ||
      first.businessUnitId - second.businessUnitId,
  );
};

/** Builds the unique job payload, excluding unchecked DWP/AEA files from processing. */
export const buildProcessInterfaceJobsPayload = (
  interfaceJobs: IFinesApiConfirmProcessInterfaceJob[],
  overrideInhibitFileIds: ReadonlySet<string>,
): IOpalFinesProcessInterfaceJobsPayload => {
  const interfaceJobsById = new Map<number, IOpalFinesProcessInterfaceJobsPayload['interface_jobs'][number]>();

  getInterfaceJobsToProcess(interfaceJobs, overrideInhibitFileIds).forEach((interfaceJob) => {
    const overrideInhibits =
      isDwpAeaSource(interfaceJob.source) && overrideInhibitFileIds.has(interfaceJob.interface_file_id.toString());
    const existingJob = interfaceJobsById.get(interfaceJob.interface_job_id);

    if (existingJob) {
      existingJob.override_inhibits ||= overrideInhibits;
      return;
    }

    interfaceJobsById.set(interfaceJob.interface_job_id, {
      business_unit_id: interfaceJob.businessUnitId,
      interface_job_id: interfaceJob.interface_job_id,
      override_inhibits: overrideInhibits,
    });
  });

  return { interface_jobs: Array.from(interfaceJobsById.values()) };
};
