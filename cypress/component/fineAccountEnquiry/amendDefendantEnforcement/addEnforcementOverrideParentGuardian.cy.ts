import { mount } from 'cypress/angular';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FinesAccEnfOverrideAddChangeComponent } from 'src/app/flows/fines/fines-acc/fines-acc-enf-override-add-change/fines-acc-enf-override-add-change.component';
import { FinesAccEnfOverrideAddChangeFormComponent } from 'src/app/flows/fines/fines-acc/fines-acc-enf-override-add-change/fines-acc-enf-override-add-change-form/fines-acc-enf-override-add-change-form.component';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import { FinesAccPayloadService } from 'src/app/flows/fines/fines-acc/services/fines-acc-payload.service';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DOM_ELEMENTS } from './constants/add_enforcement_override_elements';

const mockRoute: ActivatedRoute = {
  snapshot: {
    data: {
      title: 'Add enforcement override',
      enforcersRefData: {
        refData: [
          { enforcer_id: 'E1', enforcer_code: 'EC1', name: 'Enforcer One' },
          { enforcer_id: 'E2', enforcer_code: 'EC2', name: 'Enforcer Two' },
        ],
      },
      localJusticeAreasRefData: {
        refData: [
          { local_justice_area_id: 'L1', name: 'LJA One' },
          { local_justice_area_id: 'L2', name: 'LJA Two' },
        ],
      },
      resultsRefData: {
        refData: [
          { result_id: 'R1', result_title: 'Result One', requires_enforcer: true },
          { result_id: 'R2', result_title: 'Result Two' },
        ],
      },
    },
  },
} as any;

const mockStore = {
  party_name: () => 'Test Person',
  getAccountNumber: () => '123456',
  account_id: () => 1001,
  base_version: () => '1',
  business_unit_id: () => '2002',
  setSuccessMessage: () => {},
};

const mockPayloadService = {
  buildEnforcementOverrideFormPayload: () => ({ enforcement_override: {} }),
};

const mockOpalFinesService = {
  getEnforcerPrettyName: (e: { name: string; enforcer_code: string }) => `${e.name} (${e.enforcer_code})`,

  getLocalJusticeAreaPrettyName: (lja: { name: string; local_justice_area_id: string }) =>
    `${lja.name} (${lja.local_justice_area_id})`,

  getResultPrettyName: (r: { result_title: string; result_id: string }) => `${r.result_title} (${r.result_id})`,

  getResult: () => of({ requires_enforcer: false, requires_lja: false }),
  patchDefendantAccount: () => of({}),
};

const mockUtilsService = {
  scrollToTop: () => {},
};

const setup = () => {
  return mount(FinesAccEnfOverrideAddChangeComponent, {
    providers: [
      { provide: ActivatedRoute, useValue: mockRoute },
      { provide: FinesAccountStore, useValue: mockStore },
      { provide: FinesAccPayloadService, useValue: mockPayloadService },
      { provide: OpalFines, useValue: mockOpalFinesService },
      { provide: UtilsService, useValue: mockUtilsService },
    ],
  });
};

describe('Add Enforcement Override', () => {
  it('AC1a, AC1b. Should render the form with title', () => {
    setup();

    cy.get(DOM_ELEMENTS.title).should('contain.text', 'Test Person - 123456');
    cy.get(DOM_ELEMENTS.title).should('contain.text', 'Add enforcement override');
  });

  it('AC1c, AC1d. Select an enforcement override dropdown, add override button and cancel link', () => {
    setup();

    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('exist');
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).click();
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('ABDC').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('AEOC').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('BWTD').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('BWTU').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('CLAMPO').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('CWN').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('DW').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('FSN').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('MAN').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('NBWT').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('REGF').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('SUMA').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('TFOOUT').should('exist');

    cy.get(DOM_ELEMENTS.addOverrideButton).should('exist');
    cy.get(DOM_ELEMENTS.cancelLink).should('exist');
  });

  it('AC2. Enforcer dropdown for valid override', () => {
    setup();

    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('exist');
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).click().type('AB');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('ABDC').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('AEOC').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('BWTD').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('BWTU').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('CLAMPO').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('CWN').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('DW').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('FSN').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('MAN').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('NBWT').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('REGF').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('SUMA').should('not.exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('TFOOUT').should('not.exist');

    cy.get(DOM_ELEMENTS.dropdownOptions).contains('ABDC').click();
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('have.value', 'ABDC');

    cy.get(DOM_ELEMENTS.enforcerDropdown).should('exist');
    cy.get(DOM_ELEMENTS.enforcerDropdown).click();
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('<PlaceholderEnforcer>').should('exist');
  });

  it('AC3. LJA dropdown for valid override', () => {
    setup();

    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('exist');
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).click().type('TFO');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('TFOOUT').should('exist');

    cy.get(DOM_ELEMENTS.dropdownOptions).contains('TFOOUT').click();
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('have.value', 'TFOOUT');
    cy.get(DOM_ELEMENTS.localJusticeAreaDropdown).should('exist');
    cy.get(DOM_ELEMENTS.localJusticeAreaDropdown).click();
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('<PlaceholderLJA>').should('exist');
  });

  it('AC4a. Error when no enforcement override is selected', () => {
    setup();

    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('exist');
    cy.get(DOM_ELEMENTS.addOverrideButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select an enforcement override');
  });

  it('AC4b. Error when no enforcer is selected', () => {
    setup();

    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('exist');
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).click().type('BW');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('BWTD').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('BWTU').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('BWTD').click();
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('have.value', 'BWTD');
    cy.get(DOM_ELEMENTS.enforcerDropdown).should('exist');

    cy.get(DOM_ELEMENTS.addOverrideButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select an enforcer');
  });

  it('AC4c. Error when no LJA is selected', () => {
    setup();

    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('exist');
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).click().type('TFO');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('TFOOUT').should('exist');
    cy.get(DOM_ELEMENTS.dropdownOptions).contains('TFOOUT').click();
    cy.get(DOM_ELEMENTS.enfOverrideDropdown).should('have.value', 'TFOOUT');
    cy.get(DOM_ELEMENTS.localJusticeAreaDropdown).should('exist');

    cy.get(DOM_ELEMENTS.addOverrideButton).click();
    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .contains('There is a problem')
      .next()
      .should('contain.text', 'Select a Local Justice Area');
  });

  // TODO: AC5 Validation Passes
  // TODO: AC6 Cancel link behaviour and route guard
});
