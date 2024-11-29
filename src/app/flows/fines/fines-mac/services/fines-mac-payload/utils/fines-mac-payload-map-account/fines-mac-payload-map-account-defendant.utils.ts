import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { mapAccountDefendantCompanyPayloadToFinesMacState } from '../fines-mac-payload-account-defendant-company.utils';

import { mapAccountDefendantParentGuardianPayloadToFinesMacState } from '../fines-mac-payload-account-defendant-parent-guardian.utils';
import { mapAccountDefendantIndividualPayload } from './fines-mac-payload-map-account-defendant-individual.utils';

export const mapAccountDefendantPayload = (
  finesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const defendantType = payload.account.defendant_type;

  switch (defendantType) {
    case 'parentOrGuardianToPay':
      return mapAccountDefendantParentGuardianPayloadToFinesMacState(finesMacState, payload);
    case 'company':
      return mapAccountDefendantCompanyPayloadToFinesMacState(finesMacState, payload);
    default:
      return mapAccountDefendantIndividualPayload(finesMacState, payload);
  }
};
