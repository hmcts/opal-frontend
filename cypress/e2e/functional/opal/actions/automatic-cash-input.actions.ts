import { AutomaticCashInputLocators } from '../../../../shared/selectors/automatic-cash-input.locators';
import { FinanceLocators } from '../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { requestLoggedInUserState, UserStateRecord } from './user-state.actions';

const log = createScopedLogger('AutomaticCashInputActions');
const OUTSTANDING_AUTO_PAYMENT_COUNTS_ENDPOINT = '/opal-fines-service/business-units/outstanding-auto-payment-count';
const OUTSTANDING_AUTO_PAYMENT_COUNTS_ALIAS = 'outstandingAutoPaymentCounts';
const PROCESS_AND_ALLOCATE_PAYMENTS_PERMISSION_ID = 16;

type BusinessUnitCount = {
  business_unit_id: number;
  business_unit_name: string;
  file_count: number;
  till_count: number;
};

type OutstandingAutoPaymentCountsResponse = {
  business_units: BusinessUnitCount[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasProcessAndAllocatePaymentsPermission = (businessUnitUser: Record<string, unknown>): boolean => {
  const permissions = businessUnitUser['permissions'];

  return (
    Array.isArray(permissions) &&
    permissions.some(
      (permission) =>
        isRecord(permission) && permission['permission_id'] === PROCESS_AND_ALLOCATE_PAYMENTS_PERMISSION_ID,
    )
  );
};

const getPermittedBusinessUnitIds = (userState: UserStateRecord): number[] => {
  const businessUnitUsers = userState['business_unit_users'];

  if (!Array.isArray(businessUnitUsers)) {
    throw new Error('The signed-in user state did not contain business unit memberships.');
  }

  return businessUnitUsers.flatMap((businessUnitUser) => {
    if (!isRecord(businessUnitUser) || !hasProcessAndAllocatePaymentsPermission(businessUnitUser)) {
      return [];
    }

    const businessUnitId = Number(businessUnitUser['business_unit_id']);
    return Number.isInteger(businessUnitId) ? [businessUnitId] : [];
  });
};

/**
 * Cypress actions for the Automatic Cash Input journey.
 */
export class AutomaticCashInputActions {
  /**
   * Opens Select Business Units and records its live permission-scoped API response.
   */
  public openSelectBusinessUnits(): void {
    log('action', 'Opening Automatic Cash Input Select Business Units');
    cy.intercept('GET', OUTSTANDING_AUTO_PAYMENT_COUNTS_ENDPOINT).as(OUTSTANDING_AUTO_PAYMENT_COUNTS_ALIAS);
    cy.get(FinanceLocators.automaticCashInputLink).should('be.visible').click();
  }

  /**
   * Asserts that the API and rendered table include only BUs for which the signed-in user has permission 16.
   */
  public assertOnlyPermittedBusinessUnitsAreDisplayed(): void {
    cy.wait(`@${OUTSTANDING_AUTO_PAYMENT_COUNTS_ALIAS}`).then((interception) => {
      expect(interception.response?.statusCode, 'outstanding auto-payment counts response').to.eq(200);

      const responseBody = interception.response?.body as OutstandingAutoPaymentCountsResponse;
      expect(responseBody?.business_units, 'business units returned by the API').to.be.an('array');

      const returnedBusinessUnitIds = responseBody.business_units.map(({ business_unit_id }) => business_unit_id);
      const returnedBusinessUnitNames = responseBody.business_units.map(({ business_unit_name }) => business_unit_name);
      const alphabeticallySortedBusinessUnitNames = [...returnedBusinessUnitNames].sort((firstName, secondName) =>
        firstName.localeCompare(secondName),
      );

      expect(returnedBusinessUnitNames, 'BUs returned by the API in display order').to.deep.equal(
        alphabeticallySortedBusinessUnitNames,
      );

      return requestLoggedInUserState().then((userState) => {
        const permittedBusinessUnitIds = getPermittedBusinessUnitIds(userState);

        expect(permittedBusinessUnitIds, 'BUs with Process and allocate payments permission').not.to.be.empty;
        expect(returnedBusinessUnitIds, 'BUs returned by the API').to.satisfy((businessUnitIds: number[]) =>
          businessUnitIds.every((businessUnitId) => permittedBusinessUnitIds.includes(businessUnitId)),
        );

        cy.get(AutomaticCashInputLocators.businessUnitNameCells)
          .should('have.length', returnedBusinessUnitIds.length)
          .then(($cells) => {
            const displayedBusinessUnitIds = [...$cells].map((cell) =>
              Number(cell.id.replace('fines-api-business-unit-name-', '')),
            );

            expect(displayedBusinessUnitIds, 'BUs displayed in the table').to.deep.equal(returnedBusinessUnitIds);
          });
      });
    });
  }
}
