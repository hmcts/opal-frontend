import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

// Component under test
import { FinesAccDefendantDetailsComponent } from '../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/fines-acc-defendant-details.component';

// Injected services
import { FinesAccountStore } from '../../../../src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

// Your constants + mocks
import { DOM_ELEMENTS as DOM } from './constants/defendant_details_elements';
import {
  DEFENDANT_HEADER_MOCK,
  DEFENDANT_HEADER_YOUTH_MOCK,
  DEFENDANT_HEADER_PARENT_GUARDIAN_MOCK,
  MOCK_ACCOUNT_STATE,
} from './mocks/defendant_details_mock';
import { snapshot } from 'node:test';
import { url } from 'node:inspector';
import { contains } from 'cypress/types/jquery';

describe('Defendant Account Summary (Component)', () => {
  const setupComponent = (prefilledData = DEFENDANT_HEADER_MOCK, canAddNotes = true) => {
    mount(FinesAccDefendantDetailsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            store.setAccountState(MOCK_ACCOUNT_STATE);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('at-a-glance'),
            snapshot: {
              data: {
                defendantAccountHeadingData: prefilledData,
              },
              fragment: 'at-a-glance',
              parent: { snapshot: { url: [{ path: 'defendant' }] } },
            },
          },
        },
        UtilsService,
        {
          provide: GlobalStore,
          useValue: { userState: () => ({ userName: 'opal-tester', business_unit_users: [] }) },
        },
        {
          provide: PermissionsService,
          useValue: {
            hasPermissionAccess: cy.stub().as('hasPermissionAccess').returns(canAddNotes),
            hasPermission: cy.stub().as('hasPermission').returns(canAddNotes),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: cy.stub().as('routerNavigate'),
          },
        },
      ],
    });
  };

  // Header renders
  it('AC1a: renders the Defendant Account Header Summary', { tags: ['PO-1593', 'PO-866'] }, () => {
    setupComponent(DEFENDANT_HEADER_YOUTH_MOCK);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get(DOM.headingFullName).should('exist').and('contain.text', 'Anna Graham');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(DOM.atAGlanceTabComponent).should('exist');
  });

  // Field rules (PCR uppercase, BU display, summary labels/currency present)
  it(
    'AC1b: applies field rules (PCR uppercase, BU formatting, summary labels)',
    { tags: ['PO-1593', 'PO-866'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_MOCK);
      header.prosecutor_case_reference = 'ref123'; // UI should uppercase

      setupComponent(header);

      cy.get(DOM.accountInfo).within(() => {
        cy.contains(DOM.labelAccountType).should('be.visible');
        cy.contains(String(header.account_type)).should('be.visible');

        cy.contains(DOM.labelCaseNumber).should('be.visible');
        cy.contains('REF123').should('be.visible');

        cy.contains(DOM.labelBusinessUnit).should('be.visible');
        cy.contains(header.business_unit_summary.business_unit_name).should('be.visible');
        cy.contains(`(${header.business_unit_summary.business_unit_id})`).should('be.visible');
      });

      cy.get(DOM.summaryMetricBar).within(() => {
        cy.contains(DOM.labelImposed).should('be.visible');
        cy.contains(DOM.labelArrears).should('be.visible');
        cy.contains('£').should('exist'); // any currency value in the bar
      });
    },
  );

  //  ONLY Youth tag when youth is the debtor and no P/G associated
  it(
    'AC2: shows ONLY "Youth Account" when youth=true, debtor=Defendant, and no Parent/Guardian',
    { tags: ['PO-1593'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
      header.debtor_type = 'Defendant';
      header.parent_guardian_party_id = null;

      setupComponent(header);

      cy.get(DOM.statusTag).should('exist').and('contain.text', 'Youth Account');
    },
  );

  it('AC2: shows ONLY "Parent or Guardian" when youth=true, debtor=Parent/Guardian', { tags: ['PO-866'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
    header.debtor_type = 'Parent/Guardian';
    header.parent_guardian_party_id = '99';

    setupComponent(header);

    cy.get(DOM.statusTag)
      .should('exist')
      .and('contain.text', 'Parent or Guardian to pay')
      .and('have.class', 'govuk-tag');
    cy.get(DOM.statusTag).should('not.contain.text', 'Youth Account');
  });

  //  ONLY "Parent or Guardian to pay" (even if youth)
  it('AC2i: Youth defendant who is not the debtor hides "Youth" label', { tags: ['PO-1593', 'PO-866'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_YOUTH_MOCK);
    header.debtor_type = 'Parent/Guardian';
    header.parent_guardian_party_id = '99';

    setupComponent(header);

    cy.get(DOM.statusTag).should('not.contain.text', 'Youth Account');
    cy.get(DOM.statusTag).should('contain.text', 'Parent or Guardian to pay');
  });

  //  Adult defendant → no tag at all
  it('AC2a: renders no tag for adult defendants', { tags: ['PO-1593'] }, () => {
    const adult = structuredClone(DEFENDANT_HEADER_MOCK);
    adult.is_youth = false;
    adult.debtor_type = 'Defendant';
    adult.parent_guardian_party_id = null;

    setupComponent(adult);

    cy.get(DOM.statusTag).should('not.exist');
  });

  // Negative balance prefixed with minus (e.g. -£4.50)
  it('AC3: negative balance is prefixed with a minus', { tags: ['PO-1593', 'PO-866'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_MOCK);
    header.payment_state_summary.account_balance = -4.5;

    setupComponent(header);

    cy.get(DOM.summaryMetricBar)
      .contains(/-£\s*4\.50|−£\s*4\.50/)
      .should('exist');
  });

  it('AC4: shows "Add account note" when user has permission', { tags: ['PO-1593', 'PO-866'] }, () => {
    setupComponent(DEFENDANT_HEADER_MOCK, true);
    cy.get(DOM.addNoteButton).should('exist').and('be.enabled');
  });

  // Intent-only (navigation verified in E2E)
  it('AC4 (intent): clicking "Add account note" calls router.navigate', { tags: ['PO-1593', 'PO-866'] }, () => {
    setupComponent(DEFENDANT_HEADER_MOCK, true);
    cy.get(DOM.addNoteButton).click();
    cy.get('@routerNavigate').should('have.been.called');
  });

  it('AC4b: hides "Add account note" when user has no permission in any BU', { tags: ['PO-1593', 'PO-866'] }, () => {
    setupComponent(DEFENDANT_HEADER_MOCK, false);

    cy.get('@hasPermissionAccess').should('have.been.called');
    cy.get(DOM.addNoteButton).should('not.exist');
  });
});
