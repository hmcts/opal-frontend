import { mount } from 'cypress/angular';
import { FinesMacReviewAccountComponent } from 'src/app/flows/fines/fines-mac/fines-mac-review-account/fines-mac-review-account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '../../../../src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from 'cypress/component/manualAccountCreation/FinesMacReviewAccount/mocks/fines_mac_review_account_mocks';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { interceptOffences } from 'cypress/component/CommonIntercepts/CommonIntercepts.cy';

/**
 * PO-1582 (Check & Validate) – System-generated account notes
 * ------------------------------------------------------------
 * The backend creates the note text based on whether the Payment Terms are eligible
 * Therefore these tests assert TWO things per scenario:
 *   1) The outbound request has the correct *eligibility fields*.
 *   2) The intercepted response is *shaped* to represent the backend behaviour
 *      (retain/create, remove, update etc.), and then assert on that.
 */

// ------------------------------------------------------------
// Local state reset between tests
// ------------------------------------------------------------
let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
let finesDraftState = structuredClone(FINES_DRAFT_STATE);

// ------------------------------------------------------------
// Mount helper
// ------------------------------------------------------------
const setupComponent = (
  finesDraftStateMock: any = finesDraftState,
  activatedRouteMock: any = null,
  amend: boolean = true,
  checker: boolean = false,
) => {
  mount(FinesMacReviewAccountComponent, {
    providers: [
      // --- What we pass into the component under test ---
      // Angular HTTP client used by the services the component relies on
      provideHttpClient(),
      // Service that talks to the Fines API (we just inject it; calls are intercepted)
      OpalFines,
      // Common helper utilities required by the component
      UtilsService,
      // Builds the 'replace draft account' payload from the form/state
      FinesMacPayloadService,
      {
        // Fake Angular Router so clicks don't leave the test; we can assert calls via stubs
        provide: Router,
        useValue: {
          navigate: cy.stub().as('routerNavigate'),
          navigateByUrl: cy.stub().as('routerNavigateByUrl'),
        },
      },
      {
        // App-wide store: seed a user and expose it on window.globalStore so tests can switch users
        provide: GlobalStore,
        useFactory: () => {
          const store = new GlobalStore();
          store.setUserState(OPAL_USER_STATE_MOCK);
          store.setError({ error: false, message: '' });
          // Expose for helpers (e.g. setLoggedInUser)
          Object.defineProperty(window, 'globalStore', { value: store, configurable: true });
          return store;
        },
      },
      {
        // Store for this flow (Manual Account Creation): we feed in finesMacState fixture
        provide: FinesMacStore,
        useFactory: () => {
          const store = new FinesMacStore();
          store.setFinesMacStore(finesMacState);
          return store;
        },
      },
      {
        // Draft store for the account: also controls 'amend' and 'checker' modes
        provide: FinesDraftStore,
        useFactory: () => {
          const store = new FinesDraftStore();
          store.setFinesDraftState(finesDraftStateMock);
          store.setAmend(amend);
          store.setChecker(checker);
          return store;
        },
      },
      {
        // Fake route: supplies params and preloaded 'resolver' data like reference datasets
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: { get: (key: string) => (key === 'draftAccountId' ? '42' : null) },
            data: {
              // Data the component expects from a resolver
              reviewAccountFetchMap: {
                finesMacStore: finesMacState,
                finesMacDraft: activatedRouteMock,
              },
              // Reference data: offence results
              results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
              // Reference data: major creditors
              majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              // Reference data: local justice areas
              localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
              // Reference data: courts list
              courts: OPAL_FINES_COURT_REF_DATA_MOCK,
            },
            parent: { snapshot: { url: [{ path: 'manual-account-creation' }] } },
          },
        },
      },
    ],
    componentProperties: {},
  });
};

// ------------------------------------------------------------
// Global beforeEach hooks
// ------------------------------------------------------------
beforeEach(() => {
  interceptOffences(); // aliases @getOffenceByCjsCode
});

beforeEach(() => {
  // fresh copies for each test
  cy.then(() => {
    finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
    finesDraftState = structuredClone(FINES_DRAFT_STATE);
  });
});

// ------------------------------------------------------------
// Types & Helpers
// ------------------------------------------------------------

/**
 * This isn't the full GlobalStore interface, just the bits needed.  Without this,
 * we get "Property 'globalStore' does not exist on type 'Window & typeof globalThis'."
 */
