import { IFinesDraftRoutingPaths } from '../interfaces/fines-draft-routing-paths.interface';

export const FINES_DRAFT_ROUTING_PATHS: IFinesDraftRoutingPaths = {
  root: 'draft',
  children: {
    createAndManage: 'create-and-manage',
    checkAndValidate: 'check-and-validate',
    viewAllRejected: 'view-all-rejected',
  },
};
