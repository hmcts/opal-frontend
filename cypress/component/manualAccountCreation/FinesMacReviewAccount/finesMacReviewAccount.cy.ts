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
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FINES_AYG_CHECK_ACCOUNT_MOCK } from 'cypress/component/manualAccountCreation/FinesMacReviewAccount/mocks/fines_mac_review_account_mocks';
import { DOM_ELEMENTS } from './constants/fines_mac_review_account_elements';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';
import { interceptOffences } from 'cypress/component/CommonIntercepts/CommonIntercepts.cy';
import { FINES_MAC_ACCOUNT_TYPES } from 'src/app/flows/fines/fines-mac/constants/fines-mac-account-types';

/** Small “shape” of the GlobalStore needed for the helpers. */
type GlobalStoreLike = {
  setUserState: (state: unknown) => void;
  getUserState?: () =>
    | {
        user?: { givenName?: string; familyName?: string; name?: string };
        name?: string;
      }
    | undefined;
};

/** Stash the instance the DI system creates so helpers can find it. */
let latestGlobalStoreInstance: GlobalStoreLike | null = null;

// Basic runtime checks
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

// Own-property check
function hasOwnKey(obj: object, key: PropertyKey): boolean {
  return Object.getOwnPropertyDescriptor(obj, key) !== undefined;
}

// Ensure a nested property exists as an object; create it if needed. */
function ensureNested(obj: Record<string, unknown>, key: string): Record<string, unknown> {
  const cur = obj[key];
  if (isRecord(cur)) return cur;
  const fresh: Record<string, unknown> = {};
  obj[key] = fresh;
  return fresh;
}

// ----- Note text builders -----
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

/** Read the SYS note text from a request body if present (undefined if absent). */
function getSysNoteTextFromReq(reqBody: unknown): string | undefined {
  if (!isRecord(reqBody)) return undefined;
  const acc = reqBody['account'];
  if (!isRecord(acc)) return undefined;
  const notes = acc['account_notes'];
  if (!Array.isArray(notes)) return undefined;

  const sys = notes.find(
    (n): n is Record<string, unknown> =>
      isRecord(n) && n['note_type'] === 'SYS' && typeof n['account_note_text'] === 'string',
  );
  return sys ? (sys['account_note_text'] as string) : undefined;
}

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

  const note = getSysNoteTextFromReq(reqBody);
  if (note !== undefined && authorFullName) {
    expect(note).to.eq(expectedNote2(authorFullName));
  }
}

// ----- Logged-in user helper (uses GlobalStore exposed on window, or last instance) -----
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

// ----- Payment Terms shapers (mutate finesMacState) -----
function setPaymentTermsForNote1(state: unknown, ddMmYyyy: string): void {
  if (!isRecord(state)) return;
  const paymentTerms = ensureNested(state, 'paymentTerms');
  const formData = ensureNested(paymentTerms, 'formData');
  formData['fm_payment_terms_collection_order_made'] = true;
  formData['fm_payment_terms_collection_order_date'] = ddMmYyyy;
  formData['fm_payment_terms_collection_order_made_today'] = false;
  formData['fm_payment_terms_add_enforcement_action'] = false;
}

function setPaymentTermsForNote2(state: unknown): void {
  if (!isRecord(state)) return;
  const paymentTerms = ensureNested(state, 'paymentTerms');
  const formData = ensureNested(paymentTerms, 'formData');
  formData['fm_payment_terms_collection_order_made'] = false;
  formData['fm_payment_terms_collection_order_date'] = '';
  formData['fm_payment_terms_collection_order_made_today'] = true;
  formData['fm_payment_terms_add_enforcement_action'] = false;
}

function clearPaymentTermsCriteria(state: unknown): void {
  if (!isRecord(state)) return;
  const paymentTerms = ensureNested(state, 'paymentTerms');
  const formData = ensureNested(paymentTerms, 'formData');
  formData['fm_payment_terms_collection_order_made'] = false;
  formData['fm_payment_terms_collection_order_date'] = '';
  formData['fm_payment_terms_collection_order_made_today'] = false;
  formData['fm_payment_terms_add_enforcement_action'] = false;
}