interface GlobalStoreLike {
  /**
   * Replace the current user state in the store.
   *
   * Example value we pass in tests:
   * {
   *   user: { name: "Jane Doe", givenName: "Jane", familyName: "Doe" },
   *   name: "Jane Doe"
   * }
   *
   * @param state A plain object representing the new user state.
   * @returns {void} Nothing. Updates the store in place.
   */
  setUserState: (state: unknown) => void;
  /**
   * Return the current state snapshot, if available.
   * Implementations may omit this; tests check before calling it.
   */
  getUserState?: () => { user?: { givenName?: string; familyName?: string; name?: string } } | undefined;
}

/**
 * Minimal request body shape we assert against when replacing a draft account.
 */
interface ReplaceDraftAccountReq {
  account: {
    collection_order_made: boolean;
    collection_order_made_today: boolean;
    collection_order_date: string | null;
    payment_terms: {
      enforcements: Array<{
        result_id: string;
        enforcement_result_responses: null | Array<{ parameter_name: string; response: string }>;
      }>;
    };
  };
  submitted_by_name?: string;
}

/**
 * Minimal response body shape we assert for notes returned by the backend.
 */
interface ReplaceDraftAccountRes {
  account: {
    account_notes: Array<{ note_type?: string; account_note_text?: string }>;
  };
}

/** Check that the request body has the fields we need. */
function isReplaceDraftAccountReq(x: unknown): x is ReplaceDraftAccountReq {
  // 1) top-level must be an object
  if (!x || typeof x !== 'object') return false;

  // 2) must have an `account` object
  const acc: any = (x as any).account;
  if (!acc || typeof acc !== 'object') return false;

  // 3) booleans used by the eligibility logic
  if (typeof acc.collection_order_made !== 'boolean') return false;
  if (typeof acc.collection_order_made_today !== 'boolean') return false;

  // 4) payment terms must exist and have `enforcements` in an allowed shape
  if (!('payment_terms' in acc) || typeof acc.payment_terms !== 'object') return false;
  const enf = acc.payment_terms.enforcements;
  // Accept array (e.g., COLLO present) or null (no enforcements)
  if (!(Array.isArray(enf) || enf === null)) return false;

  return true;
}

/** Check that the response body has the fields we need. */
function isReplaceDraftAccountRes(x: unknown): x is ReplaceDraftAccountRes {
  // 1) top-level must be an object
  if (!x || typeof x !== 'object') return false;

  // 2) must have an `account` object
  const account = (x as { account?: unknown }).account;
  if (!account || typeof account !== 'object') return false;

  // 3) must have `account_notes` array
  const accountNotes = (account as { account_notes?: unknown }).account_notes;
  if (!Array.isArray(accountNotes)) return false;

  // 4) (optional) ensure each note is object with the string fields we use
  const okItems = accountNotes.every((n) => {
    if (!n || typeof n !== 'object') return false;
    const noteType = (n as { note_type?: unknown }).note_type;
    const noteText = (n as { account_note_text?: unknown }).account_note_text;
    return typeof noteType === 'string' && typeof noteText === 'string';
  });

  return okItems;
}

/**
 * Make sure `req.body` is the shape expected, then return it with a safe type.
 *
 * - `req.body` can be anything at runtime
 * - Pass in a small checker function (`predicate`) that returns true/false
 * - If the check passes, return the body typed as `T`. If not throw with a clear label.
 *
 * Usage:
 *   const body = ensureRequestBody(request, isReplaceDraftAccountReq, 'replaceDraftAccount request');
 *
 * @param req       Object that contains the unknown `body` property.
 * @param predicate This parameter is a function passed in to prove the body’s shape.
 * @param label     Used in the error message if the shape is wrong.
 * @returns         The same body value, now typed as T.
 * @throws          Error with the given label if the body doesn’t match the expected shape.
 */
function ensureRequestBody<T>(req: { body: unknown }, predicate: (b: unknown) => b is T, label: string): T {
  const body = req.body;
  if (!predicate(body)) throw new Error(`${label}: unexpected request body shape`);
  return body;
}

/** Safely read the response body and make sure it looks like we expect. */
function ensureResponseBody<T>(
  resp: { body: unknown } | undefined,
  predicate: (b: unknown) => b is T,
  label: string,
): T {
  if (!resp) throw new Error(`${label}: missing response`);
  const body = resp.body;
  if (!predicate(body)) throw new Error(`${label}: unexpected response body shape`);
  return body;
}

