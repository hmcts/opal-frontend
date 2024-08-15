import { FINES_MAC_ROUTING_PATHS } from '../../fines-mac/routing/constants';
import { IFinesRoutingPaths } from '../interfaces';

export const FINES_ROUTING_PATHS: IFinesRoutingPaths = {
  root: 'fines',
  children: {
    mac: FINES_MAC_ROUTING_PATHS,
  },
};
