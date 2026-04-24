import {
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../../CommonIntercepts/CommonUserState.mocks';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK } from 'src/app/flows/fines/fines-acc/fines-acc-minor-creditor-details/mocks/fines-acc-minor-creditor-details-header.mock';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-with-defendant.mock';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITHOUT_DEFENDANT_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-minor-creditor-at-a-glance-without-defendant.mock';

export const MINOR_CREDITOR_ACCOUNT_ID = FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK.creditor.account_id;

export const createUserStateWithPaymentHoldPermission = () => {
  const userState = structuredClone(USER_STATE_MOCK_PERMISSION_BU77);

  userState.business_unit_users[0].permissions.push({
    permission_id: 12,
    permission_name: 'Add and Remove Payment Hold',
  });

  return userState;
};

export const createUserStateWithPaymentHoldPermissionInDifferentBusinessUnit = () => {
  const userState = structuredClone(USER_STATE_MOCK_PERMISSION_BU17);

  userState.business_unit_users[0].permissions.push({
    permission_id: 12,
    permission_name: 'Add and Remove Payment Hold',
  });

  return userState;
};

export const createIndividualMinorCreditorHeaderMock = () => {
  const header = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);

  header.creditor.has_associated_defendant = true;
  header.party.organisation_flag = false;
  header.party.organisation_details = undefined;
  header.party.individual_details = {
    title: 'Mrs',
    forenames: 'Jane Amelia',
    surname: 'Bloggs',
  };

  return header;
};

export const createIndividualMinorCreditorAtAGlanceMock = () => {
  const atAGlance = structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK);

  atAGlance.party.organisation_flag = false;
  atAGlance.party.organisation_details = null;
  atAGlance.party.individual_details = {
    title: 'Mrs',
    forenames: 'Jane Amelia',
    surname: 'Bloggs',
    date_of_birth: null,
    age: null,
    national_insurance_number: null,
    individual_aliases: null,
  };
  atAGlance.address = {
    address_line_1: '1 High Street',
    address_line_2: 'Town Centre',
    address_line_3: 'Westminster',
    address_line_4: null,
    address_line_5: null,
    postcode: 'sw1a 1aa',
  };
  atAGlance.defendant = {
    account_number: 'ACC-654321',
    account_id: 123456789,
    title: 'Mr',
    forenames: 'John',
    surname: 'Doe',
  };
  atAGlance.payment.is_bacs = true;
  atAGlance.payment.hold_payment = false;

  return atAGlance;
};

export const createMinorCreditorHeaderMock = () => structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HEADER_MOCK);

export const createMinorCreditorAtAGlanceWithoutDefendantMock = () =>
  structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITHOUT_DEFENDANT_MOCK);