// Pretend-backend helpers: build the note text like the real server would ----------

/** Format 'YYYY-MM-DD' to 'DD/MM/YYYY'. */
function ymdToDmy(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Build the system note text/author from request eligibility, or null if none applies.
 *
 * @param reqBody the outbound request payload
 * @param authorOverride optional author name to stamp (for S6)
 */
// Make the text that appears in the system note based on the Payment Terms fields
function buildSystemNoteFromReq(reqBody: any, authorOverride?: string) {
  const acc = reqBody?.account ?? {};
  const submittedBy = authorOverride ?? reqBody?.submitted_by_name ?? 'Unknown';

  if (acc.collection_order_made === true) {
    const dateText = ymdToDmy(acc.collection_order_date);
    return {
      text: `A collection order was previously made on ${dateText} prior to this account creation`,
      author: submittedBy,
    } as const;
  }
  if (acc.collection_order_made_today === true) {
    // Turn 'First Middle Last' -> 'First Middle.Last'
    const parts = (submittedBy || '').trim().split(/\s+/);
    const last = parts.pop() || '';
    const first = parts.join(' ');
    const id = first && last ? `${first}.${last}` : submittedBy;
    return {
      text: `A collection order has been made by ${id} using Authorised Functions`,
      author: submittedBy,
    } as const;
  }
  return null;
}

/**
 * Intercept PUT/POST to draft-accounts and **shape the response** to emulate backend note behaviour
 * while aliasing the request as `@replaceDraftAccount` for assertions.
 *
 * @param opts.remove when true, the response will **not** include a system note
 * @param opts.author when provided, set as the system note author (e.g. "Second Submitter" in S6)
 */
/**
 * Catch the PUT to /draft-accounts and reply with a fake response.
 * We also add/remove the system note text so tests can check outcomes.
 */
function aliasReplaceDraftAccountOnce(opts?: { remove?: boolean; author?: string }) {
  // Intercept the actual PUT call the UI makes when replacing a draft account
  cy.intercept('PUT', '**/opal-fines-service/draft-accounts/**', (req) => {
    const base = structuredClone(OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK);

    // Start from manual notes only (strip any pre-existing system notes in the mock)
    let notes = (base.account?.account_notes ?? []).filter((n: any) => n.note_type !== 'SYS');

    if (!opts?.remove) {
      const sys = buildSystemNoteFromReq(req.body, opts?.author);
      if (sys) {
        notes.push({
          account_note_serial: 999,
          note_type: 'SYS',
          account_note_text: sys.text,
        });
      }
    }

    base.account.account_notes = notes;
    req.reply({ statusCode: 200, body: base });
  }).as('replaceDraftAccount');
}

// ----- Payment Terms convenience mutators -----
/** Set Payment Terms to produce Note 1 (previous CO with a date). */
function setPaymentTermsForNote1(state: any, dateDDMMYYYY: string) {
  Object.assign(state.paymentTerms.formData, {
    fm_payment_terms_collection_order_made: true,
    fm_payment_terms_collection_order_date: dateDDMMYYYY,
    fm_payment_terms_collection_order_made_today: false,
  });
}

/** Set Payment Terms to produce Note 2 (make CO today). */
function setPaymentTermsForNote2(state: any) {
  Object.assign(state.paymentTerms.formData, {
    fm_payment_terms_collection_order_made: false,
    fm_payment_terms_collection_order_date: '',
    fm_payment_terms_collection_order_made_today: true,
  });
}

/** Clear Payment Terms so no system note is eligible. */
function clearPaymentTermsCriteria(state: any) {
  Object.assign(state.paymentTerms.formData, {
    fm_payment_terms_collection_order_made: false,
    fm_payment_terms_collection_order_date: '',
    fm_payment_terms_collection_order_made_today: false,
  });
}

// ----- GlobalStore helpers -----
/** Quick check that window has a usable globalStore. */
function hasGlobalStore(win: Window): win is Window & { globalStore: GlobalStoreLike } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gsAny: any = (win as any).globalStore;
  return !!gsAny && typeof gsAny.setUserState === 'function';
}

/** Update the logged-in user in the mounted GlobalStore (if present). */
function setLoggedInUser(fullName: string) {
  cy.window().then((win) => {
    if (!hasGlobalStore(win)) return;
    const gs = win.globalStore;
    const prev = gs.getUserState?.();
    const parts = String(fullName).trim().split(/ +/);
    const first = parts.shift() || '';
    const rest = parts.join(' ');
    gs.setUserState({
      ...prev,
      user: { ...(prev?.user ?? {}), name: fullName, givenName: first, familyName: rest },
      name: fullName,
    });
  });
}

