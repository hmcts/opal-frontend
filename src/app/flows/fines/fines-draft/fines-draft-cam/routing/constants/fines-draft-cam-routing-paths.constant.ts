import { IFinesDraftCamRoutingPaths } from '../interfaces/fines-draft-cam-routing-paths.interface';

export const FINES_DRAFT_CAM_ROUTING_PATHS: IFinesDraftCamRoutingPaths = {
  root: 'create-and-manage',
  children: {
    inputter: 'inputter-accounts',
    viewAllRejected: 'view-all-rejected',
  },
};
