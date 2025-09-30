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
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU77,
  USER_STATE_MOCK_PERMISSION_BU17,
  DEFENDANT_HEADER_ORG_MOCK,
  MOCK_ACCOUNT_STATE,
} from './mocks/defendant_details_mock';
import { snapshot } from 'node:test';
import { url } from 'node:inspector';
import { contains } from 'cypress/types/jquery';

describe('Defendant Account Summary (Component)', () => {
  const setupComponent = (prefilledData = DEFENDANT_HEADER_MOCK, user = USER_STATE_MOCK_NO_PERMISSION) => {
    mount(FinesAccDefendantDetailsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesAccountStore,
          useFactory: () => {
            const store = new FinesAccountStore();
            const mockState = structuredClone(MOCK_ACCOUNT_STATE);
            if (prefilledData.party_details.organisation_flag) {
              mockState.party_name = prefilledData.party_details.organisation_details?.organisation_name ?? '';
              mockState.party_type = 'Organisation';
            } else {
              mockState.party_name =
                `${prefilledData.party_details.individual_details?.forenames ?? ''} ${prefilledData.party_details.individual_details?.surname ?? ''}`.trim();
              mockState.party_type = 'Individual';
            }

            store.setAccountState(mockState);
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
          useFactory: () => {
            let store = new GlobalStore();
            store.setUserState(user);
            return store;
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
    cy.get(DOM.headingName).should('exist').and('contain.text', 'Anna Graham');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(DOM.atAGlanceTabComponent).should('exist');
  });

  // Header renders
  it('AC1a: renders the Company Account Header Summary', { tags: ['PO-867'] }, () => {
    setupComponent(DEFENDANT_HEADER_ORG_MOCK);

    cy.get(DOM.pageHeader).should('exist');
    cy.get(DOM.headingWithCaption).should('exist');
    cy.get(DOM.headingName).should('exist').and('contain.text', 'Sainsco');
    cy.get(DOM.accountInfo).should('exist');
    cy.get(DOM.summaryMetricBar).should('exist');
    cy.get(DOM.subnav).should('exist');
    cy.get(DOM.atAGlanceTabComponent).should('exist');
  });

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

  it(
    'AC1b: applies field rules (PCR uppercase, BU formatting, summary labels) - Company',
    { tags: ['PO-1593', 'PO-866'] },
    () => {
      const header = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
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

  // ONLY Youth tag when youth is the debtor and no P/G associated
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

  it('AC3: negative balance is prefixed with a minus - Company', { tags: ['PO-867'] }, () => {
    const header = structuredClone(DEFENDANT_HEADER_ORG_MOCK);
    header.payment_state_summary.account_balance = -4.5;

    setupComponent(header);

    cy.get(DOM.summaryMetricBar)
      .contains(/-£\s*4\.50|−£\s*4\.50/)
      .should('exist');
  });

  it('AC4: shows "Add account note" when user has permission', { tags: ['PO-1593', 'PO-866', 'PO-867'] }, () => {
    setupComponent(DEFENDANT_HEADER_MOCK, USER_STATE_MOCK_PERMISSION_BU77);
    cy.get(DOM.addNoteButton).should('exist').and('be.enabled');
  });


  it('AC4: clicking "Add account note" calls router.navigate', { tags: ['PO-1593', 'PO-866', 'PO-867'] }, () => {
    setupComponent(DEFENDANT_HEADER_MOCK, USER_STATE_MOCK_PERMISSION_BU17);
    cy.get(DOM.addNoteButton).click();
    cy.get('@routerNavigate').should('have.been.called')
    cy.get('@routerNavigate').its('lastCall.args.0').should('deep.equal', ['../note/add']);;
  });

  it('AC4b: hides "Add account note" when user has no permission in any BU', { tags: ['PO-1593', 'PO-866'] }, () => {
    setupComponent(DEFENDANT_HEADER_MOCK, USER_STATE_MOCK_NO_PERMISSION);
    cy.get(DOM.addNoteButton).should('not.exist');
  });

  it('AC3: shows "Add account note" when user has permission - Company', { tags: ['PO-867'] }, () => {
    setupComponent(DEFENDANT_HEADER_ORG_MOCK, USER_STATE_MOCK_PERMISSION_BU77);
    cy.get(DOM.addNoteButton).should('exist').and('be.enabled');
  });

  it.only('AC3: clicking "Add account note" calls router.navigate - Company', { tags: ['PO-867'] }, () => {
    setupComponent(DEFENDANT_HEADER_ORG_MOCK, USER_STATE_MOCK_PERMISSION_BU17);
    cy.get(DOM.addNoteButton).click();
    cy.get('@routerNavigate').should('have.been.called');
    cy.get('@routerNavigate').its('lastCall.args.0').then((arg0) => {const path = Array.isArray(arg0) ? arg0.join('/') : String(arg0); expect(path).to.match(/no-?permission|lack-?permission/i); });    
  });

  it('AC3b: hides "Add account note" when user has no permission in any BU - Company', { tags: ['PO-867'] }, () => {
    setupComponent(DEFENDANT_HEADER_ORG_MOCK, USER_STATE_MOCK_NO_PERMISSION);
    cy.get(DOM.addNoteButton).should('not.exist');
  });
});
