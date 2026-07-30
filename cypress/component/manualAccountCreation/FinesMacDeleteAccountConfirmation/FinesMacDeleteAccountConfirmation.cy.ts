import { mount } from 'cypress/angular';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../../../src/app/flows/fines/fines-mac/mocks/fines-mac-state.mock';
import { FinesMacDeleteAccountConfirmationComponent } from '../../../../src/app/flows/fines/fines-mac/fines-mac-delete-account-confirmation/fines-mac-delete-account-confirmation.component';
import { FinesMacStore } from 'src/app/flows/fines/fines-mac/stores/fines-mac.store';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { FINES_DRAFT_STATE } from 'src/app/flows/fines/fines-draft/constants/fines-draft-state.constant';

const MANUAL_ACCOUNT_CREATION_JIRA_LABEL = '@JIRA-LABEL:manual-account-creation';

const buildTags = (...tags: string[]) => [...tags, '@R1A', MANUAL_ACCOUNT_CREATION_JIRA_LABEL];

describe('FinesMacDeleteAccountConfirmation', () => {
  const createMockFinesService = () => ({
    finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
  });
  const createActivatedRoute = (draftAccountId: string | null) => {
    const parent = {
      snapshot: {
        url: [{ path: 'manual-account-creation' }],
      },
    };

    return {
      parent,
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'draftAccountId' ? draftAccountId : null),
        },
        parent,
      },
    };
  };
  let mockFinesService = createMockFinesService();

  beforeEach(() => {
    mockFinesService = createMockFinesService();
  });

  const setupComponent = (draftAccountId: string | null = '42', deleteFromCheckAccount = false) => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    const finesDraftState = structuredClone(FINES_DRAFT_STATE);

    finesMacState.deleteFromCheckAccount = deleteFromCheckAccount;

    mount(FinesMacDeleteAccountConfirmationComponent, {
      providers: [
        { provide: OpalFines, useValue: mockFinesService },
        {
          provide: Router,
          useValue: {
            navigate: cy.stub().as('routerNavigate'),
            navigateByUrl: cy.stub().as('routerNavigateByUrl'),
          },
        },
        {
          provide: FinesMacStore,
          useFactory: () => {
            const store = new FinesMacStore();
            store.setFinesMacStore(finesMacState);
            return store;
          },
        },
        {
          provide: FinesDraftStore,
          useFactory: () => {
            const store = new FinesDraftStore();
            store.setFinesDraftState(finesDraftState);
            store.setChecker(false);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: createActivatedRoute(draftAccountId),
        },
      ],
      componentProperties: {},
    });
  };

  it(
    '(AC.2)should render the component and have all elements',
    { tags: [...buildTags('@JIRA-STORY:PO-518'), '@JIRA-EPIC:PO-545', '@JIRA-TEST-KEY:PO-4968'] },
    () => {
      setupComponent();

      cy.get('h1').should('contain', 'Are you sure you want to delete this account?');
      cy.get('button[id = "confirmDeletion"]').should('contain', 'Yes - delete');
      cy.get('a').should('contain', 'No - cancel');
    },
  );

  it('returns to account details when an inputter cancels deletion from account details', { tags: [...buildTags('@JIRA-DEFECT:PO-9113', '@JIRA-STORY:PO-9113'), '@JIRA-EPIC:PO-545', '@JIRA-TEST-KEY:PO-9652'] }, () => {
      setupComponent('42');

      cy.contains('a', 'No - cancel').click();

      cy.get('@routerNavigate').should((stub) => {
        expect(stub).to.have.been.calledOnce;
        expect(stub.getCall(0).args[0]).to.deep.equal(['account-details/42']);
      });
    });

  it('returns to check account when an inputter cancels deletion from check account without an account id', { tags: [...buildTags('@JIRA-DEFECT:PO-9113', '@JIRA-STORY:PO-9113'), '@JIRA-EPIC:PO-545', '@JIRA-TEST-KEY:PO-9653'] }, () => {
      setupComponent(null, true);

      cy.contains('a', 'No - cancel').click();

      cy.get('@routerNavigate').should((stub) => {
        expect(stub).to.have.been.calledOnce;
        expect(stub.getCall(0).args[0]).to.deep.equal(['review-account']);
      });
    });
});
