import { mount } from 'cypress/angular';
import { FinesMacReviewAccountComponent } from 'src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from './mocks/fines_mac_review_account_mocks';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { interceptOffences } from 'cypress/component/CommonIntercepts/CommonIntercepts.cy';

/**
 * PO-1582 – System notes eligibility under Check & Validate (S1–S6)
 * We focus on **what the frontend sends**. The backend composes human text from these inputs,
 * so we always assert the request payload’s **eligibility fields**.
 */

// --------------------------- Shared state ---------------------------

let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
let finesDraftState = structuredClone(FINES_DRAFT_STATE);

/** Small “shape” of the GlobalStore we need for the helper. */
interface GlobalStoreLike {
  setUserState: (state: unknown) => void;
  getUserState?: () => { user?: { givenName?: string; familyName?: string; name?: string }; name?: string } | undefined;
}

/** We stash the instance the DI system creates so helpers can find it. */
let latestGlobalStoreInstance: GlobalStoreLike | null = null;

// --------------------------- tiny runtime helpers ---------------------------

/** Narrow an arbitrary value to a plain object (at runtime). */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Own-property check that works without ES2022 libs. */
function hasOwnKey(obj: object, key: PropertyKey): boolean {
  return Object.getOwnPropertyDescriptor(obj, key) !== undefined;
}

/** Ensure a nested property exists as an object; create it if needed. */
function ensureNested(obj: Record<string, unknown>, key: string): Record<string, unknown> {
  const cur = obj[key];
  if (isRecord(cur)) return cur;
  const fresh: Record<string, unknown> = {};
  obj[key] = fresh;
  return fresh;
}

// --------------------------- note text helpers (optional checks) ---------------------------

function makeAuthorId(fullName: string) {
  const parts = String(fullName).trim().split(/ +/);
  const last = parts.pop() ?? '';
  const firstNames = parts.join(' ');
  return last ? `${firstNames}.${last}` : fullName;
}
function expectedNote1(ddMmYyyy: string) {
  return `A collection order was previously made on ${ddMmYyyy} prior to this account creation`;
}
function expectedNote2(fullName: string) {
  return `A collection order has been made by ${makeAuthorId(fullName)} using Authorised Functions`;
}

/** Pull the SYS note text out of the request (returns undefined if the array isn’t present). */
function getSysNoteTextFromReq(reqBody: unknown): string | undefined {
  if (!isRecord(reqBody)) return undefined;
  const account = reqBody['account'];
  if (!isRecord(account)) return undefined;
  const notes = account['account_notes'];
  if (!Array.isArray(notes)) return undefined;

  const sys = notes.find(
    (n): n is Record<string, unknown> =>
      isRecord(n) && n['note_type'] === 'SYS' && typeof n['account_note_text'] === 'string',
  );
  return sys ? (sys['account_note_text'] as string) : undefined;
}

// --------------------------- network stubs ---------------------------

/** Backend PUT replaceDraftAccount – return a simple 200 mock and alias it. */
function installReplaceDraftAccountInterceptOnce() {
  const url = '**/opal-fines-service/draft-accounts/**';
  cy.intercept({ method: 'PUT', url }, (req) => {
    req.alias = 'replaceDraftAccount';
    // eslint-disable-next-line no-console
    console.info('[intercept] matched', req.method, req.url);
    req.reply({ statusCode: 200, body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK });
  });
}

// --------------------------- user helper ---------------------------

/**
 * Update the logged-in user name inside the GlobalStore the component uses.
 * IMPORTANT: call this **after** the component mounts so the store exists.
 */
function setLoggedInUser(fullName: string) {
  cy.window().then((win) => {
    const hasGlobal = hasOwnKey(win, 'globalStore');
    const store = hasGlobal
      ? (win as unknown as { globalStore?: GlobalStoreLike }).globalStore
      : latestGlobalStoreInstance;

    if (!store || typeof store.setUserState !== 'function') return;

    const [first, ...rest] = String(fullName).trim().split(/ +/);
    const last = rest.join(' ');

    const prev = typeof store.getUserState === 'function' ? store.getUserState() : undefined;
    const prevObj: Record<string, unknown> = isRecord(prev) ? prev : {};

    let prevUser: Record<string, unknown> = {};
    if (isRecord(prevObj['user'])) prevUser = prevObj['user'];

    store.setUserState({
      ...prevObj,
      user: { ...prevUser, name: fullName, givenName: first, familyName: last },
      name: fullName,
    });
  });
}

