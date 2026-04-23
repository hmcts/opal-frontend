import { IOpalFinesAccountDefendantDetailsHeader } from '../../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';

export const FINES_ACC_ENF_ACTION_SELECT_DEFENDANT_ACCOUNT_HEADING_DATA_MOCK: IOpalFinesAccountDefendantDetailsHeader =
  {
    ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
    debtor_type: 'Defendant',
    is_youth: true,
    party_details: {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details),
      organisation_flag: true,
    },
  };
