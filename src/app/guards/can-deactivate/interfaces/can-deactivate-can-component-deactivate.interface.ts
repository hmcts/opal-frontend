import { CanDeactivateTypes } from '@guards/types/can-deactivate.type';

export interface ICanDeactivateCanComponentDeactivate {
  canDeactivate: () => CanDeactivateTypes;
}
