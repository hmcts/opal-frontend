import { IFinesMacOffenceDetailsRoutingPaths } from '../interfaces/fines-mac-offence-details-routing-paths.interface';

export const FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS: IFinesMacOffenceDetailsRoutingPaths = {
  root: 'offence-details',
  children: {
    reviewOffences: 'review-offences',
    addOffence: 'add-offence',
    removeImposition: 'remove-imposition',
    addMinorCreditor: 'add-minor-creditor',
    removeMinorCreditor: 'remove-minor-creditor',
    removeOffence: 'remove-offence',
  },
};
