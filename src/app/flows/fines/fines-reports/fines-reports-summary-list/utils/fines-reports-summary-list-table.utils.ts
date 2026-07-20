import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { AbstractReportSummaryListBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IOpalFinesReportInstance } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance.interface';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import { IFinesReportsSummaryListTableData } from '../interfaces/fines-reports-summary-list-table-data.interface';

type BusinessUnitLike = {
  business_unit_id?: string | number;
  business_unit_code?: string | number;
  businessUnitId?: string | number;
  businessUnitCode?: string | number;
  business_unit_name?: string;
  businessUnitName?: string;
  name?: string;
};

type BusinessUnitsDetailsLike = {
  business_unit_id?: string | number;
  business_unit_code?: string | number;
  business_unit_name?: string;
};

const getCreatedDate = (instance: IOpalFinesReportInstance): string => {
  return (
    instance.created_at ??
    instance.created_timestamp ??
    instance.generatedAt ??
    instance.requested_at ??
    instance.requestedAt ??
    ''
  );
};

const getBusinessUnitNameByValue = (
  value: string | number,
  businessUnitRefData?: IOpalFinesBusinessUnit[],
): string | number => {
  const match = businessUnitRefData?.find(
    (businessUnit) =>
      businessUnit.business_unit_id.toString() === value.toString() ||
      businessUnit.business_unit_code.toString() === value.toString(),
  );

  return match?.business_unit_name ?? value;
};

const getBusinessUnitValue = (
  businessUnit: string | number | BusinessUnitLike | BusinessUnitsDetailsLike,
  businessUnitRefData?: IOpalFinesBusinessUnit[],
): string | number | null => {
  if (typeof businessUnit === 'string' || typeof businessUnit === 'number') {
    return getBusinessUnitNameByValue(businessUnit, businessUnitRefData);
  }

  const businessUnitData = businessUnit as BusinessUnitLike;
  const explicitName =
    businessUnitData.business_unit_name ?? businessUnitData.businessUnitName ?? businessUnitData.name ?? null;

  if (explicitName) {
    return explicitName;
  }

  const explicitId =
    businessUnitData.business_unit_id ??
    businessUnitData.businessUnitId ??
    businessUnitData.business_unit_code ??
    businessUnitData.businessUnitCode ??
    null;

  return explicitId !== null ? getBusinessUnitNameByValue(explicitId, businessUnitRefData) : null;
};

const getBusinessUnits = (
  instance: IOpalFinesReportInstance,
  businessUnitRefData?: IOpalFinesBusinessUnit[],
): string => {
  if (
    instance.business_units?.length &&
    instance.business_units.every((businessUnit) => typeof businessUnit === 'string')
  ) {
    return instance.business_units
      .map((businessUnit) => getBusinessUnitNameByValue(businessUnit, businessUnitRefData))
      .join(', ');
  }

  if (instance.business_units?.length) {
    return instance.business_units
      .map((businessUnit) => getBusinessUnitValue(businessUnit, businessUnitRefData))
      .filter(
        (businessUnit): businessUnit is string | number =>
          typeof businessUnit === 'string' || typeof businessUnit === 'number',
      )
      .join(', ');
  }

  if (instance.businessUnits?.length) {
    return instance.businessUnits
      .map((businessUnit) => getBusinessUnitValue(businessUnit, businessUnitRefData))
      .filter(
        (businessUnit): businessUnit is string | number =>
          typeof businessUnit === 'string' || typeof businessUnit === 'number',
      )
      .join(', ');
  }

  if (instance.business_units_details?.length) {
    return instance.business_units_details
      .map((businessUnit) => getBusinessUnitValue(businessUnit, businessUnitRefData))
      .filter(
        (businessUnit): businessUnit is string | number =>
          typeof businessUnit === 'string' || typeof businessUnit === 'number',
      )
      .join(', ');
  }

  return instance.business_unit ?? '';
};

const getStatusCode = (instance: IOpalFinesReportInstance): string => {
  const status = instance.generation_status ?? instance.status ?? '';

  return typeof status === 'string' ? status : (status.code ?? '');
};

const getStatusDisplayName = (instance: IOpalFinesReportInstance): string => {
  const status = instance.status;

  return typeof status === 'object' && status ? (status.displayName ?? status.display_name ?? '') : '';
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

/**
 * Gets the total report instance count from any supported report instance response shape.
 *
 * @param response - The report instance response to read.
 * @returns The total report instance count.
 */
export const getReportInstancesCountFromResponse = (
  response: IOpalFinesReportInstancesResponse | IOpalFinesReportInstance[] | null | undefined,
): number => {
  if (!response || Array.isArray(response)) {
    return Array.isArray(response) ? response.length : 0;
  }

  return response.count ?? response.total_count ?? response.total ?? getReportInstancesFromResponse(response).length;
};

/**
 * Gets the maximum report instance result limit from any supported report instance response shape.
 *
 * @param response - The report instance response to read.
 * @returns The report instance result limit, or null when the response has no limit.
 */
export const getReportInstancesLimitFromResponse = (
  response: IOpalFinesReportInstancesResponse | IOpalFinesReportInstance[] | null | undefined,
): number | null => {
  if (!response || Array.isArray(response)) {
    return null;
  }

  return response.max_results ?? response.limit ?? null;
};

/**
 * Checks whether a report instance response indicates additional results are available.
 *
 * @param response - The report instance response to check.
 * @returns True when the response is over the result limit, otherwise false.
 */
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

const getFinesReportInstanceDisplayStatus = (instance: IOpalFinesReportInstance): string => {
  const status = getStatusCode(instance);
  const records = instance.number_of_records ?? instance.no_of_records ?? instance.numberOfRecords;
  const displayName = getStatusDisplayName(instance);

  return AbstractReportSummaryListBaseComponent.getReportInstanceDisplayStatus(status, records, displayName);
};

/**
 * Maps report instance API response rows into the sortable table row shape used by the Fines reports summary list.
 *
 * @param instances - The report instances to map.
 * @param businessUnitRefData - The business unit reference data used to resolve business unit ids and codes.
 * @param dateService - The date service used to format the created date display value.
 * @returns The report instances mapped into Fines reports summary list table rows.
 */
export const mapReportInstancesToTableData = (
  instances: IOpalFinesReportInstance[],
  businessUnitRefData?: IOpalFinesBusinessUnit[],
  dateService?: DateService,
): IFinesReportsSummaryListTableData[] => {
  return instances.map((instance) => {
    const createdDate = getCreatedDate(instance);
    const parsedDate = dateService?.getFromIso(createdDate);
    const dateTimeDisplay =
      dateService && parsedDate?.isValid
        ? dateService.toFormat(parsedDate.setLocale('en-gb'), "dd MMM yyyy 'at' HH:mm")
        : createdDate;

    return {
      'Date and time': parsedDate?.isValid ? parsedDate.toMillis() : 0,
      Title: instance.report_name ?? instance.name ?? '',
      'Business unit': getBusinessUnits(instance, businessUnitRefData),
      'Created by':
        instance.requested_by_name ??
        instance.requested_by?.name ??
        instance.requestedBy?.name ??
        instance.created_by ??
        '',
      Status: getFinesReportInstanceDisplayStatus(instance),
      instanceId: (instance.instance_id ?? instance.instanceId ?? '').toString(),
      dateTimeDisplay,
      isDownloadable: instance.is_downloadable ?? instance.isDownloadable ?? false,
      supportedTypes: (
        instance.supported_types ??
        instance.supported_file_types ??
        instance.supportedFileTypes ??
        []
      ).join(','),
    };
  });
};
