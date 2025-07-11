import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../../../constants/fines-mac-defendant-types-keys';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccount } from '../../interfaces/fines-mac-payload-account.interface';

import { finesMacPayloadMapAccountDefendantCompanyPayload } from './fines-mac-payload-map-account-defendant-company.utils';

import { finesMacPayloadMapAccountDefendantIndividualPayload } from './fines-mac-payload-map-account-defendant-individual.utils';
import { finesMacPayloadMapAccountDefendantParentGuardianPayload } from './fines-mac-payload-map-account-defendant-parent-guardian.utils';

/**
 * Maps the account defendant payload to the fines MAC state based on the defendant type.
 *
 * @param finesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account information and defendant type.
 * @returns The updated fines MAC state after mapping the defendant payload.
 */
export const finesMacPayloadMapAccountDefendant = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccount,
): IFinesMacState => {
  const { defendant_type: defendantType, defendant } = payload;
  switch (defendantType) {
    case FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay:
      return finesMacPayloadMapAccountDefendantParentGuardianPayload(mappedFinesMacState, defendant);
    case FINES_MAC_DEFENDANT_TYPES_KEYS.company:
      return finesMacPayloadMapAccountDefendantCompanyPayload(mappedFinesMacState, defendant);
    default:
      return finesMacPayloadMapAccountDefendantIndividualPayload(mappedFinesMacState, defendant);
  }
};
