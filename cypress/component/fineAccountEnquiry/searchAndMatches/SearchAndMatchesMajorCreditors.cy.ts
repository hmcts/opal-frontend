import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_major_creditors_elements';
import { MAJOR_CREDITORS_SEARCH_STATE_MOCK } from './mocks/search_and_matches_major_creditors_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { of } from 'rxjs';

describe('Search Account Component - Major Creditors', () => {
  let majorCreditorsSearchMock = structuredClone(MAJOR_CREDITORS_SEARCH_STATE_MOCK);

  const setupComponent = () => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        {
          provide: Router,
          useValue: {
            navigate: cy.spy().as('router'),
            createUrlTree: cy.spy().as('urlTree'),
            serializeUrl: cy.spy().as('serializeUrl'),
            navigateByUrl: cy.spy().as('navigateByUrl'),
          },
        },
        OpalFines,
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            store.setSearchAccount(majorCreditorsSearchMock);

            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('majorCreditors'),
            snapshot: {
              data: {
                businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
              parent: {
                snapshot: {
                  url: [{ path: 'search' }],
                },
              },
            },
          },
        },
      ],
    });
  };
  beforeEach(() => {
    majorCreditorsSearchMock = structuredClone(MAJOR_CREDITORS_SEARCH_STATE_MOCK);

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
  });

  it('AC1. should render the search for an account screen and major creditors tab', { tags: ['PO-716'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search for an account');
    cy.get(DOM_ELEMENTS.tabs).should('exist');
    cy.get(DOM_ELEMENTS.tabsList).should('exist');
    cy.get(DOM_ELEMENTS.individualsTab).should('exist');
    cy.get(DOM_ELEMENTS.companiesTab).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.majorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.majorCreditorsPanel).should('exist');
    cy.get(DOM_ELEMENTS.majorCreditorsHeading).should('exist').contains('Major creditors');
    cy.get(DOM_ELEMENTS.majorCreditorsHelpText).should('exist').contains('Search using creditor name or code');
    cy.get(DOM_ELEMENTS.majorCreditorDropdown).should('exist');
    cy.get(DOM_ELEMENTS.accountNumberLabel).should('exist').and('contain', 'Account number');
    cy.get(DOM_ELEMENTS.referenceNumberLabel).should('exist').and('contain', 'Reference or case number');
    cy.get(DOM_ELEMENTS.referenceNumberInput).should('exist');
    cy.get(DOM_ELEMENTS.activeAccountsOnlyCheckbox).should('be.checked');
    cy.get(DOM_ELEMENTS.searchButton).should('exist').and('contain', 'Search');
  });

  it('AC2. Single BU filtered and dropdown contents', { tags: ['PO-716'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.majorCreditorDropdown).click();
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).should('have.length', 7);
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete)
      .find('li')
      .eq(0)
      .should('contain', 'Crown Prosecution Service (DPP)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete)
      .find('li')
      .eq(1)
      .should('contain', 'Crown Prosecution Service (CPS)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(2).should('contain', 'DVLA (DVL)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(3).should('contain', 'jkjk (*)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(4).should('contain', 'LBUSMajorCreditor (LBUS)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(5).should('contain', 'Police (Pole)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(6).should('contain', 'Temporary Creditor (TEMP)');
  });

  it('AC2. Type ahead and non-case sensitive search', { tags: ['PO-716'] }, () => {
    //majorCreditorsSearchMock.fsa_search_account_major_creditors_major_creditor_id-autocomplete = 'crown';
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).should('have.length', 4);
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete)
      .find('li')
      .eq(0)
      .should('contain', 'Crown Prosecution Service (DPP)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete)
      .find('li')
      .eq(1)
      .should('contain', 'Crown Prosecution Service (CPS)');
  });

  //AC2f and AC2h coverage

  it('AC3. Multiple BUs filtered', { tags: ['PO-716'] }, () => {
    setupComponent();

    //Second mock required for multiple BUs?
  });

  it('AC4. User remains on the screen after clicking search if no fields are populated', { tags: ['PO-716'] }, () => {
    setupComponent();

    //Check with dev, doesn't seem to be working
  });

  it('AC5. Major creditor tab error validation', { tags: ['PO-716'] }, () => {
    setupComponent();

    //At present, none of these errors trigger, check with dev

    //majorCreditorsSearchMock.fsa_search_account_major_creditors_major_creditor_id-autocomplete = 'abcdefghijklmnopqrstuvwxyzabcdefghij';
    //cy.get(DOM_ELEMENTS.majorCreditorDropdown).clear().blur();
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.majorCreditorLengthError)
      .should('exist')
      .and('contain', 'Major Creditor search must be 35 characters or fewer');

    //majorCreditorsSearchMock.fsa_search_account_major_creditors_major_creditor_id-autocomplete = 'invalid!@£';
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.majorCreditorLengthError)
      .should('exist')
      .and(
        'contain',
        'Major Creditor search must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );

    //majorCreditorsSearchMock.fsa_search_account_major_creditors_major_creditor_id-autocomplete = 'Fakemajorcreditor (FAKE)';
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.majorCreditorLengthError).should('exist').and('contain', 'Please enter a valid Major Creditor');
  });

  it('AC6. Validation passes', { tags: ['PO-716'] }, () => {
    majorCreditorsSearchMock.fsa_search_account_business_unit_ids = [73]; //Single BU to enable major creditors
    //can also set multiple BUs to test that path
    //majorCreditorsSearchMock.fsa_search_account_business_unit_ids = [61, 67, 68, 69, 70, 71, 73];

    // this does not work for some reason, just type instead
    // majorCreditorsSearchMock.fsa_search_account_major_creditors_search_criteria = {
    //   fsa_search_account_major_creditors_major_creditor_id: 3858,
    // };

    setupComponent();

    cy.get('a').contains('Change').click();
    cy.get('@router').should('have.been.calledWithMatch', ['filter-business-units']);
  });
  it('other tests', { tags: ['PO-716'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.majorCreditorDropdown).click();
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').contains('Arriva Rail North').click();
    cy.get(DOM_ELEMENTS.majorCreditorDropdown).should('have.value', 'Arriva Rail North (ARVA)');

    cy.get(DOM_ELEMENTS.searchButton).click();
    const accountId = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.refData[3].major_creditor_id; //3858
    //This url does not look right, might need checking with Dev
    cy.get('@urlTree').should('have.been.calledWithMatch', [`fines/account/${accountId}/undefined`]);

    //A stub is used here so a new tab is not actually opened
    cy.get('@windowOpen').should('have.been.calledOnce');
  });
});
