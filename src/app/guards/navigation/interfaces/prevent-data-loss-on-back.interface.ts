import { CanDeactivateTypes } from '../../types';

export interface IPreventDataLossOnBack {
  preventDataLossOnBackGuard: () => CanDeactivateTypes;
}