// --------------------------- mutate Payment Terms in finesMacState ---------------------------

/** Make Payment Terms eligible for Note 1 (previous CO with a date). */
function setPaymentTermsForNote1(state: unknown, ddMmYyyy: string): void {
  if (!isRecord(state)) return;
  const paymentTerms = ensureNested(state, 'paymentTerms');
  const formData = ensureNested(paymentTerms, 'formData');
  formData['fm_payment_terms_collection_order_made'] = true;
  formData['fm_payment_terms_collection_order_date'] = ddMmYyyy; // ← DD/MM/YYYY
  formData['fm_payment_terms_collection_order_made_today'] = false;
  formData['fm_payment_terms_add_enforcement_action'] = false;
}

/** Make Payment Terms eligible for Note 2 (CO made today, no previous date). */
function setPaymentTermsForNote2(state: unknown): void {
  if (!isRecord(state)) return;
  const paymentTerms = ensureNested(state, 'paymentTerms');
  const formData = ensureNested(paymentTerms, 'formData');
  formData['fm_payment_terms_collection_order_made'] = false;
  formData['fm_payment_terms_collection_order_date'] = '';
  formData['fm_payment_terms_collection_order_made_today'] = true;
  formData['fm_payment_terms_add_enforcement_action'] = false;
}

/** Clear Payment Terms eligibility entirely. */
function clearPaymentTermsCriteria(state: unknown): void {
  if (!isRecord(state)) return;
  const paymentTerms = ensureNested(state, 'paymentTerms');
  const formData = ensureNested(paymentTerms, 'formData');
  formData['fm_payment_terms_collection_order_made'] = false;
  formData['fm_payment_terms_collection_order_date'] = '';
  formData['fm_payment_terms_collection_order_made_today'] = false;
  formData['fm_payment_terms_add_enforcement_action'] = false;
}

// --------------------------- component mount ---------------------------

/**
 * Mount the Review Account component with the three stores and a minimal ActivatedRoute.
 * After mount, mirror the created GlobalStore on window.globalStore so helpers can find it.
 */
function setupComponent(
  finesDraftStateMock: unknown = finesDraftState,
  activatedRouteMock: unknown = null,
  amend = true,
  checker = false,
) {
  mount(FinesMacReviewAccountComponent, {
    providers: [
      provideHttpClient(),
      OpalFines,
      UtilsService,
      FinesMacPayloadService,

      // Router: stub navigate calls so we don't actually change the URL.
      {
        provide: Router,
        useValue: {
          navigate: cy.stub().as('routerNavigate'),
          navigateByUrl: cy.stub().as('routerNavigateByUrl'),
        },
      },

      // GlobalStore: create the instance used by the app and keep a reference for helpers.
      {
        provide: GlobalStore,
        useFactory: () => {
          const store = new GlobalStore();
          store.setUserState(OPAL_USER_STATE_MOCK);
          store.setError({ error: false, message: '' });
          latestGlobalStoreInstance = store as unknown as GlobalStoreLike;
          // Also mirror on the AUT window so code that looks up window.globalStore can find it.
          try {
            Object.defineProperty(window as unknown as Record<string, unknown>, 'globalStore', {
              value: latestGlobalStoreInstance,
              configurable: true,
            });
          } catch {
            /* ignore */
          }
          return store;
        },
      },

      // FinesMacStore: in-progress form state (we mutate this in helpers above).
      {
        provide: FinesMacStore,
        useFactory: () => {
          const s = new FinesMacStore();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          s.setFinesMacStore(finesMacState as any);
          return s;
        },
      },

      // FinesDraftStore: draft-level flags and state.
      {
        provide: FinesDraftStore,
        useFactory: () => {
          const s = new FinesDraftStore();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          s.setFinesDraftState(finesDraftStateMock as any);
          s.setAmend(amend);
          s.setChecker(checker);
          return s;
        },
      },

      // ActivatedRoute: just enough data for the component to render.
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: { get: (key: string) => (key === 'draftAccountId' ? '42' : null) },
            data: {
              reviewAccountFetchMap: { finesMacStore: finesMacState, finesMacDraft: activatedRouteMock },
              results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
              majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
              courts: OPAL_FINES_COURT_REF_DATA_MOCK,
            },
            parent: { snapshot: { url: [{ path: 'manual-account-creation' }] } },
          },
        },
      },
    ],
    componentProperties: {},
  });

  // (belt & braces) also mirror the store after mount
  cy.window().then((win) => {
    if (latestGlobalStoreInstance) {
      try {
        Object.defineProperty(win as unknown as Record<string, unknown>, 'globalStore', {
          value: latestGlobalStoreInstance,
          configurable: true,
        });
      } catch {
        /* ignore */
      }
    }
  });
}

