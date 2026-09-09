import { IFinesApiRoutingPaths } from '../../interfaces/fines-api-routing-paths.interface';

export const FINES_API_ROUTING_PATHS: IFinesApiRoutingPaths = {
  root: 'auto-payment-in',
  children: {
    selectBusinessUnits: 'select-business-units',
    processAllocate: 'process-allocate',
  },
};
