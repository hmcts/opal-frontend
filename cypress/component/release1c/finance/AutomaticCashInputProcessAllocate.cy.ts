import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from 'src/app/flows/fines/fines-api/routing/constants/fines-api-routing-paths.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesApiStore } from 'src/app/flows/fines/fines-api/stores/fines-api.store';
import { AppComponent } from 'src/app/app.component';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { AutomaticCashInputLocators } from '../../../shared/selectors/automatic-cash-input.locators';
import { FinanceLocators } from '../../../shared/selectors/finance.locators';
import { LoginLocators } from '../../../shared/selectors/login.locators';
import { setupFinancePageComponent } from './setup/SetupComponent';
import { PROCESS_INTERFACE_JOBS_SUMMARY_MOCK } from './mocks/interface-jobs-summary.mock';

const AUTOMATIC_CASH_INPUT_JIRA_LABEL = '@JIRA-LABEL:auto-payments-processing-files';
const AUTOMATIC_CASH_INPUT_JIRA_EPIC = '@JIRA-EPIC:PO-2468';
const AUTOMATIC_CASH_INPUT_RELEASE_TAG = '@R1CFinancialMovements';
const UNSAVED_CHANGES_MESSAGE =
  'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.';

const assertTrimmedText = (selector: string, expectedText: string): void => {
  cy.get(selector)
    .invoke('text')
    .then((text) => expect(text.trim()).to.equal(expectedText));
};

