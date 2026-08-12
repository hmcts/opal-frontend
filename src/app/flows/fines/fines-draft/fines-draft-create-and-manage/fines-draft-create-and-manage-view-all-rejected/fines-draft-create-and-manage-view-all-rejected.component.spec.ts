import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCreateAndManageViewAllRejectedComponent } from './fines-draft-create-and-manage-view-all-rejected.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../routing/constants/fines-draft-create-and-manage-routing-paths.constant';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../../constants/fines-draft-route-data-keys.constant';
import { FINES_DRAFT_TAB_FRAGMENT } from '../../constants/fines-draft-tab-fragments.constant';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from '../../routing/resolvers/constants/fines-draft-resolver-empty-response.constant';

describe('FinesDraftCreateAndManageViewAllRejectedComponent', () => {
  let component: FinesDraftCreateAndManageViewAllRejectedComponent;
  let fixture: ComponentFixture<FinesDraftCreateAndManageViewAllRejectedComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  let finesDraftStore: FinesDraftStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finesDraftService: any;
  let activatedRouteMock: {
    snapshot: {
      url: string[];
      data: Record<string, unknown>;
      fragment: string;
    };
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    finesDraftService = {
      onDefendantClick: vi.fn().mockName('FinesDraftService.onDefendantClick'),
      populateTableData: vi.fn().mockName('FinesDraftService.populateTableData'),
      PATH_AMEND_ACCOUNT: '/fines/manual-account-creation/account-details',
      PATH_REVIEW_ACCOUNT: '/fines/manual-account-creation/review-account',
    };
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);

    activatedRouteMock = {
      snapshot: {
        url: ['check-and-manage'],
        data: {
          [FINES_DRAFT_ROUTE_DATA_KEYS.allRejectedAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
        },
        fragment: FINES_DRAFT_TAB_FRAGMENT.rejected,
      },
    };

    await TestBed.configureTestingModule({
      imports: [FinesDraftCreateAndManageViewAllRejectedComponent, GovukBackLinkComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: FinesDraftService, useValue: finesDraftService },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageViewAllRejectedComponent);
    component = fixture.componentInstance;

    finesDraftStore = TestBed.inject(FinesDraftStore);
    finesDraftStore.setFragment(FINES_DRAFT_TAB_FRAGMENT.rejected);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate rejected accounts from resolved route data', () => {
    fixture.detectChanges();

    expect(finesDraftService.populateTableData).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
    expect(component.rejectedAccounts).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
  });

  it('should populate rejected accounts from the empty response when resolved route data is unavailable', () => {
    activatedRouteMock.snapshot.data = {};

    fixture.detectChanges();

    expect(finesDraftService.populateTableData).toHaveBeenCalledWith(FINES_DRAFT_RESOLVER_EMPTY_RESPONSE);
    expect(component.rejectedAccounts).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
  });

  it('should navigate back on navigateBack', () => {
    component.navigateBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith([FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.tabs], {
      relativeTo: component['activatedRoute'].parent,
      fragment: finesDraftStore.fragment(),
    });
  });

  it('should route a Fine row to PATH_AMEND_ACCOUNT and keep amend true', () => {
    const fineRow = {
      ...FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0],
      'Account type': 'Fine',
    };

    component.onDefendantClick(fineRow);

    expect(finesDraftStore.viewAllAccounts()).toBeTruthy();
    expect(finesDraftStore.amend()).toBeTruthy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(
      fineRow['Defendant id'],
      finesDraftService.PATH_AMEND_ACCOUNT,
    );
  });

  it('should route a Fixed Penalty row to PATH_REVIEW_ACCOUNT and keep amend true', () => {
    const fixedPenaltyRow = {
      ...FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0],
      'Account type': 'Fixed Penalty',
    };

    component.onDefendantClick(fixedPenaltyRow);

    expect(finesDraftStore.viewAllAccounts()).toBeTruthy();
    expect(finesDraftStore.amend()).toBeTruthy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(
      fixedPenaltyRow['Defendant id'],
      finesDraftService.PATH_REVIEW_ACCOUNT,
    );
  });
});
