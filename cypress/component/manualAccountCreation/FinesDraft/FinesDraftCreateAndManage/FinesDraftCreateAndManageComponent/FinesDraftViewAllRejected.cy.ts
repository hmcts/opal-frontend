import { mount } from 'cypress/angular';
import { FinesDraftCreateAndManageViewAllRejectedComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-view-all-rejected/fines-draft-create-and-manage-view-all-rejected.component';
import { ActivatedRoute } from '@angular/router';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_inputter_elements';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/fines-draft-account.mock';
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';

describe('FinesDraftCreateAndManageViewAllRejectedComponent', () => {
  const setupComponent = (allRejectedAccountMock: any) => {
    mount(FinesDraftCreateAndManageViewAllRejectedComponent, {
      providers: [
        FinesDraftStore,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: ['check-and-manage'],
              data: {
                allRejectedAccounts: allRejectedAccountMock,
              },
              fragment: 'rejected',
            },
          },
        },
      ],

      componentProperties: {},
    });
  };

  it('AC.2 Should show all the headings as per the design artifact', { tags: ['@PO-618'] }, () => {
    const allRejectedMockData = structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);

    setupComponent(allRejectedMockData);
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'All rejected accounts');
  });

  it('AC.3 verify the table of headers in review tab', { tags: ['@PO-618'] }, () => {
    const allRejectedMockData = structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);

    setupComponent(allRejectedMockData);

    cy.get(DOM_ELEMENTS.tableHeadings).contains('Defendant').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Date of birth').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Account type').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Business unit').should('exist');

    //Check table row data in row 1
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.dob).contains('—');
        cy.get(DOM_ELEMENTS.created).contains('4 days ago');
        cy.get(DOM_ELEMENTS.accountType).contains('Fixed Penalty');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
      });

    //Check table row data in row 2
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
        cy.get(DOM_ELEMENTS.created).contains('Today');
        cy.get(DOM_ELEMENTS.accountType).contains('Fine');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
      });
  });
  it('(AC.4a) The table should have the correct default ordering', { tags: ['@PO-618'] }, () => {
    const allRejectedMockData = structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);

    setupComponent(allRejectedMockData);

    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Created').should('have.attr', 'aria-sort', 'ascending');
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.created).contains('4 days ago');
      });
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.created).contains('Today');
      });

    cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').click();
    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Created').should('have.attr', 'aria-sort', 'descending');

    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.created).contains('Today');
      });

    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.created).contains('4 days ago');
      });
  });

  it(
    '(AC.4b)should have pagination enabled for over 25 draft accounts for In Review accounts',
    { tags: ['@PO-618'] },
    () => {
      const allRejectedMockData = structuredClone(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK);

      setupComponent(allRejectedMockData);

      cy.get(DOM_ELEMENTS.tableCaption).contains('Showing 1 - 25 of 50 accounts').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('1').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('2').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').should('exist');
      cy.get(DOM_ELEMENTS.defendant).contains('Robert Brown').should('exist');

      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
      cy.get(DOM_ELEMENTS.defendant).contains('Emma Gonzalez').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Previous').should('exist');

      cy.get(DOM_ELEMENTS.defendant)
        .its('length')
        .then((count) => {
          expect(count).to.be.eq(25);
        });
    },
  );
});
