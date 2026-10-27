import { inject, Injectable } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { IFinesApiProcessFilesTableWrapperTableData } from '../fines-api-process-allocate/fines-api-process-tab/fines-api-process-files-table-wrapper/interfaces/fines-api-process-files-table-wrapper-table-data.interface';
import { extractInterfaceJobs, mapInterfaceJobs } from './utils/fines-api-payload-map-interface-jobs.utils';
import { IOpalFinesInterfaceJobsSummaryResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-jobs-summary-response.interface';
import { IOpalFinesTillsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-tills-response.interface';
import { IFinesApiAllocateData } from '../fines-api-process-allocate/fines-api-allocate-tab/interfaces/fines-api-allocate-data.interface';
import { mapAllocateData } from './utils/fines-api-payload-map-allocate.utils';

@Injectable({
  providedIn: 'root',
})
/**
 * Facade service for extracting and mapping Automatic Cash Input payload data.
 */
export class FinesApiPayloadService {
  private readonly dateService = inject(DateService);

  /**
   * Extracts interface jobs from an Interface Jobs Summary response.
   */
  public extractInterfaceJobs(response: unknown): IOpalFinesInterfaceJobSummary[] {
    return extractInterfaceJobs(response);
  }

  /**
   * Maps interface jobs into Process table rows.
   *
   * @param interfaceJobs Raw interface jobs in backend order.
   * @param sourceLabels Resolved source codes and their display names.
   * @returns Sortable Process rows with source display names.
   */
  public mapInterfaceJobs(
    interfaceJobs: IOpalFinesInterfaceJobSummary[],
    sourceLabels: ReadonlyMap<string, string>,
  ): IFinesApiProcessFilesTableWrapperTableData[] {
    return mapInterfaceJobs(interfaceJobs, this.dateService, sourceLabels);
  }

  /**
   * Maps both Allocate responses into the display model without limiting results.
   *
   * @param jobs Processing jobs used for the processing summary.
   * @param tills Eligible tills in backend order.
   * @param sourceLabels Resolved source codes and their display names.
   * @returns Allocate rows and processing totals.
   */
  public mapAllocateData(
    jobs: IOpalFinesInterfaceJobsSummaryResponse,
    tills: IOpalFinesTillsResponse,
    sourceLabels: ReadonlyMap<string, string>,
  ): IFinesApiAllocateData {
    return mapAllocateData(jobs, tills, this.dateService, sourceLabels);
  }
}
