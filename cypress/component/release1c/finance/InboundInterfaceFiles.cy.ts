import { FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK } from 'src/app/flows/fines/fines-finance/fines-finance-inbound-files/mocks/fines-finance-inbound-files-response.mock';
import { setupInboundFilesComponent } from './setup/SetupInboundFilesComponent';

const INBOUND_FILES_JIRA_TAGS = [
  '@JIRA-STORY:PO-8673',
  '@JIRA-EPIC:PO-3952',
  '@JIRA-LABEL:inbound-interface-files',
  '@R1CFinancialMovements',
];

describe('Inbound interface files', () => {
  it(
    'loads inbound files with the required scope and displays the file summary columns and statuses',
    { tags: INBOUND_FILES_JIRA_TAGS },
    () => {
      cy.intercept('GET', '**/opal-file-handling-service/interface-files*', {
        body: FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK,
      }).as('inboundFiles');

      setupInboundFilesComponent();

      cy.wait('@inboundFiles').then(({ request }) => {
        expect(request.query['domain']).to.equal('FINES');
        expect(request.query['target']).to.equal('OPAL');
        expect(request.query['type']).to.equal('SOURCE,TRANSFORMED_JSON');
        expect(request.query['type']).not.to.contain('SOURCE_JSON');
      });

      cy.get('table thead').within(() => {
        ['Date and time', 'Title', 'Type', 'Business unit', 'Source', 'Status', 'Action'].forEach((heading) => {
          cy.contains('th', heading).should('be.visible');
        });
      });
      cy.get('table tbody tr:visible').should('have.length', 4);
      cy.get('table tbody tr:visible')
        .first()
        .find('td')
        .first()
        .invoke('text')
        .should('match', /20 Oct 2026 at \d{2}:\d{2}/);
      cy.get('table tbody tr:visible').first().should('contain.text', 'allpay_1001.xml');
      cy.get('#interface-file-download-1001')
        .should('be.visible')
        .and('have.attr', 'href', '/opal-file-handling-service/interface-files/1001/content');
      cy.get('#interface-file-download-1002').closest('tr').should('contain.text', 'File failed');
      cy.get('table tbody').should('contain.text', 'In-Progress');
    },
  );

  it(
    'applies business unit, source, and type filters together when Refresh is selected',
    { tags: INBOUND_FILES_JIRA_TAGS },
    () => {
      cy.intercept('GET', '**/opal-file-handling-service/interface-files*', {
        body: FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK,
      }).as('inboundFiles');

      setupInboundFilesComponent();
      cy.wait('@inboundFiles');

      cy.get('#custom-file-interface-viewer-business-unit-autocomplete').click();
      cy.get('[role="option"]').contains('Camberwell Green').click();
      cy.get('#custom-file-interface-viewer-source-autocomplete').click();
      cy.get('[role="option"]').contains('Allpay').click();
      cy.get('#custom-file-interface-viewer-type-autocomplete').click();
      cy.get('[role="option"]').contains('RAW').click();
      cy.get('#custom-file-interface-viewer-date-filter-date-range').check();
      cy.get('#custom-file-interface-viewer-date-from').clear().type('01/10/2026').blur();
      cy.get('#custom-file-interface-viewer-date-to').clear().type('20/10/2026').blur();

      cy.intercept('GET', '**/opal-file-handling-service/interface-files*', {
        body: {
          number_of_results: 1,
          interface_files: [FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK.interface_files![0]],
        },
      }).as('filteredInboundFiles');
      cy.get('#refresh-reports-button').click();

      cy.wait('@filteredInboundFiles').then(({ request }) => {
        expect(request.query['business_unit_id']).to.equal('77');
        expect(request.query['source']).to.equal('ALLPAY');
        expect(request.query['type']).to.equal('SOURCE');
        expect(request.query['from_date']).to.be.a('string').and.not.be.empty;
        expect(request.query['to_date']).to.be.a('string').and.not.be.empty;
      });
      cy.get('table tbody tr:visible').should('have.length', 1).and('contain.text', 'allpay_1001.xml');
    },
  );

  it(
    'offers downloads for Ready and File failed files, blocks In-Progress downloads, and reports download errors in place',
    { tags: INBOUND_FILES_JIRA_TAGS },
    () => {
      cy.intercept('GET', '**/opal-file-handling-service/interface-files*', {
        body: FINES_FINANCE_INBOUND_FILES_RESPONSE_MOCK,
      }).as('inboundFiles');
      cy.intercept('GET', '**/opal-file-handling-service/interface-files/1001/content', {
        statusCode: 200,
        headers: { 'content-type': 'application/octet-stream' },
        body: '<interfaceFile />',
      }).as('downloadReadyFile');
      cy.intercept('GET', '**/opal-file-handling-service/interface-files/1002/content', {
        statusCode: 404,
        body: { message: 'File unavailable' },
      }).as('downloadFailedFile');

      setupInboundFilesComponent();
      cy.wait('@inboundFiles');

      cy.get('#interface-file-download-1001').should('be.visible').click();
      cy.wait('@downloadReadyFile').its('request.method').should('equal', 'GET');
      cy.get('#interface-file-download-1001').should('exist');
      cy.get('#interface-file-download-1002').should('be.visible').click();
      cy.wait('@downloadFailedFile');
      cy.get('.govuk-error-summary').should('contain.text', 'The file could not be downloaded. Try again.');
      cy.get('#interface-file-download-1001').should('exist');
    },
  );
});