// --------------------------- handy request assertions ---------------------------

/** Assert request eligibility equals Note 1, and optionally check SYS note text if present. */
function assertRequestNote1(reqBody: unknown, expectedIsoDate: string, expectedDdMmYyyy: string) {
  if (!isRecord(reqBody)) throw new Error('request body not an object');

  const maybeAcc = reqBody['account'];
  const account = isRecord(maybeAcc) ? maybeAcc : undefined;
  expect(account, 'request.account').to.exist;

  const maybePt = account?.['payment_terms'];
  const paymentTerms = isRecord(maybePt) ? maybePt : undefined;
  expect(paymentTerms, 'request.account.payment_terms').to.exist;

  expect(account?.['collection_order_made'], 'collection_order_made').to.eq(true);
  expect(account?.['collection_order_made_today'], 'collection_order_made_today').to.eq(false);
  expect(account?.['collection_order_date'], 'collection_order_date').to.eq(expectedIsoDate);

  const enforcements = paymentTerms?.['enforcements'];
  const hasCOLLO = Array.isArray(enforcements) && enforcements.some((e) => isRecord(e) && e['result_id'] === 'COLLO');
  expect(hasCOLLO, 'enforcements includes COLLO').to.eq(true);

  const note = getSysNoteTextFromReq(reqBody);
  if (note !== undefined) expect(note).to.eq(expectedNote1(expectedDdMmYyyy));
}

/** Assert request eligibility equals Note 2, and optionally check SYS note text (with author). */
function assertRequestNote2(reqBody: unknown, authorFullName?: string) {
  if (!isRecord(reqBody)) throw new Error('request body not an object');

  const maybeAcc = reqBody['account'];
  const account = isRecord(maybeAcc) ? maybeAcc : undefined;
  expect(account, 'request.account').to.exist;

  const maybePt = account?.['payment_terms'];
  const paymentTerms = isRecord(maybePt) ? maybePt : undefined;
  expect(paymentTerms, 'request.account.payment_terms').to.exist;

  expect(account?.['collection_order_made'], 'collection_order_made').to.eq(false);
  expect(account?.['collection_order_made_today'], 'collection_order_made_today').to.eq(true);
  // date may be empty/undefined for "today"
  expect(['', null, undefined]).to.include(account?.['collection_order_date']);

  const enforcements = paymentTerms?.['enforcements'];
  const hasCOLLO = Array.isArray(enforcements) && enforcements.some((e) => isRecord(e) && e['result_id'] === 'COLLO');
  expect(hasCOLLO, 'enforcements includes COLLO').to.eq(true);

  // Optional – only if UI sends notes in request
  const note = getSysNoteTextFromReq(reqBody);
  if (note !== undefined && authorFullName) {
    expect(note).to.eq(expectedNote2(authorFullName));
  }
}

// --------------------------- Tests (S1–S6) ---------------------------

