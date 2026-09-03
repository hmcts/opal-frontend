export type FinesApiTab = 'process' | 'allocate' | 'ignored';

export interface IFinesApiState {
  selectedBusinessUnitIds: number[];
  selectedFileIds: string[];
  overrideInhibitFileIds: string[];
  activeTab: FinesApiTab;
  stateChanges: boolean;
  unsavedChanges: boolean;
}
