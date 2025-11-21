import { IFinesComponentProperties } from '../../setup/FinesComponent.interface';
import { FINES_MAC_ROUTING_PATHS } from 'src/app/flows/fines/fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { setupFinesMacComponent } from '../../setup/FinesComponent.setup';
import {
  interceptAuthenticatedUser,
  interceptBusinessUnitById,
  interceptOffences,
  interceptOffencesById,
  interceptRefDataForReviewAccount,
  interceptUserState,
} from 'cypress/component/CommonIntercepts/CommonIntercepts';
import { USER_STATE_MOCK_PERMISSION_BU77 } from 'cypress/component/fineAccountEnquiry/accountEnquiry/mocks/defendant_details_mock';
import { interceptGetDraftAccountById } from 'cypress/component/manualAccountCreation/setup/FineAccount.intercepts';
import { FIXED_PENALTY_AY_MOCK } from 'cypress/component/manualAccountCreation/FinesFixedPenalty/FinesMacReviewFixedPenalty/mocks/fixedPenalty.api.mock';
import { BUSINESS_UNIT_77_MOCK } from 'cypress/component/CommonIntercepts/CommonIntercept.mocks';
describe('Fixed Penalty - Review Submitted Account', () => {
  beforeEach(() => {
    interceptAuthenticatedUser();
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    interceptBusinessUnitById(77, BUSINESS_UNIT_77_MOCK);
    interceptRefDataForReviewAccount(77);
    interceptOffences();
  });
  it('(AC.1)should display submitted account details correctly', { tags: ['@PO-1804 '] }, () => {
    const draftAccountId = '1002';
    const props: IFinesComponentProperties = {
      draftAccountId: draftAccountId,
      fragments: undefined,
      componentUrl: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/${draftAccountId}`,
      interceptedRoutes: [],
      isCheckerUser: true,
    };

    interceptGetDraftAccountById(draftAccountId, FIXED_PENALTY_AY_MOCK);
    interceptOffencesById(FIXED_PENALTY_AY_MOCK.account.offences[0].offence_id);

    setupFinesMacComponent(props);

    // Test implementation goes here
  });
});
