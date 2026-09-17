import { IOpalFinesInterfaceJobSummary } from '@services/fines/opal-fines-service/interfaces/opal-fines-interface-job-summary.interface';
import { TFinesApiProcessAllocateTabKey } from '../../fines-api-process-allocate/types/fines-api-process-allocate-tab-key.type';

export interface IFinesApiState {
  selectedBusinessUnitIds: number[];
  selectedFileIds: string[];
  overrideInhibitFileIds: string[];
  processInterfaceJobs: IOpalFinesInterfaceJobSummary[] | null;
  activeTab: TFinesApiProcessAllocateTabKey;
  stateChanges: boolean;
  unsavedChanges: boolean;
}
