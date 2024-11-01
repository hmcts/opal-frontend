import { IFinesMacPayloadAccountDefendantParentGuardian } from '../interfaces/fines-mac-payload-defendant-parent-guardian.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK } from './fines-mac-payload-defendant-parent-guardian.mock';

export const FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK: IFinesMacPayloadAccountDefendantParentGuardian =
  {
    ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK,
    parent_guardian: {
      ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK.parent_guardian,
      debtor_detail: {
        ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK.parent_guardian.debtor_detail,
        aliases: [
          {
            alias_forenames: 'Testing',
            alias_surname: 'Test',
          },
        ],
      },
    },
  };
