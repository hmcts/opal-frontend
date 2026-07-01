import { DateTime } from 'luxon';
import { IOpalFinesReportInstance } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance.interface';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import { IFinesReportsSummaryListTableData } from '../interfaces/fines-reports-summary-list-table-data.interface';

const getCreatedDate = (instance: IOpalFinesReportInstance): string => {
  return instance.created_at ?? instance.created_timestamp ?? instance.requested_at ?? '';
};

export const getReportInstancesFromResponse = (
  response: IOpalFinesReportInstancesResponse | IOpalFinesReportInstance[] | null | undefined,
): IOpalFinesReportInstance[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  return response.report_instances ?? response.instances ?? response.refData ?? [];
};

export const getReportInstancesCountFromResponse = (
  response: IOpalFinesReportInstancesResponse | IOpalFinesReportInstance[] | null | undefined,
): number => {
  if (!response || Array.isArray(response)) {
    return Array.isArray(response) ? response.length : 0;
  }

  return response.count ?? response.total_count ?? response.total ?? getReportInstancesFromResponse(response).length;
};

export const getReportInstancesLimitFromResponse = (
  response: IOpalFinesReportInstancesResponse | IOpalFinesReportInstance[] | null | undefined,
): number | null => {
  if (!response || Array.isArray(response)) {
    return null;
  }

  return response.max_results ?? response.limit ?? null;
};

export const isReportInstancesOverLimit = (
  response: IOpalFinesReportInstancesResponse | IOpalFinesReportInstance[] | null | undefined,
): boolean => {
  if (!response || Array.isArray(response)) {
    return false;
  }

  const limit = getReportInstancesLimitFromResponse(response);
  const count = getReportInstancesCountFromResponse(response);

  return response.has_more === true || (limit !== null && count > limit);
};

export const getReportInstanceDisplayStatus = (instance: IOpalFinesReportInstance): string => {
  const status = instance.generation_status ?? instance.status ?? '';
  const records = instance.number_of_records ?? instance.no_of_records;

  if (status === 'REQUESTED') {
    return 'In progress';
  }

  if (status === 'READY' && records === 0) {
    return 'No content';
  }

  if (status === 'IN_PROGRESS') {
    return 'In progress';
  }

  return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
};

export const mapReportInstancesToTableData = (
  instances: IOpalFinesReportInstance[],
): IFinesReportsSummaryListTableData[] => {
  return instances.map((instance) => {
    const createdDate = getCreatedDate(instance);
    const parsedDate = DateTime.fromISO(createdDate);
    const dateTimeDisplay = parsedDate.isValid
      ? parsedDate.setLocale('en-gb').toFormat("dd MMM yyyy 'at' HH:mm")
      : createdDate;
    const businessUnits = instance.business_units?.length ? instance.business_units.join(', ') : null;

    return {
      'Date and time': parsedDate.isValid ? parsedDate.toMillis() : 0,
      Title: instance.report_name ?? instance.name ?? '',
      'Business unit': businessUnits ?? instance.business_unit ?? '',
      'Created by': instance.requested_by_name ?? instance.created_by ?? '',
      Status: getReportInstanceDisplayStatus(instance),
      instanceId: instance.instance_id.toString(),
      dateTimeDisplay,
      isDownloadable: instance.is_downloadable ?? false,
      supportedTypes: (instance.supported_types ?? instance.supported_file_types ?? []).join(','),
    };
  });
};
