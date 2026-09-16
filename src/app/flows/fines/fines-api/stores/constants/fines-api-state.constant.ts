import { IFinesApiState } from '../interfaces/fines-api-state.interface';
import { FINES_API_PROCESS_ALLOCATE_TABS_KEYS } from '../../fines-api-process-allocate/constants/fines-api-process-allocate-tabs-keys.constant';

export const FINES_API_STATE: IFinesApiState = {
  selectedBusinessUnitIds: [],
  selectedFileIds: [],
  overrideInhibitFileIds: [],
  processInterfaceJobs: null,
  activeTab: FINES_API_PROCESS_ALLOCATE_TABS_KEYS.process,
  stateChanges: false,
  unsavedChanges: false,
};