describe('Automatic Cash Input - Process files and allocate tills', () => {
  it(
    '(AC1a, AC3b, AC3bi) opens Allocate and shows the empty state when no tills are available',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', { interface_jobs: [] }).as(
        'getInterfaceJobsSummary',
      );
      cy.intercept('GET', '/opal-fines-service/tills*', { tills: [] }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');

      cy.get(AutomaticCashInputLocators.allocateTabLink).should('have.attr', 'aria-current', 'page');
      cy.get(AutomaticCashInputLocators.allocateProcessingSummary).should('not.exist');
      cy.get(AutomaticCashInputLocators.allocateEmptyState).should(
        'have.text',
        'There are no outstanding tills to allocate',
      );
      cy.get(AutomaticCashInputLocators.allocateSubmitButton).should('not.exist');
    },
  );

  it(
    '(AC3, AC3a, AC3d, AC3f) displays available tills and updates the selected count',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', { interface_jobs: [] }).as(
        'getInterfaceJobsSummary',
      );
      cy.intercept('GET', '/opal-fines-service/tills*', {
        tills: [
          {
            till_id: 124,
            till_number: 457,
            errors: 1,
            file_name: 'camberwell-payments.xml',
            source: 'NATWEST',
            amount: '80.00',
            business_unit_name: 'Camberwell Green',
            processed_by: 'Jamie.Jones',
            date_processed: '2026-01-09T13:30:00.000Z',
          },
          {
            till_id: 125,
            till_number: 458,
            errors: 0,
            file_name: 'older-camberwell-payments.xml',
            source: 'NATWEST',
            amount: '60.00',
            business_unit_name: 'Camberwell Green',
            processed_by: 'Jamie.Jones',
            date_processed: '2026-01-08T13:30:00.000Z',
          },
          {
            till_id: 123,
            till_number: 456,
            errors: 0,
            file_name: 'payments.xml',
            source: 'ALLPAY',
            amount: '125.50',
            business_unit_name: 'Camden and Islington',
            processed_by: 'Alex.Smith',
            date_processed: '2026-01-10T13:30:00.000Z',
          },
        ],
      }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');

      cy.get(AutomaticCashInputLocators.allocateTable).should('be.visible');
      cy.get(AutomaticCashInputLocators.allocateTable)
        .find('tbody tr')
        .then(($rows) => {
          expect([...$rows].map((row) => row.querySelector('input[type="checkbox"]')?.id)).to.deep.equal([
            'fines-api-allocate-till-124',
            'fines-api-allocate-till-125',
            'fines-api-allocate-till-123',
          ]);
        });
      cy.get(AutomaticCashInputLocators.allocateTable)
        .find('thead th')
        .then(($headers) => {
          const headerTexts = [...$headers].map((header) => header.textContent?.trim()).filter(Boolean);

          expect(headerTexts).to.include.members([
            'Till number',
            'Errors',
            'Filename',
            'Source',
            'Amount',
            'Business Unit',
            'Processed by',
            'Date processed',
          ]);
        });
      cy.get(AutomaticCashInputLocators.allocateTable)
        .find('tbody tr')
        .then(($rows) => {
          const rowValues = [...$rows].map((row) =>
            [...row.querySelectorAll('td')].slice(1).map((cell) => cell.textContent?.trim()),
          );

          expect(rowValues).to.deep.equal([
            [
              '457',
              '1',
              'camberwell-payments.xml',
              'NatWest',
              '£80.00',
              'Camberwell Green',
              'Jamie.Jones',
              '09 January 2026 at 13:30',
            ],
            [
              '458',
              '0',
              'older-camberwell-payments.xml',
              'NatWest',
              '£60.00',
              'Camberwell Green',
              'Jamie.Jones',
              '08 January 2026 at 13:30',
            ],
            [
              '456',
              '0',
              'payments.xml',
              'allpay',
              '£125.50',
              'Camden and Islington',
              'Alex.Smith',
              '10 January 2026 at 13:30',
            ],
          ]);
        });
      cy.get(AutomaticCashInputLocators.allocateSubmitButton).should('be.visible');
      assertTrimmedText(AutomaticCashInputLocators.allocateSelectedCount, '0 of 3 tills selected.');
      cy.get(AutomaticCashInputLocators.allocateTillCheckbox(123)).check({ force: true });
      assertTrimmedText(AutomaticCashInputLocators.allocateSelectedCount, '1 of 3 tills selected.');
      cy.get(AutomaticCashInputLocators.allocateTillCheckbox(124)).check({ force: true });
      assertTrimmedText(AutomaticCashInputLocators.allocateSelectedCount, '2 of 3 tills selected.');
      cy.get(AutomaticCashInputLocators.allocateSelectAllCheckbox).check({ force: true });
      assertTrimmedText(AutomaticCashInputLocators.allocateSelectedCount, '3 of 3 tills selected.');
    },
  );

  it(
    '(AC3e) navigates to the Till Summary when a till number is selected',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', { interface_jobs: [] }).as(
        'getInterfaceJobsSummary',
      );
      cy.intercept('GET', '/opal-fines-service/tills*', {
        tills: [
          {
            till_id: 123,
            till_number: 456,
            errors: 0,
            file_name: 'payments.xml',
            source: 'ALLPAY',
            amount: '125.50',
            business_unit_name: 'Camden and Islington',
            processed_by: 'Alex.Smith',
            date_processed: '2026-01-10T13:30:00.000Z',
          },
        ],
      }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');

      cy.get(AutomaticCashInputLocators.allocateTillNumberLink(123)).should('have.text', '456').click();
      cy.get('@financeRouter').its('url').should('contain', `${FINES_API_ROUTING_PATHS.children.tillSummary}/123`);
      cy.contains('h1', 'Till/File summary report').should('be.visible');
    },
  );

  it(
    'keeps a till selection when leaving is cancelled and returns to Select Business Units when confirmed',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', { interface_jobs: [] }).as(
        'getInterfaceJobsSummary',
      );
      cy.intercept('GET', '/opal-fines-service/tills*', {
        tills: [
          {
            till_id: 123,
            till_number: 456,
            errors: 0,
            file_name: 'payments.xml',
            source: 'ALLPAY',
            amount: '125.50',
            business_unit_name: 'Camden and Islington',
            processed_by: 'Alex.Smith',
            date_processed: '2026-01-10T13:30:00.000Z',
          },
        ],
      }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');
      cy.get(AutomaticCashInputLocators.allocateTillCheckbox(123)).check({ force: true });

      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');

        leavePageConfirm.onFirstCall().returns(false);
        leavePageConfirm.onSecondCall().returns(true);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });

      cy.get(AutomaticCashInputLocators.processAllocateBackLink).click();

      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.processAllocate,
          ].join('/') + '#allocate',
        );
      cy.get(AutomaticCashInputLocators.allocateTillCheckbox(123)).should('be.checked');

      cy.get(AutomaticCashInputLocators.processAllocateBackLink).click();
      cy.get('@leavePageConfirm').should('have.been.calledTwice');

      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.selectBusinessUnitsLegend).should('contain.text', 'Select business units');
    },
  );

  it(
    '(RGAC3, RGAC3a) prevents browser refresh while a till is selected and retains the selection',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', { interface_jobs: [] }).as(
        'getInterfaceJobsSummary',
      );
      cy.intercept('GET', '/opal-fines-service/tills*', {
        tills: [
          {
            till_id: 123,
            till_number: 456,
            errors: 0,
            file_name: 'payments.xml',
            source: 'ALLPAY',
            amount: '125.50',
            business_unit_name: 'Camden and Islington',
            processed_by: 'Alex.Smith',
            date_processed: '2026-01-10T13:30:00.000Z',
          },
        ],
      }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');
      cy.get(AutomaticCashInputLocators.allocateTillCheckbox(123)).check({ force: true });

      cy.window().then((window) => {
        const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

        window.dispatchEvent(beforeUnloadEvent);

        expect(beforeUnloadEvent.defaultPrevented).to.be.true;
      });
      cy.get(AutomaticCashInputLocators.allocateTillCheckbox(123)).should('be.checked');
    },
  );

  it(
    '(RGAC2) asks for confirmation before signing out with a selected till',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', { interface_jobs: [] }).as(
        'getInterfaceJobsSummary',
      );
      cy.intercept('GET', '/opal-fines-service/tills*', {
        tills: [
          {
            till_id: 123,
            till_number: 456,
            errors: 0,
            file_name: 'payments.xml',
            source: 'ALLPAY',
            amount: '125.50',
            business_unit_name: 'Camden and Islington',
            processed_by: 'Alex.Smith',
            date_processed: '2026-01-10T13:30:00.000Z',
          },
        ],
      }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');
      cy.get(AutomaticCashInputLocators.allocateTillCheckbox(123)).check({ force: true });

      cy.get('@appComponent').then((appComponent) => {
        cy.stub(appComponent as AppComponent, 'handleRedirect').as('handleRedirect');
      });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');

        leavePageConfirm.onFirstCall().returns(false);
        leavePageConfirm.onSecondCall().returns(true);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });

      cy.get(LoginLocators.signOutLink).click();
      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
      cy.get('@handleRedirect').should('not.have.been.called');
      cy.get('@financeRouter')
        .its('url')
        .should('contain', FINES_ROUTING_PATHS.children.autoPaymentIn.children.processAllocate);

      cy.get(LoginLocators.signOutLink).click();
      cy.get('@leavePageConfirm').should('have.been.calledTwice');
      cy.get('@handleRedirect').should('have.been.calledOnce').and('have.been.calledWithExactly', SSO_ENDPOINTS.logout);
    },
  );

  it(
    '(AC2a, AC2bi, AC2bii) displays the processing summary with business units in alphabetical order',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', (request) => {
        if (request.query['statuses'] === 'PROCESSING') {
          request.reply({
            interface_jobs: [
              {
                interface_file_id: 301,
                interface_job_id: 401,
                file_name: 'camden-processing.xml',
                source: 'ALLPAY',
                business_unit_name: 'Camden and Islington',
                created_datetime: '2026-01-10T13:30:00.000Z',
                completed_datetime: null,
                status: 'PROCESSING',
              },
              {
                interface_file_id: 302,
                interface_job_id: 402,
                file_name: 'camberwell-processing.xml',
                source: 'NATWEST',
                business_unit_name: 'Camberwell Green',
                created_datetime: '2026-01-10T12:30:00.000Z',
                completed_datetime: null,
                status: 'PROCESSING',
              },
            ],
          });
          return;
        }

        request.reply({ interface_jobs: [] });
      }).as('getInterfaceJobsSummary');
      cy.intercept('GET', '/opal-fines-service/tills*', { tills: [] }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');

      cy.get(AutomaticCashInputLocators.allocateProcessingSummary)
        .should('be.visible')
        .and('contain.text', '2 files are still being processed:');
      cy.get(AutomaticCashInputLocators.allocateProcessingBusinessUnits).then(($businessUnits) => {
        expect([...$businessUnits].map((businessUnit) => businessUnit.textContent?.trim())).to.deep.equal([
          'Camberwell Green (1)',
          'Camden and Islington (1)',
        ]);
      });
    },
  );

  it(
    '(AC4) refreshes the processing summary and available tills',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      let processingSummaryCall = 0;
      let tillsCall = 0;

      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', (request) => {
        if (request.query['statuses'] !== 'PROCESSING') {
          request.reply({ interface_jobs: [] });
          return;
        }

        processingSummaryCall += 1;
        request.reply({
          interface_jobs: [
            {
              interface_file_id: 301,
              interface_job_id: 401,
              file_name: `processing-${processingSummaryCall}.xml`,
              source: 'ALLPAY',
              business_unit_name: processingSummaryCall === 1 ? 'Camden and Islington' : 'Camberwell Green',
              created_datetime: '2026-01-10T13:30:00.000Z',
              completed_datetime: null,
              status: 'PROCESSING',
            },
          ],
        });
      }).as('getInterfaceJobsSummary');
      cy.intercept('GET', '/opal-fines-service/tills*', (request) => {
        tillsCall += 1;
        request.reply({
          tills: [
            {
              till_id: tillsCall === 1 ? 123 : 124,
              till_number: tillsCall === 1 ? 456 : 457,
              errors: 0,
              file_name: tillsCall === 1 ? 'payments.xml' : 'refreshed-payments.xml',
              source: 'ALLPAY',
              amount: '125.50',
              business_unit_name: 'Camden and Islington',
              processed_by: 'Alex.Smith',
              date_processed: '2026-01-10T13:30:00.000Z',
            },
          ],
        });
      }).as('getTills');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');
      cy.get(AutomaticCashInputLocators.allocateProcessingSummary).should('contain.text', 'Camden and Islington (1)');
      cy.get(AutomaticCashInputLocators.allocateTable).should('contain.text', 'payments.xml');

      cy.get(AutomaticCashInputLocators.allocateRefreshButton).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.wait('@getTills');

      cy.get('@getInterfaceJobsSummary.all').should('have.length', 3);
      cy.get('@getTills.all').should('have.length', 2);
      cy.get(AutomaticCashInputLocators.allocateProcessingSummary).should('contain.text', 'Camberwell Green (1)');
      cy.get(AutomaticCashInputLocators.allocateTable).should('contain.text', 'refreshed-payments.xml');
    },
  );

  it(
    'uses resolved source display names and reuses the mapping on refresh',
    {
      tags: [
        '@JIRA-STORY:PO-2587',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('GET', '/opal-fines-service/interface-jobs/summary*', PROCESS_INTERFACE_JOBS_SUMMARY_MOCK).as(
        'getInterfaceJobsSummary',
      );
      setupFinancePageComponent({
        dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
        sourceMappings: [{ code: 'NATWEST', display_name: 'Updated bank label' }],
      });
      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@sourceMappings');
      cy.wait('@getInterfaceJobsSummary');
      cy.get(AutomaticCashInputLocators.processTabContent).should('contain.text', 'Updated bank label');
      cy.get(AutomaticCashInputLocators.processFilesRefreshButton).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.get(AutomaticCashInputLocators.processTabContent).should('contain.text', 'Updated bank label');
      cy.get('@sourceMappings.all').should('have.length', 1);
    },
  );

  it(
    '(AC1) navigates to Processing with the Process tab selected by default after business units are selected',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        { interface_jobs: [] },
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();

      cy.wait('@getInterfaceJobsSummary').its('request.query').should('deep.include', {
        business_unit_ids: '77',
        statuses: 'CREATED,FAILED',
        interface_name: 'payments_in',
      });
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.processAllocate,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.processAllocatePage).should('contain.text', 'Automatic Cash Input');
      cy.get(AutomaticCashInputLocators.processTabLink).should('have.attr', 'aria-current', 'page');
      cy.get(AutomaticCashInputLocators.processTabContent).should('be.visible');
    },
  );

  it(
    '(AC2, AC2a) displays the Automatic Cash Input Processing screen shell and empty-files message',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        { interface_jobs: [] },
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.processAllocatePage).should('contain.text', 'Automatic Cash Input');
      cy.get(AutomaticCashInputLocators.processAllocateBackLink).should('be.visible').and('contain.text', 'Back');
      cy.get(AutomaticCashInputLocators.processTabLink)
        .should('be.visible')
        .and('contain.text', 'Process')
        .and('have.attr', 'aria-current', 'page');
      cy.get(AutomaticCashInputLocators.allocateTabLink).should('be.visible').and('contain.text', 'Allocate');
      cy.get(AutomaticCashInputLocators.ignoredFilesTabLink).should('be.visible').and('contain.text', 'Ignored files');
      cy.get(AutomaticCashInputLocators.processAllocateCancelLink).should('be.visible').and('contain.text', 'Cancel');
      cy.get(AutomaticCashInputLocators.processFilesEmptyHeading).should('contain.text', 'Process files');
      cy.get(AutomaticCashInputLocators.processFilesEmptyDescription).should(
        'contain.text',
        'There are no uploaded files to process',
      );
    },
  );

  it(
    '(AC2b, AC2d) displays Process controls and preserves the API-provided default file order',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(65)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();

      cy.wait('@getInterfaceJobsSummary').its('request.query.business_unit_ids').should('eq', '77,65');
      cy.get(AutomaticCashInputLocators.processFilesHeading).should('contain.text', 'Process files');
      cy.get(AutomaticCashInputLocators.processFilesRefreshButton).should('be.visible').and('contain.text', 'Refresh');
      cy.get(AutomaticCashInputLocators.processFilesProcessButton).should('be.visible').and('contain.text', 'Process');
      assertTrimmedText(AutomaticCashInputLocators.processFilesSelectedCount, '0 of 5 files selected');
      cy.get(AutomaticCashInputLocators.processFilesTable).should('be.visible');
      cy.get(AutomaticCashInputLocators.processFileNameCells)
        .should('have.length', 5)
        .then(($cells) =>
          expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
            'camden-new.xml',
            'camden-old.xml',
            'camberwell-new.xml',
            'camberwell-telecom.xml',
            'camberwell-dwp.xml',
          ]),
        );
    },
  );

  it(
    '(AC2c) displays Process Files table data using the required labels and date format',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(65)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'File name').should('be.visible');
      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'Source').should('be.visible');
      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'Business unit').should('be.visible');
      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'Date uploaded').should('be.visible');
      assertTrimmedText(AutomaticCashInputLocators.processFileNameCell(101), 'camden-new.xml');
      assertTrimmedText(AutomaticCashInputLocators.processFileSourceCell(101), 'allpay');
      assertTrimmedText(AutomaticCashInputLocators.processFileBusinessUnitCell(101), 'Camden and Islington');
      assertTrimmedText(AutomaticCashInputLocators.processFileDateUploadedCell(101), '10 January 2026 at 13:30');
      assertTrimmedText(AutomaticCashInputLocators.processFileSourceCell(102), 'NatWest');
      assertTrimmedText(AutomaticCashInputLocators.processFileSourceCell(103), 'Barclaycard');
      assertTrimmedText(AutomaticCashInputLocators.processFileSourceCell(104), 'British Telecom');
      assertTrimmedText(AutomaticCashInputLocators.processFileSourceCell(105), 'DWP/AEA');
    },
  );

  it(
    '(AC4, AC4a, AC4b, AC8b EMAC1) selects one, many, or all files, updates the count, and requires a selection before processing',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(65)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      assertTrimmedText(AutomaticCashInputLocators.processFilesSelectedCount, '0 of 5 files selected');
      cy.get(AutomaticCashInputLocators.processFilesProcessButton).click();

      cy.get(AutomaticCashInputLocators.processFilesSelectionError).should('contain.text', 'Select at least 1 file');
      cy.get(AutomaticCashInputLocators.errorSummary)
        .should('be.visible')
        .and('contain.text', 'Select at least 1 file');
      cy.get(AutomaticCashInputLocators.errorSummaryTitle).should('have.text', 'There is a problem');

      cy.get(AutomaticCashInputLocators.processFileCheckbox(101)).check({ force: true });
      assertTrimmedText(AutomaticCashInputLocators.processFilesSelectedCount, '1 of 5 files selected');
      cy.get(AutomaticCashInputLocators.processFilesSelectionError).should('not.exist');
      cy.get(AutomaticCashInputLocators.errorSummary).should('not.exist');

      cy.get(AutomaticCashInputLocators.processFileCheckbox(102)).check({ force: true });
      assertTrimmedText(AutomaticCashInputLocators.processFilesSelectedCount, '2 of 5 files selected');

      cy.get(AutomaticCashInputLocators.processFilesSelectAllCheckbox).check({ force: true });
      assertTrimmedText(AutomaticCashInputLocators.processFilesSelectedCount, '5 of 5 files selected');
      cy.get(AutomaticCashInputLocators.processFilesSelectAllCheckbox).uncheck({ force: true });
      assertTrimmedText(AutomaticCashInputLocators.processFilesSelectedCount, '0 of 5 files selected');
    },
  );

  it(
    '(AC4c) clears validation, stores selected files, and navigates to Confirm Process',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.get(AutomaticCashInputLocators.processFilesProcessButton).click();
      cy.get(AutomaticCashInputLocators.processFilesSelectionError).should('be.visible');

      cy.get(AutomaticCashInputLocators.processFileCheckbox(101)).check({ force: true });
      cy.get(AutomaticCashInputLocators.processFilesProcessButton).click();

      cy.get(AutomaticCashInputLocators.processFilesSelectionError).should('not.exist');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedFileIds()).to.deep.equal(['101']);
      });
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_API_ROUTING_PATHS.children.confirmProcess,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.heading).should('contain.text', 'Confirm before processing');
    },
  );

  it(
    '(AC5) recalls the Process files API and displays the latest file data when refreshed',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      let interfaceJobsResponse = PROCESS_INTERFACE_JOBS_SUMMARY_MOCK;

      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        (request) => request.reply(interfaceJobsResponse),
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary').then(() => {
        cy.get(AutomaticCashInputLocators.processFileNameCells).should('have.length', 5);

        interfaceJobsResponse = {
          interface_jobs: [
            {
              interface_file_id: 106,
              interface_job_id: 1006,
              file_name: 'camden-latest.xml',
              source: 'ALLPAY',
              business_unit_name: 'Camden and Islington',
              created_datetime: '2026-01-11T13:30:00.000Z',
              completed_datetime: null,
              status: 'CREATED',
            },
          ],
        };

        cy.get(AutomaticCashInputLocators.processFilesRefreshButton).click();
        cy.wait('@getInterfaceJobsSummary').its('request.query.business_unit_ids').should('eq', '77');
        cy.get(AutomaticCashInputLocators.processFileNameCells).should('have.length', 1);
        assertTrimmedText(AutomaticCashInputLocators.processFileNameCell(106), 'camden-latest.xml');
        cy.get(AutomaticCashInputLocators.processFileNameCell(101)).should('not.exist');
      });
    },
  );

  it(
    '(AC6, AC6a) navigates to the Allocate and Ignored files tabs',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.allocateTabLink).click();
      cy.get(AutomaticCashInputLocators.allocateTabLink).should('have.attr', 'aria-current', 'page');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).activeTab()).to.equal('allocate');
      });
      cy.get('@financeRouter').its('url').should('contain', '#allocate');

      cy.get(AutomaticCashInputLocators.ignoredFilesTabLink).click();
      cy.get(AutomaticCashInputLocators.ignoredFilesTabLink).should('have.attr', 'aria-current', 'page');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).activeTab()).to.equal('ignored');
      });
      cy.get('@financeRouter').its('url').should('contain', '#ignored');

      // TODO(PO-2586): Assert Allocate and Ignored files tab content when those tab components are implemented.
    },
  );

  it(
    '(AC7) returns to Select Business Units when Back is selected without file selections',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.get(AutomaticCashInputLocators.processAllocateBackLink).click();

      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.selectBusinessUnitsLegend).should('contain.text', 'Select business units');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedFileIds()).to.deep.equal([]);
      });
    },
  );

  it(
    '(AC7a, AC7ai, AC7aii, AC8a RGAC1) confirms data loss before returning to Select Business Units with selected files',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.get(AutomaticCashInputLocators.processFileCheckbox(101)).check({ force: true });
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');

        leavePageConfirm.onFirstCall().returns(false);
        leavePageConfirm.onSecondCall().returns(true);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });

      cy.get(AutomaticCashInputLocators.processAllocateBackLink).click();

      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.processAllocate,
          ].join('/'),
        );
      cy.get(AutomaticCashInputLocators.processFileCheckbox(101)).should('be.checked');

      cy.get(AutomaticCashInputLocators.processAllocateBackLink).click();

      cy.get('@leavePageConfirm').should('have.been.calledTwice');
      cy.get('@financeRouter')
        .its('url')
        .should(
          'eq',
          [
            '',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.root,
            FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
          ].join('/'),
        );
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedFileIds()).to.deep.equal([]);
      });
    },
  );

  it(
    '(AC8a RGAC2a, RGAC3a) prevents browser exit and refresh while files are selected and retains selections',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.get(AutomaticCashInputLocators.processFileCheckbox(101)).check({ force: true });

      cy.window().then((window) => {
        const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

        window.dispatchEvent(beforeUnloadEvent);

        expect(beforeUnloadEvent.defaultPrevented).to.be.true;
      });
      cy.get(AutomaticCashInputLocators.processFileCheckbox(101)).should('be.checked');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedFileIds()).to.deep.equal(['101']);
      });
    },
  );

  it(
    '(AC8c CSAC1, CSAC1a, CSAC2, CSAC3) sorts one column at a time and resets sorting when refreshed',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'File name').find('button').click();
      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'File name').should(
        'have.attr',
        'aria-sort',
        'ascending',
      );
      cy.get(AutomaticCashInputLocators.processFileNameCells).then(($cells) =>
        expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
          'camberwell-dwp.xml',
          'camberwell-new.xml',
          'camberwell-telecom.xml',
          'camden-new.xml',
          'camden-old.xml',
        ]),
      );

      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'Source').find('button').click();
      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'File name').should(
        'have.attr',
        'aria-sort',
        'none',
      );
      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'Source').should(
        'have.attr',
        'aria-sort',
        'ascending',
      );

      cy.get(AutomaticCashInputLocators.processFilesRefreshButton).click();
      cy.wait('@getInterfaceJobsSummary');
      cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, 'Source').should(
        'have.attr',
        'aria-sort',
        'none',
      );
    },
  );

  it(
    '(AC8c CSAC1) displays sortable columns when the Process files table is paginated',
    {
      tags: [
        '@JIRA-STORY:PO-2585',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      const paginatedInterfaceJobsResponse = {
        interface_jobs: Array.from({ length: 26 }, (_, index) => ({
          ...PROCESS_INTERFACE_JOBS_SUMMARY_MOCK.interface_jobs[0],
          interface_file_id: 200 + index,
          interface_job_id: 1200 + index,
          file_name: `paginated-file-${index + 1}.xml`,
        })),
      };

      cy.intercept(
        {
          method: 'GET',
          pathname: '/opal-fines-service/interface-jobs/summary',
        },
        paginatedInterfaceJobsResponse,
      ).as('getInterfaceJobsSummary');
      setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

      cy.get(FinanceLocators.automaticCashInputLink).click();
      cy.get(AutomaticCashInputLocators.businessUnitCheckbox(77)).check({ force: true });
      cy.get(AutomaticCashInputLocators.continueButton).click();
      cy.wait('@getInterfaceJobsSummary');

      cy.get(AutomaticCashInputLocators.processFilesPagination).should('be.visible');
      cy.get(AutomaticCashInputLocators.processFileNameCells).should('have.length', 25);
      ['File name', 'Source', 'Business unit', 'Date uploaded'].forEach((columnHeading) => {
        cy.contains(AutomaticCashInputLocators.processFilesTableHeadings, columnHeading)
          .find('button')
          .should('be.visible');
      });
    },
  );
});
