import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from 'src/app/flows/fines/fines-api/routing/constants/fines-api-routing-paths.constant';
import { FinesApiStore } from 'src/app/flows/fines/fines-api/stores/fines-api.store';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { CommonLocators } from '../../../shared/selectors/common.locators';
import { AutomaticCashInputLocators } from '../../../shared/selectors/automatic-cash-input.locators';
import { FinanceLocators } from '../../../shared/selectors/finance.locators';
import { CONFIRM_PROCESS_INTERFACE_JOBS_SUMMARY_MOCK } from './mocks/confirm-process-interface-jobs-summary.mock';
import { setupFinancePageComponent } from './setup/SetupComponent';

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

const openConfirmProcess = (businessUnitIds: number[], interfaceFileIds: number[]): void => {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/opal-fines-service/interface-jobs/summary',
    },
    CONFIRM_PROCESS_INTERFACE_JOBS_SUMMARY_MOCK,
  ).as('getConfirmProcessInterfaceJobsSummary');
  setupFinancePageComponent({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

  cy.get(FinanceLocators.automaticCashInputLink).click();
  businessUnitIds.forEach((businessUnitId) => {
    cy.get(AutomaticCashInputLocators.businessUnitCheckbox(businessUnitId)).check({ force: true });
  });
  cy.get(AutomaticCashInputLocators.continueButton).click();
  cy.wait('@getConfirmProcessInterfaceJobsSummary');
  interfaceFileIds.forEach((interfaceFileId) => {
    cy.get(AutomaticCashInputLocators.processFileCheckbox(interfaceFileId)).check({ force: true });
  });
  cy.get(AutomaticCashInputLocators.processFilesProcessButton).click();
};

describe('Automatic Cash Input - Confirm before processing', () => {
  it(
    '(AC1) navigates to Confirm before processing when selected files are processed',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77], [201]);

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
      cy.get(AutomaticCashInputLocators.confirmProcessPage).should('be.visible');
      cy.get(AutomaticCashInputLocators.confirmProcessHeading).should('have.text', 'Confirm before processing');
    },
  );

  it(
    '(AC2a, AC2b, AC2c) displays an alphabetically ordered total-files table with selected-file counts per business unit',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77, 65], [201, 202, 203]);

      cy.get(AutomaticCashInputLocators.confirmProcessBusinessUnitsTable).should('be.visible');
      assertTrimmedText(
        AutomaticCashInputLocators.confirmProcessSelectionCount,
        'You have selected 3 of 4 files to process',
      );
      cy.get(AutomaticCashInputLocators.confirmProcessBusinessUnitSummaryRows).should('have.length', 2);
      cy.get(AutomaticCashInputLocators.confirmProcessBusinessUnitSummaryNameCells).then(($cells) => {
        expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
          'Camberwell Green',
          'Camden and Islington',
        ]);
      });
      assertTrimmedText(AutomaticCashInputLocators.confirmProcessFileCountCell(65), '1');
      assertTrimmedText(AutomaticCashInputLocators.confirmProcessFileCountCell(77), '2');
    },
  );

  it(
    '(AC3, AC3b) displays only selected DWP/AEA files and selects every override-inhibits checkbox by default',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77, 65], [201, 202, 203]);

      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsSection).should('be.visible');
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsRows).should('have.length', 2);
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsFileCell(201)).should(
        'contain.text',
        'camberwell-dwp.xml',
      );
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsFileCell(203)).should(
        'contain.text',
        'camden-dwp.xml',
      );
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsFileCell(202)).should('not.exist');
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsSelectAllCheckbox).should('be.checked');
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsCheckbox(201)).should('be.checked');
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsCheckbox(203)).should('be.checked');
    },
  );

  it(
    '(AC3a) does not display Override inhibits when no selected files have a DWP/AEA source',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77], [202]);

      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsSection).should('not.exist');
    },
  );

  it(
    '(AC3c) allows a user to deselect a DWP/AEA file from Override inhibits',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77], [201, 202]);

      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsCheckbox(201))
        .should('be.checked')
        .uncheck({ force: true })
        .should('not.be.checked');
    },
  );

  it(
    '(AC3di, AC3dii, AC3e) sends override inhibits only for selected DWP/AEA files',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('POST', '/opal-fines-service/interface-jobs/process', { statusCode: 204 }).as(
        'processInterfaceJobs',
      );
      openConfirmProcess([77, 65], [201, 202, 203]);
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsCheckbox(203)).uncheck({ force: true });
      cy.get(AutomaticCashInputLocators.confirmProcessProcessButton).click();

      cy.wait('@processInterfaceJobs')
        .its('request.body')
        .should('deep.equal', {
          interface_jobs: [
            { business_unit_id: 77, interface_job_id: 2001, override_inhibits: true },
            { business_unit_id: 77, interface_job_id: 2002, override_inhibits: false },
            { business_unit_id: 65, interface_job_id: 2003, override_inhibits: false },
          ],
        });
    },
  );

  it(
    '(AC4a, AC4b) submits every selected file and opens the Allocate tab after processing is accepted',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('POST', '/opal-fines-service/interface-jobs/process', { statusCode: 204 }).as(
        'processInterfaceJobs',
      );
      openConfirmProcess([77, 65], [201, 202, 203]);
      cy.get(AutomaticCashInputLocators.confirmProcessProcessButton).click();

      cy.wait('@processInterfaceJobs')
        .its('request.body.interface_jobs')
        .should('deep.equal', [
          { business_unit_id: 77, interface_job_id: 2001, override_inhibits: true },
          { business_unit_id: 77, interface_job_id: 2002, override_inhibits: false },
          { business_unit_id: 65, interface_job_id: 2003, override_inhibits: true },
        ]);
      cy.get(AutomaticCashInputLocators.allocateTabLink).should('have.attr', 'aria-current', 'page');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).activeTab()).to.equal('allocate');
      });
      cy.get('@financeRouter').its('url').should('contain', '#allocate');
    },
  );

  it(
    '(AC5a, AC5b) remains on Confirm before processing and displays the global error banner for a retriable failure',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      cy.intercept('POST', '/opal-fines-service/interface-jobs/process', {
        statusCode: 500,
        body: {
          retriable: true,
          title: 'Temporary System Issue',
          detail: 'Please try again later or contact the help desk.',
          operation_id: 'OP12345',
        },
      }).as('processInterfaceJobs');
      openConfirmProcess([77], [201]);
      cy.get(AutomaticCashInputLocators.confirmProcessProcessButton).click();

      cy.wait('@processInterfaceJobs').its('response.statusCode').should('eq', 500);
      cy.get('@financeRouter').its('url').should('contain', FINES_API_ROUTING_PATHS.children.confirmProcess);
      cy.get(AutomaticCashInputLocators.confirmProcessPage).should('be.visible');
      cy.get(CommonLocators.globalErrorBanner).should('be.visible');
      cy.get(CommonLocators.globalErrorBannerHeading).should('have.text', 'Temporary System Issue');
    },
  );

  it(
    '(AC6a, AC6b) discards override-inhibits amendments and returns to the Process tab when cancelled',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77], [201, 202]);
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsCheckbox(201))
        .should('be.checked')
        .uncheck({ force: true })
        .should('not.be.checked');
      cy.get(AutomaticCashInputLocators.confirmProcessCancelLink).click();

      cy.get(AutomaticCashInputLocators.processTabLink).should('have.attr', 'aria-current', 'page');
      cy.get(AutomaticCashInputLocators.processTabContent).should('be.visible');
      cy.get('@finesApiStore').then((finesApiStore) => {
        const store = finesApiStore as InstanceType<typeof FinesApiStore>;

        expect(store.activeTab()).to.equal('process');
        expect(store.selectedFileIds()).to.deep.equal([]);
        expect(store.overrideInhibitFileIds()).to.deep.equal([]);
      });
      cy.get('@financeRouter').its('url').should('contain', '#process');
    },
  );

  it(
    '(AC7 RGAC1) keeps confirmation selections when leaving is cancelled and clears them when leaving is confirmed',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77], [201]);
      cy.window().then((window) => {
        const leavePageConfirm = cy.stub(window, 'confirm');

        leavePageConfirm.onFirstCall().returns(false);
        leavePageConfirm.onSecondCall().returns(true);
        cy.wrap(leavePageConfirm).as('leavePageConfirm');
      });

      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate([
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ]),
        )
        .should('be.false');

      cy.get('@leavePageConfirm')
        .should('have.been.calledOnce')
        .and('have.been.calledWithExactly', UNSAVED_CHANGES_MESSAGE);
      cy.get(AutomaticCashInputLocators.confirmProcessPage).should('be.visible');
      cy.get(AutomaticCashInputLocators.confirmProcessOverrideInhibitsCheckbox(201)).should('be.checked');

      cy.get('@financeRouter')
        .then((router) =>
          (router as { navigate: (commands: string[]) => Promise<boolean> }).navigate([
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.root,
            FINES_DASHBOARD_ROUTING_PATHS.children.finance,
          ]),
        )
        .should('be.true');

      cy.get('@leavePageConfirm').should('have.been.calledTwice');
      cy.contains('h1', 'Finance').should('be.visible');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedFileIds()).to.deep.equal([]);
      });
    },
  );

  it(
    '(AC7 RGAC2) prevents browser exit or refresh while confirmation selections are unsaved',
    {
      tags: [
        '@JIRA-STORY:PO-2586',
        AUTOMATIC_CASH_INPUT_JIRA_LABEL,
        AUTOMATIC_CASH_INPUT_JIRA_EPIC,
        AUTOMATIC_CASH_INPUT_RELEASE_TAG,
      ],
    },
    () => {
      openConfirmProcess([77], [201]);

      cy.window().then((window) => {
        const beforeUnloadEvent = new Event('beforeunload', { cancelable: true });

        window.dispatchEvent(beforeUnloadEvent);

        expect(beforeUnloadEvent.defaultPrevented).to.be.true;
      });
      cy.get(AutomaticCashInputLocators.confirmProcessPage).should('be.visible');
      cy.get('@finesApiStore').then((finesApiStore) => {
        expect((finesApiStore as InstanceType<typeof FinesApiStore>).selectedFileIds()).to.deep.equal(['201']);
      });
    },
  );
});
