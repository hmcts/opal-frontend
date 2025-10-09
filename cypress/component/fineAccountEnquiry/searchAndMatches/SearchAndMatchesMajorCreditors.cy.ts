import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_major_creditors_elements';
import { MAJOR_CREDITORS_SEARCH_STATE_MOCK } from './mocks/search_and_matches_major_creditors_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { of, BehaviorSubject } from 'rxjs';

describe('Search Account Component - Major Creditors', () => {
  let majorCreditorsSearchMock = structuredClone(MAJOR_CREDITORS_SEARCH_STATE_MOCK);
  const fragment$ = new BehaviorSubject<string | null>(null);

  const setupComponent = () => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        {
          provide: Router,
          useValue: {
            navigate: cy
              .spy((commands: unknown[], extras?: NavigationExtras) => {
                if (extras?.fragment !== undefined) {
                  fragment$.next(extras.fragment);
                }
                return Promise.resolve(true);
              })
              .as('routerNavigate'),
            createUrlTree: cy.spy().as('urlTree'),
            serializeUrl: cy.spy().as('serializeUrl'),
            navigateByUrl: cy.spy().as('navigateByUrl'),
          } as unknown as Router,
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
            fragment: fragment$.asObservable(),
            snapshot: {
              data: {
                businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
              parent: { snapshot: { url: [{ path: 'search' }] } },
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

    cy.get(DOM_ELEMENTS.majorCreditorsTab).click();
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

    cy.get('a').contains('Change').click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['filter-business-units']);
  });

  it('AC2a, AC2b, AC2c. Single BU filtered and dropdown contents', { tags: ['PO-716'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.majorCreditorsHeading).should('exist').contains('Major creditors');
    cy.get(DOM_ELEMENTS.majorCreditorsHelpText).should('exist').contains('Search using creditor name or code');
    cy.get(DOM_ELEMENTS.majorCreditorDropdown).click();
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').should('have.length', 4);
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(0).should('contain', 'Abellio Greater Anglia (AGAL)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(1).should('contain', 'Aberdeen JP Court (ABJP)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(2).should('contain', 'Aldi Stores Ltd (ALDI)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(3).should('contain', 'Arriva Rail North (ARVA)');
  });

  it('AC2d. Type ahead and non-case sensitive search', { tags: ['PO-716'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.majorCreditorDropdown).click().type('ab');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(0).should('contain', 'Abellio Greater Anglia (AGAL)');
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').eq(1).should('contain', 'Aberdeen JP Court (ABJP)');
  });

  it(
    'AC2f. Navigated to account enquiry when major creditor is selected and searched for',
    { tags: ['PO-716'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.majorCreditorDropdown).click();
      cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').contains('Arriva Rail North').click();
      cy.get(DOM_ELEMENTS.majorCreditorDropdown).should('have.value', 'Arriva Rail North (ARVA)');

      cy.get(DOM_ELEMENTS.searchButton).click();
      const accountId = OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK.refData[3].major_creditor_id; //3858
      //The expected screen has not yet been developed, change URL once it has.
      cy.get('@urlTree').should('have.been.calledWithMatch', [`fines/account/${accountId}/defendant`]);

      //A stub is used here so a new tab is not actually opened
      cy.get('@windowOpen').should('have.been.calledOnce');
    },
  );

  it('AC2h. Data cleared when another tab is selected', { tags: ['PO-716'] }, () => {
    setupComponent();

    majorCreditorsSearchMock.fsa_search_account_number = '12345678';
    majorCreditorsSearchMock.fsa_search_account_reference_case_number = 'REF123';

    cy.get(DOM_ELEMENTS.majorCreditorDropdown).click();
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').contains('Abellio Greater Anglia').click();
    cy.get(DOM_ELEMENTS.majorCreditorDropdown).should('have.value', 'Abellio Greater Anglia (AGAL)');
    cy.get(DOM_ELEMENTS.minorCreditorsTab).click();
    cy.get(DOM_ELEMENTS.majorCreditorsTab).click();
    cy.get(DOM_ELEMENTS.majorCreditorDropdown).should('have.value', '');
  });

  it('AC3. Multiple BUs filtered unhappy path', { tags: ['PO-716'] }, () => {
    setupComponent();

    majorCreditorsSearchMock.fsa_search_account_business_unit_ids = [61, 67, 68, 69, 70, 71, 73];
    cy.get(DOM_ELEMENTS.majorCreditorsHeading).should('exist').contains('Major creditors');
    cy.get(DOM_ELEMENTS.majorCreditorBusinessUnitLabel)
      .should('exist')
      .contains('To search major creditors, filter by a single business unit');
    cy.get(DOM_ELEMENTS.majorCreditorBusinessUnitLink).should('exist').contains('filter by a single business unit');
    cy.get('a').contains('filter by a single business unit');
  });

  it('AC4, AC5. Major creditor tab error validation', { tags: ['PO-716'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.majorCreditorMissingError)
      .should('exist')
      .and('contain', 'Enter a major creditor name or code');
  });

  it('AC6. Validation passes nagivated to problem screen', { tags: ['PO-716'] }, () => {
    setupComponent();
    majorCreditorsSearchMock.fsa_search_account_number = '12345678';
    majorCreditorsSearchMock.fsa_search_account_reference_case_number = 'REF123';
    cy.get(DOM_ELEMENTS.majorCreditorDropdown).click();
    cy.get(DOM_ELEMENTS.majorCreditorAutoComplete).find('li').contains('Abellio Greater Anglia').click();
    cy.get(DOM_ELEMENTS.majorCreditorDropdown).should('have.value', 'Abellio Greater Anglia (AGAL)');

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get('@routerNavigate').should('have.been.calledWithMatch', ['problem']);
  });
});