describe('FinesMacReviewAccountComponent', () => {
  let finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
  let finesDraftState = structuredClone(FINES_DRAFT_STATE);
  let finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;

  let store: any;

  /**
   * Mount the Review Account component with the three stores and a minimal ActivatedRoute.
   * After mount, mirror the created GlobalStore on window.globalStore so helpers can find it.
   */
  const setupComponent = (
    finesDraftStateMock: any = finesDraftState,
    activatedRouteMock: any = null,
    amend: boolean = true,
    checker: boolean = false,
  ) => {
    mount(FinesMacReviewAccountComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        UtilsService,
        FinesMacPayloadService,
        {
          // Router: stub navigate calls so we don't actually change the URL.
          provide: Router,
          useValue: {
            navigate: cy.stub().as('routerNavigate'),
            navigateByUrl: cy.stub().as('routerNavigateByUrl'),
          },
        },
        {
          // GlobalStore: create the instance used by the app and keep a reference for helpers.
          provide: GlobalStore,
          useFactory: () => {
            const store = new GlobalStore();
            store.setUserState(OPAL_USER_STATE_MOCK);
            store.setError({ error: false, message: '' });

            // make it discoverable by helpers
            if (typeof window !== 'undefined') {
              (window as unknown as { globalStore?: GlobalStoreLike }).globalStore =
                store as unknown as GlobalStoreLike;
            }
            latestGlobalStoreInstance = store as unknown as GlobalStoreLike;

            return store;
          },
        },
        {
          // FinesMacStore: in-progress form state (we mutate this in helpers above).
          provide: FinesMacStore,
          useFactory: () => {
            let store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          // FinesDraftStore: draft-level flags and state.
          provide: FinesDraftStore,
          useFactory: () => {
            let store = new FinesDraftStore();
            store.setFinesDraftState(finesDraftStateMock);
            store.setAmend(amend);
            store.setChecker(checker);
            return store;
          },
        },
        {
          // ActivatedRoute: just enough data for the component to render.
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'draftAccountId' ? '42' : null),
              },
              data: {
                reviewAccountFetchMap: {
                  finesMacStore: finesMacState,
                  finesMacDraft: activatedRouteMock,
                },
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
              },
              parent: {
                snapshot: {
                  url: [{ path: 'manual-account-creation' }],
                },
              },
            },
          },
        },
      ],
      componentProperties: {},
    });
  };
  beforeEach(() => {
    interceptOffences();
    cy.intercept('POST', '**/opal-fines-service/draft-accounts**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    }).as('postDraftAccount');
    cy.intercept('PUT', '**/opal-fines-service/draft-accounts/**', (req) => {
      req.alias = 'replaceDraftAccount';
      req.reply({ statusCode: 200, body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK });
    });
    cy.intercept('GET', '**/opal-fines-service/draft-accounts**', {
      statusCode: 200,
      body: OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK,
    }).as('getDraftAccounts');
  });
  beforeEach(() => {
    cy.then(() => {
      finesMacState = structuredClone(FINES_AYG_CHECK_ACCOUNT_MOCK);
      finesDraftState = structuredClone(FINES_DRAFT_STATE);
      finesAccountPayload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;
    });
  });

  it('should render component', () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it(
    '(AC.1a)should render court details and offence details for all defendant types',
    { tags: ['@PO-560', '@PO-662', '@PO-663', '@PO-545', '@PO-657'] },
    () => {
      setupComponent();
      cy.wait('@getOffenceByCjsCode');

      cy.get(DOM_ELEMENTS.originatorName).should('exist');
      cy.get(DOM_ELEMENTS.prosecutorCaseReference).should('exist');
      cy.get(DOM_ELEMENTS.enforcementCourt).should('exist');

      cy.get(DOM_ELEMENTS.headingLarge).should('exist');
      cy.get(DOM_ELEMENTS.headingMedium).should('exist');
      cy.get(DOM_ELEMENTS.dateOfSentence).should('exist');
      cy.get(DOM_ELEMENTS.offencecode).should('exist');

      cy.get(DOM_ELEMENTS.tableHeadings).should('exist');

      cy.get(DOM_ELEMENTS.impositionType).should('exist');
      cy.get(DOM_ELEMENTS.creditor).should('exist');
      cy.get(DOM_ELEMENTS.amountImposed).should('exist');
      cy.get(DOM_ELEMENTS.amountPaid).should('exist');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('exist');

      cy.get(DOM_ELEMENTS.totalHeading).should('exist');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('exist');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('exist');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('exist');

      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('exist');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('exist');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance).should('exist');

      cy.get(DOM_ELEMENTS.originatorName)
        .should('contain', 'Sending area or Local Justice Area (LJA)')
        .should('contain', 'Asylum & Immigration Tribunal (9985)');
      cy.get(DOM_ELEMENTS.prosecutorCaseReference)
        .should('contain', 'Prosecutor Case Reference (PCR)')
        .should('contain', 'O1AT204003');
      cy.get(DOM_ELEMENTS.enforcementCourt)
        .should('contain', 'Enforcement court')
        .should('contain', 'Historic Debt Database (101)');

      cy.get(DOM_ELEMENTS.dateOfSentence).should('contain', 'Date of sentence').should('contain', '01 October 2022');
      cy.get(DOM_ELEMENTS.offencecode).should('contain', 'AK123456').should('contain', 'ak test');

      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Imposition');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Creditor');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.tableHeadings).should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.impositionType).should('contain', 'Criminal Courts Charge');
      cy.get(DOM_ELEMENTS.creditor).should('contain', 'HM Courts & Tribunals Service (HMCTS)');
      cy.get(DOM_ELEMENTS.amountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.amountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.balanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.totalHeading).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.totalAmountImposed).should('contain', '£200.00');
      cy.get(DOM_ELEMENTS.totalAmountPaid).should('contain', '£50.00');
      cy.get(DOM_ELEMENTS.totalBalanceRemaining).should('contain', '£150.00');

      cy.get(DOM_ELEMENTS.headingMedium).should('contain', 'Totals');
      cy.get(DOM_ELEMENTS.GrandtotalAmountImposed).should('contain', '£200.00').should('contain', 'Amount imposed');
      cy.get(DOM_ELEMENTS.GrandtotalAmountPaid).should('contain', '£50.00').should('contain', 'Amount paid');
      cy.get(DOM_ELEMENTS.GrandtotalRemainingBalance)
        .should('contain', '£150.00')
        .should('contain', 'Balance remaining');

      cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
      cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
      cy.get(DOM_ELEMENTS.requestPaymentCard).should('contain', 'Request payment card').should('contain', 'Yes');
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('contain', 'There are days in default').should('contain', 'No');
      cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');
    },
  );

  it(
    '(AC.1a,AC.2,AC.5)should render all elements on the screen for AY check account',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Personal details
      cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
      cy.get(DOM_ELEMENTS.title).should('exist');
      cy.get(DOM_ELEMENTS.forenames).should('exist');
      cy.get(DOM_ELEMENTS.surname).should('exist');
      cy.get(DOM_ELEMENTS.aliases).should('exist');
      cy.get(DOM_ELEMENTS.dob).should('exist');
      cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
      cy.get(DOM_ELEMENTS.address).should('exist');
      cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('exist');
      cy.get(DOM_ELEMENTS.registrationNumber).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Employer details
      cy.get(DOM_ELEMENTS.employerName).should('exist');
      cy.get(DOM_ELEMENTS.employeeReference).should('exist');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.employerAddress).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.deleteLink).should('exist');
    },
  );

  it(
    '(AC.4a) should check each summary list has change button next to them for AY',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Personal details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Contact details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Employer details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Offences and impositions').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Payment terms').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Account comments and notes').should('contain', 'Change');
    },
  );

  it(
    '(AC.1,AC.2,AC.4) should have all correct text on all elements for AY',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      cy.get(DOM_ELEMENTS.heading).should('contain', 'Check account details');

      cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
      cy.get(DOM_ELEMENTS.accountTypeData)
        .should('contain', 'Account type')
        .should('contain', FINES_MAC_ACCOUNT_TYPES.Fine);
      cy.get(DOM_ELEMENTS.defendantTypeData)
        .should('contain', 'Defendant type')
        .should('contain', 'Adult or youth only');

      cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
      cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
      cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
      cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
      cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
      cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
        .should('contain', 'National Insurance number')
        .should('contain', 'AB123456C');
      cy.get(DOM_ELEMENTS.address)
        .should('contain', 'Address')
        .should('contain', '123 Fake Street')
        .should('contain', 'Fake Town')
        .should('contain', 'Fake City')
        .should('contain', 'AB12 3CD');
      cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', 'Ford');
      cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'Registration number').should('contain', 'AB12 CDE');

      cy.get(DOM_ELEMENTS.primaryEmailAddress)
        .should('contain', 'Primary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress)
        .should('contain', 'Secondary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
        .should('contain', 'Mobile telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber)
        .should('contain', 'Home telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.workTelephoneNumber)
        .should('contain', 'Work telephone number')
        .should('contain', '0123456789');

      cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
      cy.get(DOM_ELEMENTS.employeeReference)
        .should('contain', 'Employee reference')
        .should('contain', 'Test Reference');
      cy.get(DOM_ELEMENTS.employerEmailAddress)
        .should('contain', 'Employer email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber)
        .should('contain', 'Employer telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.employerAddress)
        .should('contain', 'Employer address')
        .should('contain', 'test address line 1')
        .should('contain', 'test address line 2')
        .should('contain', 'test address line 3')
        .should('contain', 'test address line 4')
        .should('contain', 'test address line 5')
        .should('contain', 'test post code');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

      cy.get(DOM_ELEMENTS.changeLink).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Submit for review');
      cy.get(DOM_ELEMENTS.deleteLink).should('contain', 'Delete account');
    },
  );

  it(
    '(AC.3,AC.7) should show dashed line if Data is empty for non required details',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.employerDetails.formData = {
        fm_employer_details_employer_address_line_1: '',
        fm_employer_details_employer_address_line_2: '',
        fm_employer_details_employer_address_line_3: '',
        fm_employer_details_employer_address_line_4: '',
        fm_employer_details_employer_address_line_5: '',
        fm_employer_details_employer_company_name: '',
        fm_employer_details_employer_email_address: '',
        fm_employer_details_employer_post_code: '',
        fm_employer_details_employer_reference: '',
        fm_employer_details_employer_telephone_number: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
        fm_account_comments_notes_system_notes: '',
      };

      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('contain', 'Secondary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('contain', 'Mobile telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

      cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', '—');
      cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('contain', 'Employer email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber)
        .should('contain', 'Employer telephone number')
        .should('contain', '—');
      cy.get(DOM_ELEMENTS.employerAddress)
        .should('contain', 'Employer address')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
    },
  );

  it(
    '(AC.3,AC.7) should show dash lines for non required fields in the details',
    { tags: ['@PO-560', '@PO-272', '@PO-657'] },
    () => {
      setupComponent();

      finesMacState.personalDetails.formData.fm_personal_details_vehicle_make = '';

      cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', '—');
    },
  );

  it(
    '(AC.1,AC.2,AC.5)should render all elements on the screen for AYPG ',
    { tags: ['@PO-662', '@PO-344', '@PO-657'] },
    () => {
      setupComponent();

      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';
      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Personal details
      cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
      cy.get(DOM_ELEMENTS.title).should('exist');
      cy.get(DOM_ELEMENTS.forenames).should('exist');
      cy.get(DOM_ELEMENTS.surname).should('exist');
      cy.get(DOM_ELEMENTS.aliases).should('exist');
      cy.get(DOM_ELEMENTS.dob).should('exist');
      cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
      cy.get(DOM_ELEMENTS.address).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Employer details
      cy.get(DOM_ELEMENTS.employerName).should('exist');
      cy.get(DOM_ELEMENTS.employeeReference).should('exist');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.employerAddress).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
      cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.deleteLink).should('exist');

      //parent guardian details
      cy.get(DOM_ELEMENTS.PGforenames).should('exist');
      cy.get(DOM_ELEMENTS.PGsurname).should('exist');
      cy.get(DOM_ELEMENTS.aliases).should('exist');
      cy.get(DOM_ELEMENTS.PGdob).should('exist');
      cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('exist');
      cy.get(DOM_ELEMENTS.PGaddress).should('exist');
      cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('exist');
      cy.get(DOM_ELEMENTS.PGregistrationNumber).should('exist');
    },
  );

  it('(AC.3,AC.5) should load all data into elements for AYPG', { tags: ['@PO-662', '@PO-344', '@PO-657'] }, () => {
    setupComponent();
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Check account details');

    cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.accountTypeData)
      .should('contain', 'Account type')
      .should('contain', FINES_MAC_ACCOUNT_TYPES.Fine);
    cy.get(DOM_ELEMENTS.defendantTypeData)
      .should('contain', 'Defendant type')
      .should('contain', 'Adult or youth with parent or guardian to pay');

    cy.get(DOM_ELEMENTS.PGforenames).should('contain', 'Test');
    cy.get(DOM_ELEMENTS.PGsurname).should('contain', 'test');
    cy.get(DOM_ELEMENTS.PGAliases).should('contain', 'test test');
    cy.get(DOM_ELEMENTS.PGdob).should('contain', '01 February 1990');
    cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.PGaddress)
      .should('contain', 'Address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('contain', 'renault');
    cy.get(DOM_ELEMENTS.PGregistrationNumber).should('contain', 'cd12 efg');

    cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
    cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
    cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
    cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
      .should('contain', 'National Insurance number')
      .should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.address)
      .should('contain', 'Address')
      .should('contain', '123 Fake Street')
      .should('contain', 'Fake Town')
      .should('contain', 'Fake City')
      .should('contain', 'AB12 3CD');

    cy.get(DOM_ELEMENTS.primaryEmailAddress)
      .should('contain', 'Primary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress)
      .should('contain', 'Secondary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
      .should('contain', 'Mobile telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '0123456789');

    cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
    cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', 'Test Reference');
    cy.get(DOM_ELEMENTS.employerEmailAddress)
      .should('contain', 'Employer email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber)
      .should('contain', 'Employer telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.employerAddress)
      .should('contain', 'Employer address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test address line 4')
      .should('contain', 'test address line 5')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
    cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('contain', 'Request payment card').should('contain', 'Yes');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('contain', 'There are days in default').should('contain', 'No');
    cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

    cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

    cy.get(DOM_ELEMENTS.changeLink).should('exist');
    cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Submit for review');
    cy.get(DOM_ELEMENTS.deleteLink).should('contain', 'Delete account');
  });

  it(
    '(AC.4a)should check each summary list has change button next to them for AYPG',
    { tags: ['@PO-662', '@PO-344', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Defendant details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Contact details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Employer details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Offences and impositions').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Parent or guardian details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Payment terms').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Account comments and notes').should('contain', 'Change');
    },
  );
  it(
    '(AC.3)should show dashed line if Data is empty for non required details AYPG',
    { tags: ['@PO-662', '@PO-344'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.employerDetails.formData = {
        fm_employer_details_employer_address_line_1: '',
        fm_employer_details_employer_address_line_2: '',
        fm_employer_details_employer_address_line_3: '',
        fm_employer_details_employer_address_line_4: '',
        fm_employer_details_employer_address_line_5: '',
        fm_employer_details_employer_company_name: '',
        fm_employer_details_employer_email_address: '',
        fm_employer_details_employer_post_code: '',
        fm_employer_details_employer_reference: '',
        fm_employer_details_employer_telephone_number: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
        fm_account_comments_notes_system_notes: '',
      };

      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('contain', 'Secondary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('contain', 'Mobile telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

      cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', '—');
      cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerEmailAddress).should('contain', 'Employer email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.employerTelephoneNumber)
        .should('contain', 'Employer telephone number')
        .should('contain', '—');
      cy.get(DOM_ELEMENTS.employerAddress)
        .should('contain', 'Employer address')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—')
        .should('contain', '—');
      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
    },
  );

  it(
    '(AC.3,AC.7) should show dash lines for non required fields in the details AYPG',
    { tags: ['@PO-662', '@PO-344', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      finesMacState.parentGuardianDetails.formData.fm_parent_guardian_details_vehicle_make = '';

      cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', '—');
    },
  );

  it(
    '(AC.1,AC.2,AC.5,AC.6)should render all elements for company defendant type',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Company Details
      cy.get(DOM_ELEMENTS.companyName).should('exist');
      cy.get(DOM_ELEMENTS.companyAliases).should('exist');
      cy.get(DOM_ELEMENTS.companyAddress).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.submitButton).should('exist');
      cy.get(DOM_ELEMENTS.deleteLink).should('exist');
    },
  );

  it(
    '(AC.1,AC.2,AC.6)should load all data into elements for company',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.heading).should('contain', 'Check account details');

      cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
      cy.get(DOM_ELEMENTS.accountTypeData)
        .should('contain', 'Account type')
        .should('contain', FINES_MAC_ACCOUNT_TYPES.Fine);
      cy.get(DOM_ELEMENTS.defendantTypeData).should('contain', 'Defendant type').should('contain', 'Company');

      cy.get(DOM_ELEMENTS.companyName).should('contain', 'Company name').should('contain', 'test company');
      cy.get(DOM_ELEMENTS.companyAliases).should('contain', 'Aliases').should('contain', 'test alias');
      cy.get(DOM_ELEMENTS.companyAddress)
        .should('contain', 'Address')
        .should('contain', 'test address line 1')
        .should('contain', 'test address line 2')
        .should('contain', 'test address line 3')
        .should('contain', 'test post code');

      cy.get(DOM_ELEMENTS.primaryEmailAddress)
        .should('contain', 'Primary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress)
        .should('contain', 'Secondary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
        .should('contain', 'Mobile telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber)
        .should('contain', 'Home telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.workTelephoneNumber)
        .should('contain', 'Work telephone number')
        .should('contain', '0123456789');

      cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
      cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
      cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

      cy.get(DOM_ELEMENTS.changeLink).should('exist');
      cy.get(DOM_ELEMENTS.submitButton).should('contain', 'Submit for review');
      cy.get(DOM_ELEMENTS.deleteLink).should('contain', 'Delete account');
    },
  );

  it(
    '(AC.4a)should check each summary list has change button next to them for Company',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Company details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Contact details').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Offences and impositions').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Payment terms').should('contain', 'Change');
      cy.get(DOM_ELEMENTS.summaryTitle).should('contain', 'Account comments and notes').should('contain', 'Change');
    },
  );
  it(
    '(AC.3,AC.7) should show dashed line if Data is empty for non required details Company',
    { tags: ['@PO-663', '@PO-345', '@PO-657'] },
    () => {
      setupComponent();
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
        fm_account_comments_notes_system_notes: '',
      };

      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('contain', 'Secondary email address').should('contain', '—');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('contain', 'Mobile telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
    },
  );
  it('(AC.2,AC,3a,AC.3bi) should show in review for accounts in review', { tags: ['@PO-610', '@PO-584'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload);

    cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
    cy.get(DOM_ELEMENTS.reviewComponent).should('exist');
    cy.get(DOM_ELEMENTS.status).contains('In review').should('exist');
    cy.get(DOM_ELEMENTS.reviewHistory).contains('Review history').should('exist');
    cy.get(DOM_ELEMENTS.timeLine).should('exist');
    cy.get(DOM_ELEMENTS.timeLineTitle).contains('Submitted').should('exist');
    cy.get(DOM_ELEMENTS.timelineAuthor).contains('by Timmy Test').should('exist');
    cy.get(DOM_ELEMENTS.timelineDate).contains('03 July 2023').should('exist');
  });

  it(
    'should not load review component if account is not in review and should load normal Check account details heading',
    { tags: ['@PO-610', '@PO-584'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.reviewComponent).should('not.exist');
      cy.get(DOM_ELEMENTS.heading).contains('Check account details').should('exist');
    },
  );

  it('(AC.3bii,AC.3biii,AC.3c)should show history of timeline data', { tags: ['@PO-610', '@PO-584'] }, () => {
    finesAccountPayload.timeline_data.push({
      username: 'Timmy Test',
      status: 'Rejected',
      status_date: '2023-07-05',
      reason_text: null,
    });
    finesAccountPayload.timeline_data.push({
      username: 'Timmy Test',
      status: 'Submitted',
      status_date: '2023-07-07',
      reason_text: null,
    });

    setupComponent(finesAccountPayload, finesAccountPayload, true);

    cy.get(DOM_ELEMENTS.timeLine).should('exist');
    const timelineEntries = [
      { title: 'Submitted', author: 'by Timmy Test', date: '03 July 2023' },
      { title: 'Rejected', author: 'by Timmy Test', date: '05 July 2023' },
      { title: 'Submitted', author: 'by Timmy Test', date: '07 July 2023' },
    ];

    timelineEntries.forEach((entry) => {
      cy.get(DOM_ELEMENTS.timeLineTitle).contains(entry.title).should('exist');
      cy.get(DOM_ELEMENTS.timelineAuthor).contains(entry.author).should('exist');
      cy.get(DOM_ELEMENTS.timelineDate).contains(entry.date).should('exist');
    });
  });

  it('(AC.4) should render summary tables under review account for AY', { tags: ['@PO-610', '@PO-584'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload);

    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    // Account details
    cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
    cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
    cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

    // Personal details
    cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
    cy.get(DOM_ELEMENTS.title).should('exist');
    cy.get(DOM_ELEMENTS.forenames).should('exist');
    cy.get(DOM_ELEMENTS.surname).should('exist');
    cy.get(DOM_ELEMENTS.aliases).should('exist');
    cy.get(DOM_ELEMENTS.dob).should('exist');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
    cy.get(DOM_ELEMENTS.address).should('exist');
    cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('exist');
    cy.get(DOM_ELEMENTS.registrationNumber).should('exist');

    // Contact details
    cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

    // Employer details
    cy.get(DOM_ELEMENTS.employerName).should('exist');
    cy.get(DOM_ELEMENTS.employeeReference).should('exist');
    cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.employerAddress).should('exist');

    // Payment terms
    cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
    cy.get(DOM_ELEMENTS.payByDate).should('exist');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
    cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

    // Account comments and notes
    cy.get(DOM_ELEMENTS.comments).should('exist');
    cy.get(DOM_ELEMENTS.accountNotes).should('exist');

    cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.accountTypeData)
      .should('contain', 'Account type')
      .should('contain', FINES_MAC_ACCOUNT_TYPES.Fine);
    cy.get(DOM_ELEMENTS.defendantTypeData).should('contain', 'Defendant type').should('contain', 'Adult or youth only');

    cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
    cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
    cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
    cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
      .should('contain', 'National Insurance number')
      .should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.address)
      .should('contain', 'Address')
      .should('contain', '123 Fake Street')
      .should('contain', 'Fake Town')
      .should('contain', 'Fake City')
      .should('contain', 'AB12 3CD');
    cy.get(DOM_ELEMENTS.vehicleMakeOrModel).should('contain', 'Vehicle make and model').should('contain', 'Ford');
    cy.get(DOM_ELEMENTS.registrationNumber).should('contain', 'Registration number').should('contain', 'AB12 CDE');

    cy.get(DOM_ELEMENTS.primaryEmailAddress)
      .should('contain', 'Primary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress)
      .should('contain', 'Secondary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
      .should('contain', 'Mobile telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '0123456789');

    cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
    cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', 'Test Reference');
    cy.get(DOM_ELEMENTS.employerEmailAddress)
      .should('contain', 'Employer email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber)
      .should('contain', 'Employer telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.employerAddress)
      .should('contain', 'Employer address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test address line 4')
      .should('contain', 'test address line 5')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

    cy.get(DOM_ELEMENTS.changeLink).should('exist');
  });

  it('(AC.5) should render all elements on the screen for AYPG', { tags: ['@PO-610', '@PO-584'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload);
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';
    cy.get(DOM_ELEMENTS.heading).should('exist');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    // Account details
    cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
    cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
    cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

    // Personal details
    cy.get(DOM_ELEMENTS.summaryTitle).should('exist');
    cy.get(DOM_ELEMENTS.title).should('exist');
    cy.get(DOM_ELEMENTS.forenames).should('exist');
    cy.get(DOM_ELEMENTS.surname).should('exist');
    cy.get(DOM_ELEMENTS.aliases).should('exist');
    cy.get(DOM_ELEMENTS.dob).should('exist');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber).should('exist');
    cy.get(DOM_ELEMENTS.address).should('exist');

    // Contact details
    cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

    // Employer details
    cy.get(DOM_ELEMENTS.employerName).should('exist');
    cy.get(DOM_ELEMENTS.employeeReference).should('exist');
    cy.get(DOM_ELEMENTS.employerEmailAddress).should('exist');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber).should('exist');
    cy.get(DOM_ELEMENTS.employerAddress).should('exist');

    // Payment terms
    cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
    cy.get(DOM_ELEMENTS.payByDate).should('exist');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('exist');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('exist');
    cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

    // Account comments and notes
    cy.get(DOM_ELEMENTS.comments).should('exist');
    cy.get(DOM_ELEMENTS.accountNotes).should('exist');

    //parent guardian details
    cy.get(DOM_ELEMENTS.PGforenames).should('exist');
    cy.get(DOM_ELEMENTS.PGsurname).should('exist');
    cy.get(DOM_ELEMENTS.aliases).should('exist');
    cy.get(DOM_ELEMENTS.PGdob).should('exist');
    cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('exist');
    cy.get(DOM_ELEMENTS.PGaddress).should('exist');
    cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('exist');
    cy.get(DOM_ELEMENTS.PGregistrationNumber).should('exist');

    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

    cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.accountTypeData)
      .should('contain', 'Account type')
      .should('contain', FINES_MAC_ACCOUNT_TYPES.Fine);
    cy.get(DOM_ELEMENTS.defendantTypeData)
      .should('contain', 'Defendant type')
      .should('contain', 'Adult or youth with parent or guardian to pay');

    cy.get(DOM_ELEMENTS.PGforenames).should('contain', 'Test');
    cy.get(DOM_ELEMENTS.PGsurname).should('contain', 'test');
    cy.get(DOM_ELEMENTS.PGAliases).should('contain', 'test test');
    cy.get(DOM_ELEMENTS.PGdob).should('contain', '01 February 1990');
    cy.get(DOM_ELEMENTS.PGnationalInsuranceNumber).should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.PGaddress)
      .should('contain', 'Address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.PGvehicleMakeOrModel).should('contain', 'renault');
    cy.get(DOM_ELEMENTS.PGregistrationNumber).should('contain', 'cd12 efg');

    cy.get(DOM_ELEMENTS.title).should('contain', 'Title').should('contain', 'Mr');
    cy.get(DOM_ELEMENTS.forenames).should('contain', 'First names').should('contain', 'John');
    cy.get(DOM_ELEMENTS.surname).should('contain', 'Last name').should('contain', 'Doe');
    cy.get(DOM_ELEMENTS.aliases).should('contain', 'Aliases').should('contain', 'Rebecca Johnson');
    cy.get(DOM_ELEMENTS.dob).should('contain', 'Date of birth').should('contain', '01 January 2000 (Adult)');
    cy.get(DOM_ELEMENTS.nationalInsuranceNumber)
      .should('contain', 'National Insurance number')
      .should('contain', 'AB123456C');
    cy.get(DOM_ELEMENTS.address)
      .should('contain', 'Address')
      .should('contain', '123 Fake Street')
      .should('contain', 'Fake Town')
      .should('contain', 'Fake City')
      .should('contain', 'AB12 3CD');

    cy.get(DOM_ELEMENTS.primaryEmailAddress)
      .should('contain', 'Primary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.secondaryEmailAddress)
      .should('contain', 'Secondary email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
      .should('contain', 'Mobile telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '0123456789');

    cy.get(DOM_ELEMENTS.employerName).should('contain', 'Employer name').should('contain', 'Test Company');
    cy.get(DOM_ELEMENTS.employeeReference).should('contain', 'Employee reference').should('contain', 'Test Reference');
    cy.get(DOM_ELEMENTS.employerEmailAddress)
      .should('contain', 'Employer email address')
      .should('contain', 'test@test.com');
    cy.get(DOM_ELEMENTS.employerTelephoneNumber)
      .should('contain', 'Employer telephone number')
      .should('contain', '0123456789');
    cy.get(DOM_ELEMENTS.employerAddress)
      .should('contain', 'Employer address')
      .should('contain', 'test address line 1')
      .should('contain', 'test address line 2')
      .should('contain', 'test address line 3')
      .should('contain', 'test address line 4')
      .should('contain', 'test address line 5')
      .should('contain', 'test post code');

    cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
    cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
    cy.get(DOM_ELEMENTS.requestPaymentCard).should('contain', 'Request payment card').should('contain', 'Yes');
    cy.get(DOM_ELEMENTS.hasDaysInDefault).should('contain', 'There are days in default').should('contain', 'No');
    cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

    cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
    cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

    cy.get(DOM_ELEMENTS.changeLink).should('exist');
  });

  it(
    '(AC.6) should render all elements on the screen for company defendant type',
    { tags: ['@PO-610', '@PO-584'] },
    () => {
      setupComponent(finesAccountPayload, finesAccountPayload);
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'company';

      cy.get(DOM_ELEMENTS.heading).should('exist');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      // Account details
      cy.get(DOM_ELEMENTS.businessUnitData).should('exist');
      cy.get(DOM_ELEMENTS.accountTypeData).should('exist');
      cy.get(DOM_ELEMENTS.defendantTypeData).should('exist');

      // Company Details
      cy.get(DOM_ELEMENTS.companyName).should('exist');
      cy.get(DOM_ELEMENTS.companyAliases).should('exist');
      cy.get(DOM_ELEMENTS.companyAddress).should('exist');

      // Contact details
      cy.get(DOM_ELEMENTS.primaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress).should('exist');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('exist');
      cy.get(DOM_ELEMENTS.workTelephoneNumber).should('exist');

      // Payment terms
      cy.get(DOM_ELEMENTS.paymentTerms).should('exist');
      cy.get(DOM_ELEMENTS.payByDate).should('exist');
      cy.get(DOM_ELEMENTS.enforcementActions).should('exist');

      // Account comments and notes
      cy.get(DOM_ELEMENTS.comments).should('exist');
      cy.get(DOM_ELEMENTS.accountNotes).should('exist');

      cy.get(DOM_ELEMENTS.businessUnitData).should('contain', 'Business unit');
      cy.get(DOM_ELEMENTS.accountTypeData)
        .should('contain', 'Account type')
        .should('contain', FINES_MAC_ACCOUNT_TYPES.Fine);
      cy.get(DOM_ELEMENTS.defendantTypeData).should('contain', 'Defendant type').should('contain', 'Company');

      cy.get(DOM_ELEMENTS.companyName).should('contain', 'Company name').should('contain', 'test company');
      cy.get(DOM_ELEMENTS.companyAliases).should('contain', 'Aliases').should('contain', 'test alias');
      cy.get(DOM_ELEMENTS.companyAddress)
        .should('contain', 'Address')
        .should('contain', 'test address line 1')
        .should('contain', 'test address line 2')
        .should('contain', 'test address line 3')
        .should('contain', 'test post code');

      cy.get(DOM_ELEMENTS.primaryEmailAddress)
        .should('contain', 'Primary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.secondaryEmailAddress)
        .should('contain', 'Secondary email address')
        .should('contain', 'test@test.com');
      cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
        .should('contain', 'Mobile telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.homeTelephoneNumber)
        .should('contain', 'Home telephone number')
        .should('contain', '0123456789');
      cy.get(DOM_ELEMENTS.workTelephoneNumber)
        .should('contain', 'Work telephone number')
        .should('contain', '0123456789');

      cy.get(DOM_ELEMENTS.paymentTerms).should('contain', 'Payment terms').should('contain', 'Pay in full');
      cy.get(DOM_ELEMENTS.payByDate).should('contain', 'Pay by date').should('contain', '01 January 2022');
      cy.get(DOM_ELEMENTS.enforcementActions).should('contain', 'Enforcement action').should('contain', 'No');

      cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', 'test comments');
      cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', 'test notes');

      cy.get(DOM_ELEMENTS.changeLink).should('exist');
    },
  );

  it(
    '(AC.7) should show dashed line if Data is empty for non required details for all defendant types',
    { tags: ['@PO-610', '@PO-584'] },
    () => {
      setupComponent(finesAccountPayload, finesAccountPayload);
      const defendantTypes = ['adultOrYouthOnly', 'pgToPay', 'company'];
      finesMacState.contactDetails.formData = {
        fm_contact_details_email_address_1: '',
        fm_contact_details_email_address_2: '',
        fm_contact_details_telephone_number_business: '',
        fm_contact_details_telephone_number_home: '',
        fm_contact_details_telephone_number_mobile: '',
      };
      finesMacState.accountCommentsNotes.formData = {
        fm_account_comments_notes_comments: '',
        fm_account_comments_notes_notes: '',
        fm_account_comments_notes_system_notes: '',
      };
      cy.wrap(defendantTypes).each((type: string) => {
        cy.then(() => {
          finesMacState.accountDetails.formData.fm_create_account_defendant_type = type;
          cy.get(DOM_ELEMENTS.primaryEmailAddress).should('contain', 'Primary email address').should('contain', '—');
          cy.get(DOM_ELEMENTS.secondaryEmailAddress)
            .should('contain', 'Secondary email address')
            .should('contain', '—');
          cy.get(DOM_ELEMENTS.mobileTelephoneNumber)
            .should('contain', 'Mobile telephone number')
            .should('contain', '—');
          cy.get(DOM_ELEMENTS.homeTelephoneNumber).should('contain', 'Home telephone number').should('contain', '—');
          cy.get(DOM_ELEMENTS.workTelephoneNumber).should('contain', 'Work telephone number').should('contain', '—');

          cy.get(DOM_ELEMENTS.comments).should('contain', 'Comment').should('contain', '—');
          cy.get(DOM_ELEMENTS.accountNotes).should('contain', 'Account note').should('contain', '—');
        });
      });
    },
  );
  it('AC.2 The Review Account screen will be created as per the design artefact', { tags: ['@PO-594'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, false, true);

    cy.get(DOM_ELEMENTS.reviewComponent).should('exist');

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Mr John DOE');
    cy.get(DOM_ELEMENTS.accountStatus).should('exist').and('contain', 'In review');
  });

  it('AC.8, Decision table will be shown as per the design artefact', { tags: ['@PO-594'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, false, true);
    cy.get(DOM_ELEMENTS.approveRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist').click();
    cy.get(DOM_ELEMENTS.rejectionText).should('exist');
    cy.get(DOM_ELEMENTS.continue).should('exist');
    cy.get(DOM_ELEMENTS.deleteLink).should('exist');
  });
  it('AC.8a user does not select any radio button and selects the Continue button', { tags: ['@PO-594'] }, () => {
    setupComponent(finesAccountPayload, finesAccountPayload, false, true);
    cy.get(DOM_ELEMENTS.continue).should('exist').click();
    cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
    cy.get('p').should('contain', 'Select whether approved or rejected');
  });
  it(
    'AC.8b,AC.8c,AC.8ci user does not select any radio button and selects the Continue button',
    { tags: ['@PO-594'] },
    () => {
      setupComponent(finesAccountPayload, finesAccountPayload, false, true);
      cy.get(DOM_ELEMENTS.rejectRadioButton).should('exist').click();
      cy.get(DOM_ELEMENTS.continue).should('exist').click();
      cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
      cy.get('p').should('contain', 'Enter reason for rejection');

      //when user enters non acceptable characters into rejection text box
      cy.get(DOM_ELEMENTS.textArea).should('exist').type('*');
      cy.get(DOM_ELEMENTS.continue).should('exist').click();
      cy.get(DOM_ELEMENTS.heading).contains('Mr John DOE').should('exist');
      cy.get('p').should(
        'contain',
        'Reason for rejection must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
    },
  );
  it(
    'COLLO should not be sent in draft account payload when payment terms are not applicable',
    { tags: ['PO-2093'] },
    () => {
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      Object.assign(finesMacState.paymentTerms.formData, {
        fm_payment_terms_collection_order_made: false,

        fm_payment_terms_collection_order_date: '',
        fm_payment_terms_collection_order_made_today: false,
      });

      setupComponent(finesDraftState, null, false, false);

      cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

      cy.wait('@postDraftAccount')
        .its('request.body')
        .then((body) => {
          expect(body.account.payment_terms).to.have.property('enforcements', null);
        });
    },
  );
  it(
    'COLLO should be sent in draft account payload when collection order is made previously',
    { tags: ['PO-2093'] },
    () => {
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      Object.assign(finesMacState.paymentTerms.formData, {
        fm_payment_terms_collection_order_made: true,

        fm_payment_terms_collection_order_date: '01/01/2027',
        fm_payment_terms_collection_order_made_today: false,
      });

      setupComponent(finesDraftState, null, false, false);

      cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

      cy.wait('@postDraftAccount')
        .its('request.body')
        .then((body) => {
          expect(body.account.payment_terms)
            .to.have.property('enforcements')
            .and.to.be.an('array')
            .that.has.lengthOf(1)
            .which.has.deep.members([
              {
                result_id: 'COLLO',
                enforcement_result_responses: null,
              },
            ]);
        });
    },
  );
  it('COLLO should be sent in draft account payload when collection order is made today', { tags: ['PO-2093'] }, () => {
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

    Object.assign(finesMacState.paymentTerms.formData, {
      fm_payment_terms_collection_order_made: false,

      fm_payment_terms_collection_order_date: '',
      fm_payment_terms_collection_order_made_today: true,
    });

    setupComponent(finesDraftState, null, false, false);

    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@postDraftAccount')
      .its('request.body')
      .then((body) => {
        expect(body.account.payment_terms)
          .to.have.property('enforcements')
          .and.to.be.an('array')
          .that.has.lengthOf(1)
          .which.has.deep.members([
            {
              result_id: 'COLLO',
              enforcement_result_responses: null,
            },
          ]);
      });
  });
  it('enforcements should be correct when COLLO and NOENF are selected', { tags: ['PO-2093'] }, () => {
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

    Object.assign(finesMacState.paymentTerms.formData, {
      fm_payment_terms_collection_order_made: true,

      fm_payment_terms_collection_order_date: '01/01/2027',
      fm_payment_terms_collection_order_made_today: false,

      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_hold_enforcement_on_account: true,
      fm_payment_terms_reason_account_is_on_noenf: 'test3',
    });

    setupComponent(finesDraftState, null, false, false);

    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@postDraftAccount')
      .its('request.body')
      .then((body) => {
        expect(body.account.payment_terms)
          .to.have.property('enforcements')
          .and.to.be.an('array')
          .that.has.lengthOf(2)
          .which.has.deep.members([
            {
              result_id: 'COLLO',
              enforcement_result_responses: null,
            },
            {
              result_id: 'NOENF',
              enforcement_result_responses: [
                {
                  parameter_name: 'reason',
                  response: 'test3',
                },
              ],
            },
          ]);
      });
  });
  it('enforcements should be correct when COLLO and PRIS are selected', { tags: ['PO-2093'] }, () => {
    finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

    Object.assign(finesMacState.paymentTerms.formData, {
      fm_payment_terms_collection_order_made: true,

      fm_payment_terms_collection_order_date: '01/01/2027',
      fm_payment_terms_collection_order_made_today: false,

      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_earliest_release_date: 'test1',
      fm_payment_terms_prison_and_prison_number: 'test2',
      fm_payment_terms_enforcement_action: 'PRIS',
    });

    setupComponent(finesDraftState, null, false, false);

    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@postDraftAccount')
      .its('request.body')
      .then((body) => {
        expect(body.account.payment_terms)
          .to.have.property('enforcements')
          .and.to.be.an('array')
          .that.has.lengthOf(2)
          .which.has.deep.members([
            {
              result_id: 'COLLO',
              enforcement_result_responses: null,
            },
            {
              result_id: 'PRIS',
              enforcement_result_responses: [
                {
                  parameter_name: 'earliestreleasedate',
                  response: 'test1',
                },
                {
                  parameter_name: 'prisonandprisonnumber',
                  response: 'test2',
                },
              ],
            },
          ]);
      });
  });

  it('imposing_court_id is sent as null for every offence (API contract)', { tags: ['@PO-2240'] }, () => {
    setupComponent(finesDraftState, null, false, false);

    cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

    cy.wait('@postDraftAccount')
      .its('request.body')
      .then((body) => {
        expect(body).to.have.property('account');
        expect(body.account).to.have.property('offences');

        const offences = body.account.offences as Array<{ imposing_court_id: null }>;

        offences.forEach((offence, idx: number) => {
          expect(offence, `offence[${idx}]`).to.have.property('imposing_court_id', null);
        });
      });
  });

  it(
    'minor creditor bank account number is correct and is against the correct imposition',
    { tags: ['PO-1988', 'PO-2092'] },
    () => {
      //PO-1988 Verify bank account type is sent as '1' for minor creditor when bank account details are provided
      //PO-2092 Verify minor creditor details are sent against the correct imposition
      finesMacState.accountDetails.formData.fm_create_account_defendant_type = 'pgToPay';

      finesMacState.offenceDetails[0].formData.fm_offence_details_impositions[1] = {
        fm_offence_details_imposition_id: 1,
        fm_offence_details_result_id: 'FCOST',
        fm_offence_details_amount_imposed: 200,
        fm_offence_details_amount_paid: 50,
        fm_offence_details_balance_remaining: 150,
        fm_offence_details_needs_creditor: true,
        fm_offence_details_creditor: 'minor',
        fm_offence_details_major_creditor_id: null,
      };
      finesMacState.offenceDetails[0].childFormData ??= [];
      finesMacState.offenceDetails[0].childFormData[0] = {
        formData: {
          fm_offence_details_imposition_position: 1,
          fm_offence_details_minor_creditor_creditor_type: 'individual',
          fm_offence_details_minor_creditor_title: 'Mr',
          fm_offence_details_minor_creditor_forenames: 'james',
          fm_offence_details_minor_creditor_surname: 'BOND',
          fm_offence_details_minor_creditor_company_name: null,
          fm_offence_details_minor_creditor_address_line_1: 'Addr1',
          fm_offence_details_minor_creditor_address_line_2: 'Addr2',
          fm_offence_details_minor_creditor_address_line_3: 'Addr3',
          fm_offence_details_minor_creditor_post_code: 'TE12 3ST',
          fm_offence_details_minor_creditor_pay_by_bacs: true,
          fm_offence_details_minor_creditor_bank_account_name: 'testAccountName',
          fm_offence_details_minor_creditor_bank_sort_code: '123456',
          fm_offence_details_minor_creditor_bank_account_number: '12345678',
          fm_offence_details_minor_creditor_bank_account_ref: 'accountRef',
        },
        nestedFlow: false,
      };

      setupComponent(finesDraftState, null, false, false);
      cy.get(DOM_ELEMENTS.submitButton).should('exist').click();

      cy.wait('@postDraftAccount')
        .its('request.body')
        .then((body) => {
          expect(body.account.offences[0].impositions).to.be.an('array').that.has.lengthOf(2);
          expect(body.account.offences[0].impositions[1]).to.have.property('minor_creditor');
          expect(body.account.offences[0].impositions[1].minor_creditor).to.have.property('bank_account_type', '1');
        });
    },
  );

  // ─────────────────────────── PO-1582: System note eligibility ───────────────────────────

  it('S1: Original submitter (no amendment) → Note 1 retained', { tags: ['PO-1582'] }, () => {
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

  it('S2: Original submitter amends → criteria no longer met → SYS note absent', { tags: ['PO-1582'] }, () => {
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

  it('S3: Original submitter amends (Note 2 → Note 1) → eligibility switched to Note 1', { tags: ['PO-1582'] }, () => {
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

  it('S4: Different submitter, no amendment → Note 1 retained', { tags: ['PO-1582'] }, () => {
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

  it('S5: Different submitter amends → criteria no longer met → SYS note absent', { tags: ['PO-1582'] }, () => {
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

  it(
    'S6: Different submitter amends (Note 1 → Note 2) → eligibility switched to Note 2 (author updated)',
    { tags: ['PO-1582'] },
    () => {
      setPaymentTermsForNote1(finesMacState, '09/10/2025'); // start as previous date

      setupComponent(finesDraftState, null, true, false);
      cy.wait('@getOffenceByCjsCode');
      setLoggedInUser('Second Submitter'); // now change user
      setPaymentTermsForNote2(finesMacState); // and switch to "today"

      cy.get(DOM_ELEMENTS.submitButton).scrollIntoView().should('be.enabled').and('be.visible').click();

      cy.wait('@replaceDraftAccount')
        .its('request.body')
        .then((body) => {
          // Assert eligibility…
          assertRequestNote2(body, /* authorFullName: */ 'Second Submitter');
        });
    },
  );
});