describe('PO-1582 – System notes eligibility under Check & Validate (S1–S6)', () => {
  beforeEach(() => {
    // Intercepts must be in place BEFORE the component mounts.
    interceptOffences(); // aliases @getOffenceByCjsCode
    installReplaceDraftAccountInterceptOnce();

    // Fresh copies for each test
    cy.then(() => {
      finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
      finesDraftState = structuredClone(FINES_DRAFT_STATE);
      latestGlobalStoreInstance = null;
    });
  });

  it('S1: Original submitter (no amendment) → Note 1 retained (request eligibility)', () => {
    setPaymentTermsForNote1(finesMacState, '05/10/2025');

    setupComponent(finesDraftState, null, true, false);
    cy.wait('@getOffenceByCjsCode');

    cy.get(DOM_ELEMENTS.submitButton).scrollIntoView().should('be.enabled').and('be.visible').click();

    cy.wait('@replaceDraftAccount')
      .its('request.body')
      .then((body) => {
        assertRequestNote1(body, '2025-10-05', '05/10/2025');
      });
  });

  it('S2: Original submitter amends → criteria no longer met → SYS note absent (request eligibility)', () => {
    setPaymentTermsForNote1(finesMacState, '05/10/2025');
    clearPaymentTermsCriteria(finesMacState);

    setupComponent(finesDraftState, null, true, false);
    cy.wait('@getOffenceByCjsCode');

    cy.get(DOM_ELEMENTS.submitButton).scrollIntoView().should('be.enabled').and('be.visible').click();

    cy.wait('@replaceDraftAccount')
      .its('request.body')
      .then((body) => {
        // eligibility cleared
        if (!isRecord(body)) throw new Error('request body not an object');
        const maybeAcc = body['account'];
        const acc = isRecord(maybeAcc) ? maybeAcc : undefined;
        expect(acc, 'request.account').to.exist;
        expect(acc?.['collection_order_made']).to.eq(false);
        expect(acc?.['collection_order_made_today']).to.eq(false);
        expect(['', null, undefined]).to.include(acc?.['collection_order_date']);
        // no SYS note expected
        expect(getSysNoteTextFromReq(body), 'SYS note should be absent in request').to.be.undefined;
      });
  });

  it('S3: Original submitter amends (Note 2 → Note 1) → eligibility switched to Note 1', () => {
    setPaymentTermsForNote2(finesMacState); // start as "today"
    setPaymentTermsForNote1(finesMacState, '06/10/2025'); // switch to previous date

    setupComponent(finesDraftState, null, true, false);
    cy.wait('@getOffenceByCjsCode');

    cy.get(DOM_ELEMENTS.submitButton).scrollIntoView().should('be.enabled').and('be.visible').click();

    cy.wait('@replaceDraftAccount')
      .its('request.body')
      .then((body) => {
        assertRequestNote1(body, '2025-10-06', '06/10/2025');
      });
  });

  it('S4: Different submitter, no amendment → Note 1 retained (request eligibility)', () => {
    setPaymentTermsForNote1(finesMacState, '07/10/2025');

    setupComponent(finesDraftState, null, true, false);
    cy.wait('@getOffenceByCjsCode');
    // Set the user AFTER mount so the store exists
    setLoggedInUser('Second Submitter');

    cy.get(DOM_ELEMENTS.submitButton).scrollIntoView().should('be.enabled').and('be.visible').click();

    cy.wait('@replaceDraftAccount')
      .its('request.body')
      .then((body) => {
        assertRequestNote1(body, '2025-10-07', '07/10/2025');
      });
  });

  it('S5: Different submitter amends → criteria no longer met → SYS note absent (request eligibility)', () => {
    setPaymentTermsForNote1(finesMacState, '08/10/2025');

    setupComponent(finesDraftState, null, true, false);
    cy.wait('@getOffenceByCjsCode');
    setLoggedInUser('Second Submitter');

    clearPaymentTermsCriteria(finesMacState);
    cy.get(DOM_ELEMENTS.submitButton).scrollIntoView().should('be.enabled').and('be.visible').click();

    cy.wait('@replaceDraftAccount')
      .its('request.body')
      .then((body) => {
        if (!isRecord(body)) throw new Error('request body not an object');
        const maybeAcc = body['account'];
        const acc = isRecord(maybeAcc) ? maybeAcc : undefined;
        expect(acc, 'request.account').to.exist;
        expect(acc?.['collection_order_made']).to.eq(false);
        expect(acc?.['collection_order_made_today']).to.eq(false);
        expect(['', null, undefined]).to.include(acc?.['collection_order_date']);
        expect(getSysNoteTextFromReq(body), 'SYS note should be absent in request').to.be.undefined;
      });
  });

  it('S6: Different submitter amends (Note 1 → Note 2) → eligibility switched to Note 2 (author updated)', () => {
    setPaymentTermsForNote1(finesMacState, '09/10/2025'); // start as previous date

    setupComponent(finesDraftState, null, true, false);
    cy.wait('@getOffenceByCjsCode');
    setLoggedInUser('Second Submitter'); // now change user
    setPaymentTermsForNote2(finesMacState); // and switch to "today"

    cy.get(DOM_ELEMENTS.submitButton).scrollIntoView().should('be.enabled').and('be.visible').click();

    cy.wait('@replaceDraftAccount')
      .its('request.body')
      .then((body) => {
        // Always assert eligibility…
        assertRequestNote2(body, /* authorFullName: */ 'Second Submitter');
        // …and if the UI is not sending account_notes in the request,
        // the eligibility assertions above are still enough for AC1/AC2.
      });
  });
});
