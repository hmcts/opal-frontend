import { inject, Injectable } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { IFinesApiProcessFilesTableWrapperTableData } from '../fines-api-process-allocate/fines-api-process-tab/fines-api-process-files-table-wrapper/interfaces/fines-api-process-files-table-wrapper-table-data.interface';
import { extractInterfaceJobs, mapInterfaceJobs } from './utils/fines-api-payload-map-interface-jobs.utils';

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
   */
  public mapInterfaceJobs(
    interfaceJobs: IOpalFinesInterfaceJobSummary[],
  ): IFinesApiProcessFilesTableWrapperTableData[] {
    return mapInterfaceJobs(interfaceJobs, this.dateService);
  }
}
