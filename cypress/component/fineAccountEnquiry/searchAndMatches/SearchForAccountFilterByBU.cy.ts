// PO-711 – Cypress Component Test
// Component under test: FinesSaSearchFilterBusinessUnitComponent

import { mount } from 'cypress/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { DOM_ELEMENTS } from './constants/search_account_filter_by_bu';
import { FinesSaStore } from 'src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSaSearchFilterBusinessUnitComponent } from 'src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-filter-business-unit/fines-sa-search-filter-business-unit.component';

// Unit-test refData (resolver payload)
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '../../../../../opal-frontend/src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

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

  const getRowLabels = () => cy.get(`${DOM_ELEMENTS.tableRows} ${DOM_ELEMENTS.rowLabel}`);

  const getRowCheckboxes = () => cy.get(`${DOM_ELEMENTS.tableBody} ${DOM_ELEMENTS.rowCheckbox}`);

  const clickTabByText = (txt: string) =>
    cy.contains(DOM_ELEMENTS.tabLink, txt).scrollIntoView().click({ force: true });

  const textNorm = (s: string) => s.replace(/\s+/g, ' ').trim();

  const assertSaveCount = (n: number) => {
    cy.get(DOM_ELEMENTS.saveButton)
      .invoke('text')
      .then((t) => {
        const txt = textNorm(t);
        const re = new RegExp(`^Save selection(?: \\(\\s*${n}\\s*\\))?$`);
        expect(txt, 'selection count on Save button').to.match(re);
      });
  };

  const ensureAtLeastNRows = (n: number) =>
    getRowCheckboxes().should(($rows) => {
      expect($rows.length, `need at least ${n} rows`).to.be.gte(n);
    });

  const switchToConfiscation = () => {
    clickTabByText(DOM_ELEMENTS.confiscationTabText);
    cy.then(() => {
      fragment$.next('confiscation');
      window.location.hash = '#confiscation';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.confMasterText).should('be.visible');
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

  it('AC1c: shows tabs, master label, Fines list alphabetical (A→Z), and Save/Cancel controls', () => {
    setupComponent();

    // Tabs exist by visible text
    cy.contains(DOM_ELEMENTS.tabLink, DOM_ELEMENTS.finesTabText).should('exist');
    cy.contains(DOM_ELEMENTS.tabLink, DOM_ELEMENTS.confiscationTabText).should('exist');

    // Master checkbox label (Fines)
    cy.get(DOM_ELEMENTS.masterCheckboxLabel)
      .invoke('text')
      .then((t) => expect(t.trim()).to.eq(DOM_ELEMENTS.finesMasterText));

    // Fines BU labels in the table
    getRowLabels().then(($labels) => {
      const actual = extractLabels($labels);
      expect(norm(actual), 'Fines members match').to.deep.equal(norm(expectedFinesNames));
      expect(actual, 'Fines alphabetical (A→Z)').to.deep.equal(norm(actual));
    });

    // Controls
    cy.get(DOM_ELEMENTS.saveButton)
      .invoke('text')
      .then((t) => {
        expect(t.trim()).to.match(/^Save selection/);
      });
    cy.get(DOM_ELEMENTS.cancelLink).should('have.text', 'Cancel');
  });

  // ---------------- AC1ci ----------------

  it('AC1ci: all business units are selected when filter is set to "All business units" (Fines tab)', () => {
    // Preselect all Fines IDs
    preselectedIds = resolverPayload.refData
      .filter((bu) => String(bu.opal_domain).toLowerCase() === 'fines')
      .map((bu) => bu.business_unit_id);

    setupComponent();

    getRowCheckboxes()
      .should('have.length', preselectedIds.length)
      .each(($input) => {
        expect(($input[0] as HTMLInputElement).checked, 'row is checked').to.eq(true);
      });

    // “n of n selected”
    cy.get(DOM_ELEMENTS.selectedCounter)
      .invoke('text')
      .then((t) => {
        const txt = t.trim();
        const n = preselectedIds.length;
        expect(txt).to.match(new RegExp(`^\\s*${n}\\s+of\\s+${n}\\s+selected\\s*$`));
      });
  });

  // ---------------- AC2a ----------------

  it('AC2a: shows two tabs – Fines and Confiscation', () => {
    setupComponent();
    cy.contains(DOM_ELEMENTS.tabLink, DOM_ELEMENTS.finesTabText).should('exist');
    cy.contains(DOM_ELEMENTS.tabLink, DOM_ELEMENTS.confiscationTabText).should('exist');
  });

  // ---------------- AC2 (Fines) ----------------

  it('AC2ai/2b/2c (Fines): only Fines units, labels equal names, alphabetical A→Z', () => {
    setupComponent();
    clickTabByText(DOM_ELEMENTS.finesTabText);

    getRowLabels().then(($labels) => {
      const actual = extractLabels($labels);
      expect(norm(actual), 'Fines membership').to.deep.equal(norm(expectedFinesNames));
      actual.forEach((label) => expect(expectedFinesNames, 'label equals BU name').to.include(label));
      expect(actual, 'Fines alphabetical').to.deep.equal(norm(actual));
    });
  });

  // ---------------- AC2 (Confiscation) ----------------

  it('AC2aii/2b/2c (Confiscation): only Confiscation units, labels equal names, alphabetical A→Z', () => {
    setupComponent();
    // Drive fragment to switch tab in CT
    fragment$.next('confiscation');

    cy.wrap(null).then(() => {
      cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.confMasterText).should('exist');

      getRowLabels().then(($labels) => {
        const actual = extractLabels($labels);

        // membership + exact names (ignoring order)
        expect(norm(actual), 'confiscation membership/names match').to.deep.equal(norm(expectedConfNames));

        // alphabetical
        expect(actual, 'confiscation alphabetical (A→Z)').to.deep.equal(norm(actual));
      });
    });
  });

  // ---------------- AC3 (Fines select-all) ----------------

  it('AC3a (Fines): master checkbox selects all fines units and counter shows n of n', () => {
    preselectedIds = [];
    setupComponent();

    clickTabByText(DOM_ELEMENTS.finesTabText);
    const n = expectedFinesNames.length;

    // Toggle ON via label
    cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.finesMasterText).click();

    // All checked
    getRowCheckboxes()
      .should('have.length', n)
      .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(true));

    // Counter "n of n"
    cy.get(DOM_ELEMENTS.selectedCounter)
      .invoke('text')
      .then((txt) => {
        expect(txt.trim()).to.match(new RegExp(`^\\s*${n}\\s+of\\s+${n}\\s+selected\\s*$`));
      });
  });

  it('AC3ai (Fines): unticking master checkbox clears all fines units and counter shows 0 of n', () => {
    preselectedIds = resolverPayload.refData
      .filter((bu) => String(bu.opal_domain).toLowerCase() === 'fines')
      .map((bu) => bu.business_unit_id);

    setupComponent();

    clickTabByText(DOM_ELEMENTS.finesTabText);
    const n = expectedFinesNames.length;

    // Toggle OFF
    cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.finesMasterText).click();

    // All unchecked
    getRowCheckboxes()
      .should('have.length', n)
      .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(false));

    // Counter "0 of n"
    cy.get(DOM_ELEMENTS.selectedCounter)
      .invoke('text')
      .then((txt) => {
        expect(txt.trim()).to.match(new RegExp(`^\\s*0\\s+of\\s+${n}\\s+selected\\s*$`));
      });
  });

  // ---------------- AC4 (Confiscation select-all) ----------------

  it('AC4a (Confiscation): master checkbox selects all confiscation units and counter shows n of n', () => {
    preselectedIds = [];
    setupComponent();

    fragment$.next('confiscation');
    cy.wrap(null).then(() => {
      cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.confMasterText).should('exist');

      const n = expectedConfNames.length;
      cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.confMasterText).click();

      getRowCheckboxes()
        .should('have.length', n)
        .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(true));

      cy.get(DOM_ELEMENTS.selectedCounter)
        .invoke('text')
        .then((txt) => {
          expect(txt.trim()).to.match(new RegExp(`^\\s*${n}\\s+of\\s+${n}\\s+selected\\s*$`));
        });
    });
  });

  it('AC4ai (Confiscation): unticking master checkbox clears all confiscation units and counter shows 0 of n', () => {
    preselectedIds = resolverPayload.refData
      .filter((bu) => String(bu.opal_domain).toLowerCase() === 'confiscation')
      .map((bu) => bu.business_unit_id);

    setupComponent();

    fragment$.next('confiscation');
    cy.wrap(null).then(() => {
      const n = expectedConfNames.length;
      cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.confMasterText).click();

      getRowCheckboxes()
        .should('have.length', n)
        .each(($input) => expect(($input[0] as HTMLInputElement).checked).to.eq(false));

      cy.get(DOM_ELEMENTS.selectedCounter)
        .invoke('text')
        .then((txt) => {
          expect(txt.trim()).to.match(new RegExp(`^\\s*0\\s+of\\s+${n}\\s+selected\\s*$`));
        });
      cy.log('AC4ai – all unchecked');
    });
  });

  // ---------------- AC5 (Save count across tabs) ----------------

  it('AC5: Save button count shows total across Fines + Confiscation and updates dynamically', () => {
    setupComponent();

    // Start on Fines – 0 selected
    assertSaveCount(0);

    // Tick two Fines rows
    ensureAtLeastNRows(2);
    getRowCheckboxes().eq(0).check({ force: true });
    assertSaveCount(1);
    getRowCheckboxes().eq(1).check({ force: true });
    assertSaveCount(2);

    // Switch to Confiscation and tick one more
    switchToConfiscation();
    getRowCheckboxes().first().check({ force: true });
    assertSaveCount(3);

    // Uncheck it -> total back to 2
    getRowCheckboxes().first().uncheck({ force: true });
    assertSaveCount(2);

    // Back to Fines; total should persist
    clickTabByText(DOM_ELEMENTS.finesTabText);
    cy.then(() => {
      fragment$.next('fines');
      window.location.hash = '#fines';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    assertSaveCount(2);
  });

  // ============ AC6 (error when saving with no selection) ============

  const clickSave = () => cy.get(DOM_ELEMENTS.saveButton).click();

  const assertErrorSummaryVisible = () => {
    cy.get(DOM_ELEMENTS.errorSummary).should('be.visible');

    cy.get('body').then(($body) => {
      // Prefer the GOV.UK list if present
      if ($body.find(DOM_ELEMENTS.errorSummaryList).length) {
        cy.get(DOM_ELEMENTS.errorSummaryList)
          .invoke('text')
          .then((t) => expect(textNorm(t)).to.include(DOM_ELEMENTS.exactErrorText));
      } else {
        // Fallback: check any visible text inside the summary wrapper
        cy.get(DOM_ELEMENTS.errorSummary)
          .invoke('text')
          .then((t) => expect(textNorm(t)).to.include(DOM_ELEMENTS.exactErrorText));
      }
    });
  };

  it('AC6a (Fines): shows an error when clicking Save with no business units selected', () => {
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
    cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.finesMasterText).should('be.visible');
  });

  it('AC6b (Confiscation): shows an error when clicking Save with no business units selected', () => {
    preselectedIds = [];
    setupComponent();

    // Switch to Confiscation
    fragment$.next('confiscation');
    cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.confMasterText).should('be.visible');

    // Sanity: Save shows (0)
    assertSaveCount(0);

    // Click Save with nothing selected
    clickSave();

    // Error summary appears with a message
    assertErrorSummaryVisible();

    // Still on Confiscation tab (header unchanged)
    cy.contains(DOM_ELEMENTS.masterCheckboxLabel, DOM_ELEMENTS.confMasterText).should('be.visible');
  });
});
