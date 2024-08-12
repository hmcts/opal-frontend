import { FINES_MAC_ROUTING_PATHS } from '../fines-mac/constants';

export const FINES_ROUTING_PATHS = {
  root: 'fines',
  children: {
    mac: FINES_MAC_ROUTING_PATHS,
  },
};
