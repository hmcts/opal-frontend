import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftViewAllRejectedComponent } from './fines-draft-view-all-rejected.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS } from '../routing/constants/fines-draft-check-and-manage-routing-paths.constant';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';

describe('FinesDraftViewAllRejectedComponent', () => {
  let component: FinesDraftViewAllRejectedComponent;
  let fixture: ComponentFixture<FinesDraftViewAllRejectedComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let finesDraftStore: FinesDraftStoreType;
  let finesDraftService: jasmine.SpyObj<FinesDraftService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    finesDraftService = jasmine.createSpyObj<FinesDraftService>('FinesDraftService', [
      'onDefendantClick',
      'populateTableData',
    ]);
    finesDraftService.populateTableData.and.returnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesDraftViewAllRejectedComponent, GovukBackLinkComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: FinesDraftService, useValue: finesDraftService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: ['check-and-manage'],
              data: {
                allRejectedAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
              },
              fragment: 'rejected',
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftViewAllRejectedComponent);
    component = fixture.componentInstance;

    finesDraftStore = TestBed.inject(FinesDraftStore);
    finesDraftStore.setFragment('rejected');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on navigateBack', () => {
    component.navigateBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith([FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS.children.tabs], {
      relativeTo: component['activatedRoute'].parent,
      fragment: finesDraftStore.fragment(),
    });
  });

  it('should call viewAllAccounts and amend then call onDefendantClick with PATH_REVIEW_ACCOUNT', () => {
    component.onDefendantClick(123);
    expect(finesDraftStore.viewAllAccounts()).toBeTruthy();
    expect(finesDraftStore.amend()).toBeFalsy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(123, component.PATH_REVIEW_ACCOUNT);
  });
});
