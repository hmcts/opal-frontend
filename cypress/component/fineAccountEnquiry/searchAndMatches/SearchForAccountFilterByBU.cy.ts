// PO-711 – Cypress Component Test
// Component under test: FinesSaSearchFilterBusinessUnitComponent

import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { SearchFilterByBUCommonLocators as CommonLocators } from '../../../shared/selectors/account-search/account.search.filter-by-bu.common.locators';
import { FinesFilterBusinessUnitConfiscationLocators as ConfiscationLocators } from '../../../shared/selectors/account-search/account.search.filter-by-bu-confiscation.locators';
import { FinesFilterBusinessUnitLocators as FinesLocators } from '../../../shared/selectors/account-search/account.search.filter-by-bu-fines.locators';
import { SearchFilterByBUNavLocators as NavLocators } from '../../../shared/selectors/account-search/account.search.filter-by-bu.nav.locators';
import { FinesSaStore } from 'src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaSearchFilterBusinessUnitComponent } from 'src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-filter-business-unit/fines-sa-search-filter-business-unit.component';

// Unit-test refData (resolver payload)
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const ACCOUNT_ENQUIRY_STORY_TAG = '@JIRA-STORY:PO-711';
const EXACT_ERROR_TEXT = 'You must select at least one business unit';

type BusinessUnitTab = 'fines' | 'confiscation';

const TAB_LABELS: Record<BusinessUnitTab, string> = {
  fines: 'Fines',
  confiscation: 'Confiscation',
};

const MASTER_LABEL_TEXT: Record<BusinessUnitTab, string> = {
  fines: 'Fines business units',
  confiscation: 'Confiscation business units',
};

const TAB_LINK_SELECTORS: Record<BusinessUnitTab, string> = {
  fines: NavLocators.finesTabLink,
  confiscation: NavLocators.confiscationTabLink,
};

const MASTER_LABEL_SELECTORS: Record<BusinessUnitTab, string> = {
  fines: FinesLocators.selectAllBusinessUnitsLabel,
  confiscation: ConfiscationLocators.selectAllBusinessUnitsLabel,
};

const ROW_LABEL_SELECTORS: Record<BusinessUnitTab, string> = {
  fines: FinesLocators.businessUnitLabels,
  confiscation: ConfiscationLocators.businessUnitLabels,
};

