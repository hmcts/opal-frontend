import { IFinesFpuBusinessUnit } from '../../interfaces/fines-fpu-business-unit.interface';

export interface IFinesFpuState {
  fragment: string;
  tabData: IFinesFpuBusinessUnit[] | null;
  selectedBusinessUnitIds: number[];
  unsavedChanges: boolean;
}
