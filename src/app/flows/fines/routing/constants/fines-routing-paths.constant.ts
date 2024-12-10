import { FINES_CAV_ROUTING_PATHS } from '../../fines-cav/routing/constants/fines-cav-routing-path';
import { FINES_MAC_ROUTING_PATHS } from '../../fines-mac/routing/constants/fines-mac-routing-paths';
import { IFinesRoutingPaths } from '@routing/fines/interfaces/fines-routing-paths.interface';

export const FINES_ROUTING_PATHS: IFinesRoutingPaths = {
  root: 'fines',
  children: {
    mac: FINES_MAC_ROUTING_PATHS,
    cav: FINES_CAV_ROUTING_PATHS,
  },
};
