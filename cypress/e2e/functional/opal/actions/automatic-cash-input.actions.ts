import { AutomaticCashInputLocators } from '../../../../shared/selectors/automatic-cash-input.locators';
import { FinanceLocators } from '../../../../shared/selectors/finance.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { requestLoggedInUserState, UserStateRecord } from './user-state.actions';

const log = createScopedLogger('AutomaticCashInputActions');
const OUTSTANDING_AUTO_PAYMENT_COUNTS_ENDPOINT = '/opal-fines-service/business-units/outstanding-auto-payment-count';
const OUTSTANDING_AUTO_PAYMENT_COUNTS_ALIAS = 'outstandingAutoPaymentCounts';
const INTERFACE_JOBS_SUMMARY_ENDPOINT = '/opal-fines-service/interface-jobs/summary';
const INTERFACE_JOBS_SUMMARY_ALIAS = 'interfaceJobsSummary';
const PROCESS_AND_ALLOCATE_PAYMENTS_PERMISSION_ID = 16;
const ELIGIBLE_PROCESS_STATUSES = ['CREATED', 'FAILED'];

type BusinessUnitCount = {
  business_unit_id: number;
  business_unit_name: string;
  file_count: number;
  till_count: number;
};

type OutstandingAutoPaymentCountsResponse = {
  business_units: BusinessUnitCount[];
};

type InterfaceJob = {
  business_unit_name: string;
  completed_datetime: string | null;
  created_datetime: string;
  file_name: string;
  interface_file_id: number;
  interface_job_id: number;
  source: string;
  status: string;
};

type InterfaceJobsSummaryResponse = {
  interface_jobs: InterfaceJob[];
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

const buildInterfaceJobsForSelectedBusinessUnits = (
  businessUnits: BusinessUnitCount[],
): InterfaceJobsSummaryResponse => ({
  interface_jobs: businessUnits.flatMap((businessUnit, index) => [
    {
      business_unit_name: businessUnit.business_unit_name,
      completed_datetime: null,
      created_datetime: '2026-01-10T12:00:00.000Z',
      file_name: `${businessUnit.business_unit_id}-created.xml`,
      interface_file_id: 1000 + index * 2,
      interface_job_id: 2000 + index * 2,
      source: 'ALLPAY',
      status: 'CREATED',
    },
    {
      business_unit_name: businessUnit.business_unit_name,
      completed_datetime: null,
      created_datetime: '2026-01-09T12:00:00.000Z',
      file_name: `${businessUnit.business_unit_id}-failed.xml`,
      interface_file_id: 1001 + index * 2,
      interface_job_id: 2001 + index * 2,
      source: 'NATWEST',
      status: 'FAILED',
    },
  ]),
});

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

  /**
   * Selects live displayed BUs and starts Processing with deterministic eligible file data.
   */
  public selectBusinessUnitsAndContinueWithStubbedProcessFiles(): void {
    let selectedBusinessUnits: BusinessUnitCount[] = [];

    cy.intercept({ method: 'GET', pathname: INTERFACE_JOBS_SUMMARY_ENDPOINT }, (request) => {
      request.reply(buildInterfaceJobsForSelectedBusinessUnits(selectedBusinessUnits));
    }).as(INTERFACE_JOBS_SUMMARY_ALIAS);

    cy.wait(`@${OUTSTANDING_AUTO_PAYMENT_COUNTS_ALIAS}`).then((interception) => {
      expect(interception.response?.statusCode, 'outstanding auto-payment counts response').to.eq(200);

      const responseBody = interception.response?.body as OutstandingAutoPaymentCountsResponse;
      selectedBusinessUnits = responseBody.business_units.slice(0, 2);

      expect(selectedBusinessUnits, 'displayed business units').not.to.be.empty;
      cy.wrap(selectedBusinessUnits.map(({ business_unit_id }) => business_unit_id)).as('selectedBusinessUnitIds');
      cy.wrap(selectedBusinessUnits.map(({ business_unit_name }) => business_unit_name)).as(
        'selectedBusinessUnitNames',
      );

      selectedBusinessUnits.forEach(({ business_unit_id }) => {
        cy.get(AutomaticCashInputLocators.businessUnitCheckbox(business_unit_id)).check({ force: true });
      });
      cy.get(AutomaticCashInputLocators.continueButton).click();
    });
  }

  /**
   * Confirms the live Process response and its rendered rows are limited to the selected BUs.
   */
  public assertOnlySelectedBusinessUnitFilesAreDisplayed(): void {
    cy.get('@selectedBusinessUnitIds').then((selectedBusinessUnitIds) => {
      cy.get('@selectedBusinessUnitNames').then((selectedBusinessUnitNames) => {
        cy.wait(`@${INTERFACE_JOBS_SUMMARY_ALIAS}`).then((interception) => {
          expect(interception.response?.statusCode, 'interface jobs summary response').to.eq(200);
          expect(interception.request.query.business_unit_ids, 'requested business unit IDs').to.eq(
            (selectedBusinessUnitIds as number[]).join(','),
          );
          expect(interception.request.query.statuses, 'requested eligible processing statuses').to.eq(
            ELIGIBLE_PROCESS_STATUSES.join(','),
          );

          const responseBody = interception.response?.body as InterfaceJobsSummaryResponse;
          expect(responseBody.interface_jobs, 'files returned for selected BUs').not.to.be.empty;
          expect(
            responseBody.interface_jobs.every(({ business_unit_name }) =>
              (selectedBusinessUnitNames as string[]).includes(business_unit_name),
            ),
            'returned files are associated with selected BUs',
          ).to.be.true;
          expect(
            responseBody.interface_jobs.every(({ status }) => ELIGIBLE_PROCESS_STATUSES.includes(status)),
            'returned files have an eligible processing status',
          ).to.be.true;
          expect(
            responseBody.interface_jobs.map(({ status }) => status),
            'returned files include previously failed processing',
          ).to.include('FAILED');

          cy.get(AutomaticCashInputLocators.processFileBusinessUnitCells)
            .should('not.be.empty')
            .then(($cells) => {
              const displayedBusinessUnitNames = [...$cells].map((cell) => cell.textContent?.trim());

              expect(
                displayedBusinessUnitNames.every((businessUnitName) =>
                  (selectedBusinessUnitNames as string[]).includes(businessUnitName ?? ''),
                ),
                'displayed files are associated with selected BUs',
              ).to.be.true;
            });
        });
      });
    });
  }
}
