import { IFinesMciRoutingPaths } from '../interfaces/fines-mci-routing-paths.interface';

export const FINES_MCI_ROUTING_PATHS: IFinesMciRoutingPaths = {
  root: 'manual-cash-input',
  children: {
    createAllocate: 'create-allocate',
  },
};
