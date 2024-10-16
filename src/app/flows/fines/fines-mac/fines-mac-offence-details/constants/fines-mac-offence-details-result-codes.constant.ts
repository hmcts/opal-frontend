import { IFinesMacOffenceDetailsResultCodes } from '../interfaces/fines-mac-offence-details-result-codes.interface';

/**
 * This is not the final implementation. There is a ticket in the backlog:
 * https://tools.hmcts.net/jira/browse/PO-858
 * A new api endpoint will be built and a parameter will be passed which will return the result codes for that offence journey.
 */

export const FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES: IFinesMacOffenceDetailsResultCodes = {
  compensation: 'FCOMP',
  victimSurcharge: 'FVS',
  costs: 'FCOST',
  crownProsecutionCosts: 'FCPC',
  fineOnly: 'FO',
  criminalCourtsCharge: 'FCC',
  vehicleExciseDuty: 'FVEBD',
  forfeitedRecognizance: 'FFR',
};