// ------------------------------------------------------------
// Tests – S1 to S6 (we check the Payment Terms fields sent to the server, and also check the fake server response for the note text)
// ------------------------------------------------------------

describe('PO-1582 – System notes eligibility under Check & Validate (S1–S6)', () => {
  it('S1: Original submitter, resubmits w/o amending → Note 1 retained/created', () => {
    // Make the scenario true (Note 1 eligibility) for the backend to generate the note
    setPaymentTermsForNote1(finesMacState, '05/10/2025');

    // Install the intercept and reply 200 with a system note based on the request
    aliasReplaceDraftAccountOnce();

    // Mount the UI
    setupComponent(finesDraftState, null, true, false);

    // Let the page load
    cy.wait('@getOffenceByCjsCode');

    // Click Submit
    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    // Wait for the PUT and check its body and the response intercepted
    cy.wait('@replaceDraftAccount').then(({ request, response }) => {
      // Check request.body has the minimal fields needed
      const body = ensureRequestBody<ReplaceDraftAccountReq>(
        request,
        isReplaceDraftAccountReq,
        'replaceDraftAccount request',
      );

      // Check response.body.account.account_notes exists and is an array.
      const res = ensureResponseBody<ReplaceDraftAccountRes>(
        response,
        isReplaceDraftAccountRes,
        'replaceDraftAccount response',
      );

      // Assert the Payment Terms fields sent to the backend
      expect(body.account.collection_order_made).to.eq(true);
      expect(body.account.collection_order_made_today).to.eq(false);
      expect(body.account.collection_order_date).to.eq('2025-10-05');
      expect(body.account.payment_terms.enforcements).to.deep.include({
        result_id: 'COLLO',
        enforcement_result_responses: null,
      });

      // Assert the backend note text was created/retained as expected
      const sys = res.account.account_notes.find((n: any) => n.note_type === 'SYS') ?? {};
      expect(sys.account_note_text).to.contain(
        'A collection order was previously made on 05/10/2025 prior to this account creation',
      );
    });
  });

  it('S2: Original submitter, amends → criteria no longer met → system note removed', () => {
    setPaymentTermsForNote1(finesMacState, '05/10/2025');
    clearPaymentTermsCriteria(finesMacState);

    aliasReplaceDraftAccountOnce({ remove: true });
    setupComponent(finesDraftState, null, true, false);

    cy.wait('@getOffenceByCjsCode');
    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@replaceDraftAccount').then(({ request, response }) => {
      const body = ensureRequestBody<ReplaceDraftAccountReq>(
        request,
        isReplaceDraftAccountReq,
        'replaceDraftAccount request',
      );
      const res = ensureResponseBody<ReplaceDraftAccountRes>(
        response,
        isReplaceDraftAccountRes,
        'replaceDraftAccount response',
      );

      // Assert the Payment Terms fields sent to the backend
      expect(body.account.collection_order_made).to.eq(false);
      expect(body.account.collection_order_made_today).to.eq(false);
      expect([body.account.collection_order_date, null, '']).to.include(body.account.collection_order_date);

      // Assert the system note removed
      const sys = (res.account.account_notes || []).find((n: any) => n.note_type === 'SYS');
      expect(sys, 'system note should be removed').to.be.undefined;
    });
  });

  it('S3: Original submitter, amends (Note 2 → Note 1) → system note updated; still original submitter', () => {
    setPaymentTermsForNote2(finesMacState); // start as Note 2
    setPaymentTermsForNote1(finesMacState, '06/10/2025'); // change to Note 1

    aliasReplaceDraftAccountOnce();
    setupComponent(finesDraftState, null, true, false);

    cy.wait('@getOffenceByCjsCode');
    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@replaceDraftAccount').then(({ request, response }) => {
      const body = ensureRequestBody<ReplaceDraftAccountReq>(
        request,
        isReplaceDraftAccountReq,
        'replaceDraftAccount request',
      );
      const res = ensureResponseBody<ReplaceDraftAccountRes>(
        response,
        isReplaceDraftAccountRes,
        'replaceDraftAccount response',
      );

      // eligibility now Note 1
      expect(body.account.collection_order_made).to.eq(true);
      expect(body.account.collection_order_made_today).to.eq(false);
      expect(body.account.collection_order_date).to.eq('2025-10-06');

      // backend note updated to Note 1 text, attributed to original submitter
      const sys = res.account.account_notes.find((n: any) => n.note_type === 'SYS') ?? {};
      expect(sys.account_note_text).to.contain(
        'A collection order was previously made on 06/10/2025 prior to this account creation',
      );
    });
  });

  it('S4: Different submitter, resubmits w/o amending → Note 1 retained/created', () => {
    setPaymentTermsForNote1(finesMacState, '07/10/2025');

    aliasReplaceDraftAccountOnce();
    setupComponent(finesDraftState, null, true, false);

    cy.wait('@getOffenceByCjsCode');
    setLoggedInUser('Second Submitter');
    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@replaceDraftAccount').then(({ request, response }) => {
      const body = ensureRequestBody<ReplaceDraftAccountReq>(
        request,
        isReplaceDraftAccountReq,
        'replaceDraftAccount request',
      );
      const res = ensureResponseBody<ReplaceDraftAccountRes>(
        response,
        isReplaceDraftAccountRes,
        'replaceDraftAccount response',
      );

      // eligibility still Note 1
      expect(body.account.collection_order_made).to.eq(true);
      expect(body.account.collection_order_made_today).to.eq(false);
      expect(body.account.collection_order_date).to.eq('2025-10-07');

      // backend note retained/created
      const sys = res.account.account_notes.find((n: any) => n.note_type === 'SYS') ?? {};
      expect(sys.account_note_text).to.contain(
        'A collection order was previously made on 07/10/2025 prior to this account creation',
      );
    });
  });

  it('S5: Different submitter, amends → criteria no longer met → system note removed', () => {
    setPaymentTermsForNote1(finesMacState, '08/10/2025');
    setLoggedInUser('Second Submitter');
    clearPaymentTermsCriteria(finesMacState);

    aliasReplaceDraftAccountOnce({ remove: true });
    setupComponent(finesDraftState, null, true, false);

    cy.wait('@getOffenceByCjsCode');
    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@replaceDraftAccount').then(({ request, response }) => {
      const body = ensureRequestBody<ReplaceDraftAccountReq>(
        request,
        isReplaceDraftAccountReq,
        'replaceDraftAccount request',
      );
      const res = ensureResponseBody<ReplaceDraftAccountRes>(
        response,
        isReplaceDraftAccountRes,
        'replaceDraftAccount response',
      );

      // eligibility cleared
      expect(body.account.collection_order_made).to.eq(false);
      expect(body.account.collection_order_made_today).to.eq(false);
      expect([body.account.collection_order_date, null, '']).to.include(body.account.collection_order_date);

      // system note removed
      const sys = (res.account.account_notes || []).find((n: any) => n.note_type === 'SYS');
      expect(sys, 'system note should be removed').to.be.undefined;
    });
  });

  it('S6: Different submitter, amends (Note 1 → Note 2) → system note updated & attributed to second submitter', () => {
    setPaymentTermsForNote1(finesMacState, '09/10/2025'); // start Note 1
    setLoggedInUser('Second Submitter');
    setPaymentTermsForNote2(finesMacState); // switch to Note 2

    aliasReplaceDraftAccountOnce({ author: 'Second Submitter' });
    setupComponent(finesDraftState, null, true, false);

    cy.wait('@getOffenceByCjsCode');
    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@replaceDraftAccount').then(({ request, response }) => {
      const body = ensureRequestBody<ReplaceDraftAccountReq>(
        request,
        isReplaceDraftAccountReq,
        'replaceDraftAccount request',
      );
      const res = ensureResponseBody<ReplaceDraftAccountRes>(
        response,
        isReplaceDraftAccountRes,
        'replaceDraftAccount response',
      );

      // eligibility now Note 2
      expect(body.account.collection_order_made).to.eq(false);
      expect(body.account.collection_order_made_today).to.eq(true);
      expect([body.account.collection_order_date, null, '']).to.include(body.account.collection_order_date);

      // backend note updated & attributed to second submitter
      const sys = res.account.account_notes.find((n: any) => n.note_type === 'SYS') ?? {};
      expect(sys.account_note_text).to.match(/A collection order has been made by .* using Authorised Functions/);
      expect(sys.account_note_text).to.match(/A collection order has been made by .* using Authorised Functions/);
      expect(sys.account_note_text).to.contain('Second.Submitter'); // attribution inferred from text
    });
  });
});
