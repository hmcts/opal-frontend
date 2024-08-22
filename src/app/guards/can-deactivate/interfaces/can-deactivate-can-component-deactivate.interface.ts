import { CanDeactivateTypes } from '../../types';

export interface ICanDeactivateCanComponentDeactivate {
  canDeactivate: () => CanDeactivateTypes;
}