const ROW_CHECKBOX_SELECTORS: Record<BusinessUnitTab, string> = {
  fines: FinesLocators.businessUnitCheckboxes,
  confiscation: ConfiscationLocators.businessUnitCheckboxes,
};

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_STORY_TAG, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Filter by Business Unit (CT)', () => {
  let resolverPayload: typeof OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK;
  let preselectedIds: number[];
  let expectedFinesNames: string[];
  let expectedConfNames: string[];
  let fragment$: BehaviorSubject<string>;

  // ---------------- helpers ----------------

  const norm = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b));

  const extractLabels = ($labels: JQuery<HTMLElement>): string[] =>
    // Avoid TS casts: use jQuery -> array, then DOM API safely
    Cypress.$.makeArray($labels).map((el) => (el.textContent ?? '').trim());

  const getRowLabels = (tab: BusinessUnitTab) => cy.get(ROW_LABEL_SELECTORS[tab]);

  const getRowCheckboxes = (tab: BusinessUnitTab) => cy.get(ROW_CHECKBOX_SELECTORS[tab]);

  const getMasterLabel = (tab: BusinessUnitTab) => cy.contains(MASTER_LABEL_SELECTORS[tab], MASTER_LABEL_TEXT[tab]);

  const clickTab = (tab: BusinessUnitTab) => cy.get(TAB_LINK_SELECTORS[tab]).scrollIntoView().click({ force: true });

  const textNorm = (s: string) => s.replace(/\s+/g, ' ').trim();

  const assertSaveCount = (n: number) => {
    cy.get(CommonLocators.saveSelectionButton)
      .invoke('text')
      .then((t) => {
        const txt = textNorm(t);
        const re = new RegExp(`^Save selection(?: \\(\\s*${n}\\s*\\))?$`);
        expect(txt, 'selection count on Save button').to.match(re);
      });
  };

  const ensureAtLeastNRows = (tab: BusinessUnitTab, n: number) =>
    getRowCheckboxes(tab).should(($rows) => {
      expect($rows.length, `need at least ${n} rows`).to.be.gte(n);
    });

  const switchToConfiscation = () => {
    clickTab('confiscation');
    cy.then(() => {
      fragment$.next('confiscation');
      window.location.hash = '#confiscation';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    getMasterLabel('confiscation').should('be.visible');
  };

  const setupComponent = () => {
    fragment$ = new BehaviorSubject<string>('fines'); // default tab

    mount(FinesSaSearchFilterBusinessUnitComponent, {
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'fines/search-accounts', component: FinesSaSearchFilterBusinessUnitComponent },
          { path: 'fines/search-accounts/filter-business-units', component: FinesSaSearchFilterBusinessUnitComponent },
        ]),
        OpalFines,
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            if (preselectedIds.length) store.setBusinessUnitIds(preselectedIds);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: fragment$.asObservable(),
            snapshot: { fragment: 'fines', data: { businessUnits: resolverPayload } },
            parent: { snapshot: { url: [{ path: 'search' }] } },
          },
        },
      ],
    });
  };

  // ---------------- test data  ----------------

  beforeEach(() => {
    resolverPayload = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
    preselectedIds = [];

    expectedFinesNames = resolverPayload.refData
      .filter((bu) => String(bu.opal_domain).toLowerCase() === 'fines')
      .map((bu) => bu.business_unit_name);

    expectedConfNames = resolverPayload.refData
      .filter((bu) => String(bu.opal_domain).toLowerCase() === 'confiscation')
      .map((bu) => bu.business_unit_name);
  });

  // ---------------- AC1c ----------------

  it('AC1c: shows tabs, master label, Fines list alphabetical (A→Z), and Save/Cancel controls', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4524'] }, () => {
      setupComponent();

      // Tabs exist by visible text
      cy.get(NavLocators.finesTabLink).should('contain.text', TAB_LABELS.fines);
      cy.get(NavLocators.confiscationTabLink).should('contain.text', TAB_LABELS.confiscation);

      // Master checkbox label (Fines)
      getMasterLabel('fines')
        .invoke('text')
        .then((t) => expect(t.trim()).to.eq(MASTER_LABEL_TEXT.fines));

      // Fines BU labels in the table
      getRowLabels('fines').then(($labels) => {
        const actual = extractLabels($labels);
        expect(norm(actual), 'Fines members match').to.deep.equal(norm(expectedFinesNames));
        expect(actual, 'Fines alphabetical (A→Z)').to.deep.equal(norm(actual));
      });

      // Controls
      cy.get(CommonLocators.saveSelectionButton)
        .invoke('text')
        .then((t) => {
          expect(t.trim()).to.match(/^Save selection/);
        });
      cy.get(CommonLocators.cancelLink).should('have.text', 'Cancel');
    });

  // ---------------- AC1ci ----------------

  it('AC1ci: all business units are selected when filter is set to "All business units" (Fines tab)', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4525'] }, () => {
      // Preselect all Fines IDs
      preselectedIds = resolverPayload.refData
        .filter((bu) => String(bu.opal_domain).toLowerCase() === 'fines')
        .map((bu) => bu.business_unit_id);

      setupComponent();

      getRowCheckboxes('fines')
        .should('have.length', preselectedIds.length)
        .each(($input) => {
          expect(($input[0] as HTMLInputElement).checked, 'row is checked').to.eq(true);
        });

      // “n of n selected”
      cy.get(CommonLocators.selectedCountLabel)
        .invoke('text')
        .then((t) => {
          const txt = t.trim();
          const n = preselectedIds.length;
          expect(txt).to.match(new RegExp(`^\\s*${n}\\s+of\\s+${n}\\s+selected\\s*$`));
        });
    });

  // ---------------- AC2a ----------------

  it('AC2a: shows two tabs – Fines and Confiscation', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4526'] }, () => {
    setupComponent();
    cy.get(NavLocators.finesTabLink).should('contain.text', TAB_LABELS.fines);
    cy.get(NavLocators.confiscationTabLink).should('contain.text', TAB_LABELS.confiscation);
  });

  // ---------------- AC2 (Fines) ----------------

  it('AC2ai/2b/2c (Fines): only Fines units, labels equal names, alphabetical A→Z', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4527'] }, () => {
      setupComponent();
      clickTab('fines');

      getRowLabels('fines').then(($labels) => {
        const actual = extractLabels($labels);
        expect(norm(actual), 'Fines membership').to.deep.equal(norm(expectedFinesNames));
        actual.forEach((label) => expect(expectedFinesNames, 'label equals BU name').to.include(label));
        expect(actual, 'Fines alphabetical').to.deep.equal(norm(actual));
      });
    });

  // ---------------- AC2 (Confiscation) ----------------

  it('AC2aii/2b/2c (Confiscation): only Confiscation units, labels equal names, alphabetical A→Z', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4528'] }, () => {
      setupComponent();
      // Drive fragment to switch tab in CT
      fragment$.next('confiscation');

      cy.wrap(null).then(() => {
        getMasterLabel('confiscation').should('exist').and('contain.text', MASTER_LABEL_TEXT.confiscation);

        getRowLabels('confiscation').then(($labels) => {
          const actual = extractLabels($labels);

          // membership + exact names (ignoring order)
          expect(norm(actual), 'confiscation membership/names match').to.deep.equal(norm(expectedConfNames));

          // alphabetical
          expect(actual, 'confiscation alphabetical (A→Z)').to.deep.equal(norm(actual));
        });
      });
    });

  // ---------------- AC3 (Fines select-all) ----------------

  it('AC3a (Fines): master checkbox selects all fines units and counter shows n of n', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4529'] }, () => {
      preselectedIds = [];
      setupComponent();

      clickTab('fines');
      const n = expectedFinesNames.length;

      // Toggle ON via label
      getMasterLabel('fines').click();

      // All checked
      getRowCheckboxes('fines')
        .should('have.length', n)
        .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(true));

      // Counter "n of n"
      cy.get(CommonLocators.selectedCountLabel)
        .invoke('text')
        .then((txt) => {
          expect(txt.trim()).to.match(new RegExp(`^\\s*${n}\\s+of\\s+${n}\\s+selected\\s*$`));
        });
    });

  it('AC3ai (Fines): unticking master checkbox clears all fines units and counter shows 0 of n', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4530'] }, () => {
      preselectedIds = resolverPayload.refData
        .filter((bu) => String(bu.opal_domain).toLowerCase() === 'fines')
        .map((bu) => bu.business_unit_id);

      setupComponent();

      clickTab('fines');
      const n = expectedFinesNames.length;

      // Toggle OFF
      getMasterLabel('fines').click();

      // All unchecked
      getRowCheckboxes('fines')
        .should('have.length', n)
        .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(false));

      // Counter "0 of n"
      cy.get(CommonLocators.selectedCountLabel)
        .invoke('text')
        .then((txt) => {
          expect(txt.trim()).to.match(new RegExp(`^\\s*0\\s+of\\s+${n}\\s+selected\\s*$`));
        });
    });

  // ---------------- AC4 (Confiscation select-all) ----------------

  it('AC4a (Confiscation): master checkbox selects all confiscation units and counter shows n of n', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4531'] }, () => {
      preselectedIds = [];
      setupComponent();

      fragment$.next('confiscation');
      cy.wrap(null).then(() => {
        getMasterLabel('confiscation').should('exist').and('contain.text', MASTER_LABEL_TEXT.confiscation);

        const n = expectedConfNames.length;
        getMasterLabel('confiscation').click();

        getRowCheckboxes('confiscation')
          .should('have.length', n)
          .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(true));

        cy.get(CommonLocators.selectedCountLabel)
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).to.match(new RegExp(`^\\s*${n}\\s+of\\s+${n}\\s+selected\\s*$`));
          });
      });
    });

  it('AC4ai (Confiscation): unticking master checkbox clears all confiscation units and counter shows 0 of n', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4532'] }, () => {
      preselectedIds = resolverPayload.refData
        .filter((bu) => String(bu.opal_domain).toLowerCase() === 'confiscation')
        .map((bu) => bu.business_unit_id);

      setupComponent();

      fragment$.next('confiscation');
      cy.wrap(null).then(() => {
        const n = expectedConfNames.length;
        getMasterLabel('confiscation').click();

        getRowCheckboxes('confiscation')
          .should('have.length', n)
          .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(false));

        cy.get(CommonLocators.selectedCountLabel)
          .invoke('text')
          .then((txt) => {
            expect(txt.trim()).to.match(new RegExp(`^\\s*0\\s+of\\s+${n}\\s+selected\\s*$`));
          });
        cy.log('AC4ai – all unchecked');
      });
    });

  // ---------------- AC5 (Save count across tabs) ----------------

  it('AC5: Save button count shows total across Fines + Confiscation and updates dynamically', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4533'] }, () => {
      setupComponent();

      // Start on Fines – 0 selected
      assertSaveCount(0);

      // Tick two Fines rows
      ensureAtLeastNRows('fines', 2);
      getRowCheckboxes('fines').eq(0).check({ force: true });
      assertSaveCount(1);
      getRowCheckboxes('fines').eq(1).check({ force: true });
      assertSaveCount(2);

      // Switch to Confiscation and tick one more
      switchToConfiscation();
      getRowCheckboxes('confiscation').first().check({ force: true });
      assertSaveCount(3);

      // Uncheck it -> total back to 2
      getRowCheckboxes('confiscation').first().uncheck({ force: true });
      assertSaveCount(2);

      // Back to Fines; total should persist
      clickTab('fines');
      cy.then(() => {
        fragment$.next('fines');
        window.location.hash = '#fines';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
      assertSaveCount(2);
    });

  // ============ AC6 (error when saving with no selection) ============

  const clickSave = () => cy.get(CommonLocators.saveSelectionButton).click();

  const assertErrorSummaryVisible = () => {
    cy.get(CommonLocators.errorSummary).should('be.visible');

    cy.get('body').then(($body) => {
      // Prefer the GOV.UK list if present
      if ($body.find(CommonLocators.errorSummaryList).length) {
        cy.get(CommonLocators.errorSummaryList)
          .invoke('text')
          .then((t) => expect(textNorm(t)).to.include(EXACT_ERROR_TEXT));
      } else {
        // Fallback: check any visible text inside the summary wrapper
        cy.get(CommonLocators.errorSummary)
          .invoke('text')
          .then((t) => expect(textNorm(t)).to.include(EXACT_ERROR_TEXT));
      }
    });
  };

  it('AC6a (Fines): shows an error when clicking Save with no business units selected', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4534'] }, () => {
      // Start clean (no preselectedIds)
      preselectedIds = [];
      setupComponent();

      // Sanity: Save shows (0)
      assertSaveCount(0);

      // Click Save with nothing selected
      clickSave();

      // Error summary appears with message
      assertErrorSummaryVisible();

      // Still on Fines tab (header unchanged)
      getMasterLabel('fines').should('be.visible');
    });

  it('AC6b (Confiscation): shows an error when clicking Save with no business units selected', { tags: [...buildTags(), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4535'] }, () => {
      preselectedIds = [];
      setupComponent();

      // Switch to Confiscation
      fragment$.next('confiscation');
      getMasterLabel('confiscation').should('be.visible');

      // Sanity: Save shows (0)
      assertSaveCount(0);

      // Click Save with nothing selected
      clickSave();

      // Error summary appears with a message
      assertErrorSummaryVisible();

      // Still on Confiscation tab (header unchanged)
      getMasterLabel('confiscation').should('be.visible');
    });
});
