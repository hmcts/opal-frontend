import { IDraftAccountResolver } from '../interfaces/draft-account-resolver.interface';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../../../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK } from '../../../../../services/opal-fines-service/mocks/opal-fines-business-unit-non-snake-case.mock';
import { OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK } from '../../../../../services/opal-fines-service/mocks/opal-fines-offence-data-non-snake-case.mock';

export const DRAFT_ACCOUNT_RESOLVER_MOCK: IDraftAccountResolver = {
  draftAccount: FINES_MAC_PAYLOAD_ADD_ACCOUNT,
  businessUnit: OPAL_FINES_BUSINESS_UNIT_NON_SNAKE_CASE_MOCK,
  offencesData: [OPAL_FINES_OFFENCE_DATA_NON_SNAKE_CASE_MOCK],
};
