import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { mapAccountDefendantParentGuardianPayload } from './fines-mac-payload-map-account-defendant-company.utils';

import { mapAccountDefendantIndividualPayload } from './fines-mac-payload-map-account-defendant-individual.utils';
import { mapAccountDefendantCompanyPayload } from './fines-mac-payload-map-account-defendant-parent-guardian.utils';

/**
 * Maps the account defendant payload to the fines MAC state based on the defendant type.
 *
 * @param finesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account information and defendant type.
 * @returns The updated fines MAC state after mapping the defendant payload.
 */
export const mapAccountDefendantPayload = (
  finesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const { defendant_type: defendantType } = payload.account;

  switch (defendantType) {
    case 'parentOrGuardianToPay':
      return mapAccountDefendantParentGuardianPayload(finesMacState, payload);
    case 'company':
      return mapAccountDefendantCompanyPayload(finesMacState, payload);
    default:
      return mapAccountDefendantIndividualPayload(finesMacState, payload);
  }
};
