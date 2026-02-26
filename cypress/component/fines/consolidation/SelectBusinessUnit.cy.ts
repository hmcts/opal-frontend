import { mount } from 'cypress/angular';
import { FinesConSelectBuFormComponent } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/fines-con-select-bu-form/fines-con-select-bu-form.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { provideHttpClient } from '@angular/common/http';
import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
import { FINES_CON_SELECT_BU_FORM_DATA_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-data.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';
import { FINES_CON_DEFENDANT_TYPES } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/constants/fines-con-defendant-types.constant';
import { SelectBusinessUnitLocators } from 'cypress/shared/selectors/consolidation/SelectBusinessUnit.locators';
import { FINES_CON_SELECT_BU_FORM_INDIVIDUAL_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-individual.mock';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-company.mock';
import {
  USER_STATE_MOCK_NO_PERMISSION,
  USER_STATE_MOCK_PERMISSION_BU17,
  USER_STATE_MOCK_PERMISSION_BU77,
} from '../../CommonIntercepts/CommonUserState.mocks';
import { interceptUserState } from 'cypress/component/CommonIntercepts/CommonIntercepts';

describe('FinesConSelectBuFormComponent', () => {
  let finesConFormData = structuredClone(FINES_CON_SELECT_BU_FORM_DATA_MOCK);
  let autoCompleteItems = structuredClone(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK);
  let defendantTypes = structuredClone(FINES_CON_DEFENDANT_TYPES);

  const setupComponent = (formSubmit?: any) => {
    return mount(FinesConSelectBuFormComponent, {
      providers: [
        OpalFines,
        provideHttpClient(),
        {
          provide: FinesConStore,
          useFactory: () => {
            const store = new FinesConStore();
            store.updateSelectBuForm(finesConFormData);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('consolidation'),
            snapshot: {
              data: {
                businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
      componentProperties: {
        autoCompleteItems,
        defendantTypes,
      },
    }).then(({ fixture }) => {
      if (!formSubmit) {
        return;
      }

      const comp: any = fixture.componentInstance as any;

      if (comp?.formSubmit?.subscribe) {
        comp.formSubmit.subscribe((...args: any[]) => (formSubmit as any)(...args));
      } else if (typeof comp?.formSubmit === 'function') {
        comp.formSubmit = formSubmit;
      }
      fixture.detectChanges();
    });
  };
  beforeEach(() => {
    finesConFormData = structuredClone(FINES_CON_SELECT_BU_FORM_DATA_MOCK);
    autoCompleteItems = structuredClone(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK);
  });

  it('(AC1, AC2, AC3) should show business unit and defendant type fields', { tags: ['@PO-2412'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    finesConFormData.fcon_select_bu_business_unit_id = 1;
    setupComponent();

    cy.get(SelectBusinessUnitLocators.heading).should('contain', 'Consolidate accounts');

    //  Business Unit
    cy.get(SelectBusinessUnitLocators.businessUnitLabel).should('contain', 'Business unit');
    cy.get(SelectBusinessUnitLocators.businessUnitInput).should('be.visible');
    cy.get(SelectBusinessUnitLocators.businessUnitInput).click();
    cy.get(SelectBusinessUnitLocators.businessUnitAutoComplete).should('be.visible');
    cy.get(SelectBusinessUnitLocators.businessUnitAutoComplete).find('li').should('have.length', 7);
    cy.get(SelectBusinessUnitLocators.businessUnitAutoComplete).find('li').first().click();
    cy.get(SelectBusinessUnitLocators.businessUnitInput).should('have.value', 'Historical Debt');

    cy.get(SelectBusinessUnitLocators.defendantTypeHeading).should('contain', 'Defendant type');

    //  Radio Buttons
    cy.get(SelectBusinessUnitLocators.individualLabel).should('contain', 'Individual');
    cy.get(SelectBusinessUnitLocators.individualInput).should('be.checked');
    cy.get(SelectBusinessUnitLocators.companyLabel).should('contain', 'Company');
    cy.get(SelectBusinessUnitLocators.companyInput).should('not.be.checked');

    // Cancel & Continue buttons
    cy.get(SelectBusinessUnitLocators.continueButton).should('be.visible').and('contain', 'Continue');
    cy.get(SelectBusinessUnitLocators.cancelLink).should('be.visible').and('contain', 'Cancel');
  });

  it('(AC2) should list available business units in the autocomplete', { tags: ['@PO-2412'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    setupComponent();

    cy.get(SelectBusinessUnitLocators.businessUnitInput).click();
    cy.get(SelectBusinessUnitLocators.businessUnitAutoComplete)
      .find('li')
      .then(($items) => {
        expect($items).to.have.length(autoCompleteItems.length);
        autoCompleteItems.forEach((item, index) => {
          expect($items.eq(index)).to.contain(item.name);
        });
      });
  });

  it('(AC2a) should auto select a single business unit', { tags: ['@PO-2412'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    autoCompleteItems = structuredClone(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK.slice(0, 1));

    setupComponent();

    cy.get(SelectBusinessUnitLocators.singleBusinessUnitMessage).should(
      'have.text',
      `The consolidation will be processed in Historical Debt`,
    );
    cy.get(SelectBusinessUnitLocators.businessUnitInput).should('not.exist');
  });

  it('(AC4) should show an error when continuing without selecting a business unit', { tags: ['@PO-2412'] }, () => {
    interceptUserState(USER_STATE_MOCK_PERMISSION_BU77);
    finesConFormData.fcon_select_bu_business_unit_id = null;
    setupComponent();

    cy.get(SelectBusinessUnitLocators.continueButton).click();
    cy.get(SelectBusinessUnitLocators.businessUnitErrorMessage).should('contain', 'Select a business unit');
    cy.get(SelectBusinessUnitLocators.errorSummary).should('contain', 'Select a business unit');
  });
});
