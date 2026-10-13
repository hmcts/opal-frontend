import { IFinesApiRoutingPaths } from '../../interfaces/fines-api-routing-paths.interface';

export const FINES_API_ROUTING_TITLES: IFinesApiRoutingPaths = {
  root: 'Automatic Cash Input',
  children: {
    tillSummary: 'Automatic Cash Input - Till Summary',
    fileSummary: 'Automatic Cash Input - File Summary',
    selectBusinessUnits: 'Automatic Cash Input - Select Business Units',
    processAllocate: 'Automatic Cash Input - Process files and allocate tills',
    confirmProcess: 'Automatic Cash Input - Confirm before processing',
  },
};
