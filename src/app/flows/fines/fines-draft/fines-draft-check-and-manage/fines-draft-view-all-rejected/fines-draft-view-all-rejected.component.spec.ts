import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftViewAllRejectedComponent } from './fines-draft-view-all-rejected.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS } from '../routing/constants/fines-draft-check-and-manage-routing-paths.constant';

describe('FinesDraftViewAllRejectedComponent', () => {
  let component: FinesDraftViewAllRejectedComponent;
  let fixture: ComponentFixture<FinesDraftViewAllRejectedComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FinesDraftViewAllRejectedComponent, GovukBackLinkComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { snapshot: { url: ['check-and-manage'] } },
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
});
