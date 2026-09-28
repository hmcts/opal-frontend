import type { Interception } from 'cypress/types/net-stubbing';
import { findBusinessUnitUser, requestLoggedInUserState } from '../actions/user-state.actions';

/** Validates the draft-account requests sent by UI journeys against the API contracts. */
export class DraftAccountRequestContractFlow {
  /** Captures UI creation requests without stubbing their responses. */
  monitorCreation(): void {
    cy.intercept('POST', '**/opal-fines-service/draft-accounts').as('draftContractPost');
  }

  /** Captures the loaded draft and subsequent UI status changes. */
  monitorStatusChanges(): void {
    cy.intercept('GET', /\/opal-fines-service\/draft-accounts\/\d+(?:\?.*)?$/).as('draftContractGet');
    cy.intercept('PATCH', '**/opal-fines-service/draft-accounts/*').as('draftContractPatch');
  }

  /**
   * Checks the exact POST contract and its persisted account values.
   * @param defendantType - Expected defendant type selected in the UI.
   * @param accountType - Expected account type selected in the UI.
   */
  assertCreation(defendantType: string, accountType: string): void {
    cy.wait('@draftContractPost').then(({ request, response }) => {
      expect(request.body).to.have.all.keys(
        'business_unit_id',
        'account',
        'account_type',
        'account_status',
        'status_message',
      );
      expect(request.body.account_type).to.equal(accountType);
      expect(request.body.account_status).to.equal('Submitted');
      expect(request.body.status_message).to.equal(null);
      expect(request.body.account.defendant_type).to.equal(defendantType);
      expect(request.body.account.account_type).to.equal(accountType);
      expect(request.body.business_unit_id).to.be.a('number').and.greaterThan(0);
      expect(response?.statusCode, 'draft creation succeeded').to.be.within(200, 299);
      expect(response?.body.draft_account_id, 'created draft ID').to.exist;
      cy.request({ method: 'GET', url: `${request.url}/${response?.body.draft_account_id}`, log: false }).then(
        ({ body, status }) => {
          expect(status).to.equal(200);
          expect(body.business_unit_id).to.equal(request.body.business_unit_id);
          expect(body.account_type).to.equal(accountType);
          expect(body.account_status).to.equal('Submitted');
          expect(body.account).to.deep.equal(request.body.account);
        },
      );
    });
  }

  /**
   * Checks the exact PATCH contract, loaded version and persisted status change.
   * @param status - Expected requested account status.
   * @param reason - Expected reason; an empty string represents null for approval.
   */
  assertStatusChange(status: string, reason: string): void {
    cy.wait('@draftContractPatch').then(({ request, response }) => {
      expect(request.body).to.have.all.keys('business_unit_id', 'account_status', 'reason_text');
      expect(request.body.account_status).to.equal(status);
      expect(request.body.reason_text).to.equal(reason || null);
      expect(response?.statusCode, 'draft status change succeeded').to.be.within(200, 299);

      cy.get<Interception[]>('@draftContractGet.all').then((reads) => {
        const loaded = reads.find((read) => new URL(read.request.url).pathname === new URL(request.url).pathname);
        expect(loaded?.response, 'draft loaded before the status change').to.exist;
        const etag = loaded?.response?.headers['etag'];
        expect(etag, 'loaded draft ETag').to.be.a('string').and.not.be.empty;
        expect(request.headers['if-match'], 'version is passed in If-Match').to.equal(etag);
        expect(request.body.business_unit_id).to.equal(loaded?.response?.body.business_unit_id);
        expect(loaded?.response?.body, 'loaded response contains metadata excluded from PATCH').to.have.property(
          'draft_account_id',
        );
      });

      cy.request({ method: 'GET', url: request.url, log: false }).then(({ body, status: responseStatus }) => {
        expect(responseStatus).to.equal(200);
        if (status === 'Publishing Pending') {
          expect(body.account_status).to.be.oneOf(['Publishing Pending', 'Published']);
          requestLoggedInUserState().then((userState) => {
            const checker = findBusinessUnitUser(userState, request.body.business_unit_id);
            expect(checker, 'authenticated checker belongs to the business unit').to.exist;
            expect(Boolean(checker?.['business_unit_user_id']), 'checker identity is available').to.equal(true);
            expect(
              body.validated_by === checker?.['business_unit_user_id'],
              'backend records the authenticated checker',
            ).to.equal(true);
            expect(body.validated_by !== body.submitted_by, 'checker differs from the creator').to.equal(true);
          });
        } else {
          expect(body.account_status).to.equal(status);
        }
      });
    });
  }
}
