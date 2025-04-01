import { FINES_DRAFT_ROUTING_PATHS } from '../../fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { IFinesRoutingPaths } from '@routing/fines/interfaces/fines-routing-paths.interface';

export const FINES_ROUTING_PATHS: IFinesRoutingPaths = {
  root: 'fines',
  children: {
    mac: FINES_MAC_ROUTING_PATHS,
    draft: FINES_DRAFT_ROUTING_PATHS,
  },
};
