import { IFinesMacPayloadBuildAccountDefendantParentGuardian } from '../interfaces/fines-mac-payload-build-account-defendant-parent-guardian.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_MOCK } from './fines-mac-payload-account-defendant-parent-guardian.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK: IFinesMacPayloadBuildAccountDefendantParentGuardian =
  {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_MOCK,
    parent_guardian: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_MOCK.parent_guardian,
      debtor_detail: {
        ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_MOCK.parent_guardian.debtor_detail,
        aliases: [
          {
            alias_forenames: 'Testing',
            alias_surname: 'Test',
          },
        ],
      },
    },
  };
