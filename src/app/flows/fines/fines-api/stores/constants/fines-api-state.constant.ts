import { IFinesApiState } from '../interfaces/fines-api-state.interface';

export const FINES_API_STATE: IFinesApiState = {
  selectedBusinessUnitIds: [],
  selectedFileIds: [],
  overrideInhibitFileIds: [],
  activeTab: 'process',
  stateChanges: false,
  unsavedChanges: false,
};
