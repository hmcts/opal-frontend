import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';

/** A selected summary row enriched with the business-unit ID required by the processing request. */
export interface IFinesApiConfirmProcessInterfaceJob extends IOpalFinesInterfaceJobSummary {
  businessUnitId: number;
}
