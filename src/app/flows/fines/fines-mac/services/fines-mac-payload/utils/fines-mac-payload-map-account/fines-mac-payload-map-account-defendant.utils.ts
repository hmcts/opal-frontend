import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccount } from '../../interfaces/fines-mac-payload-account.interface';

import { mapAccountDefendantCompanyPayload } from './fines-mac-payload-map-account-defendant-company.utils';

import { mapAccountDefendantIndividualPayload } from './fines-mac-payload-map-account-defendant-individual.utils';
import { mapAccountDefendantParentGuardianPayload } from './fines-mac-payload-map-account-defendant-parent-guardian.utils';

/**
 * Maps the account defendant payload to the fines MAC state based on the defendant type.
 *
 * @param finesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account information and defendant type.
 * @returns The updated fines MAC state after mapping the defendant payload.
 */
export const mapAccountDefendantPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccount,
): IFinesMacState => {
  const { defendant_type: defendantType, defendant } = payload;
  switch (defendantType) {
    case 'parentOrGuardianToPay':
      return mapAccountDefendantParentGuardianPayload(mappedFinesMacState, defendant);
    case 'company':
      return mapAccountDefendantCompanyPayload(mappedFinesMacState, defendant);
    default:
      return mapAccountDefendantIndividualPayload(mappedFinesMacState, defendant);
  }
};
