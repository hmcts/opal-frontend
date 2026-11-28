import { FinesAecTab } from '../types/fines-aec-tab.type';

export interface IFinesAecStoreState {
  activeTab: FinesAecTab;
  successMessage: string | null;
}
