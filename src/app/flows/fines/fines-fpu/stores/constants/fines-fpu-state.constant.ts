import { IFinesFpuState } from '../interfaces/fines-fpu-state.interface';
import { FINES_FPU_TAB_FRAGMENTS } from '../../constants/fines-fpu-tab-fragments.constant';

export const FINES_FPU_STATE: IFinesFpuState = {
  fragment: FINES_FPU_TAB_FRAGMENTS.toPublish,
  tabData: null,
  selectedBusinessUnitIds: [],
  unsavedChanges: false,
};
