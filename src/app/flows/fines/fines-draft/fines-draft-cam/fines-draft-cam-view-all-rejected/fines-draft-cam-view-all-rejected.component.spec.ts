import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftCamViewAllRejectedComponent } from './fines-draft-cam-view-all-rejected.component';
import { FINES_DRAFT_CAM_ROUTING_PATHS } from '../routing/constants/fines-draft-cam-routing-paths.constant';
import { Router, ActivatedRoute } from '@angular/router';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';

describe('FinesDraftCamViewAllRejectedComponent', () => {
  let component: FinesDraftCamViewAllRejectedComponent;
  let fixture: ComponentFixture<FinesDraftCamViewAllRejectedComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let finesDraftStore: FinesDraftStoreType;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FinesDraftCamViewAllRejectedComponent, GovukBackLinkComponent],
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

    fixture = TestBed.createComponent(FinesDraftCamViewAllRejectedComponent);
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

    expect(mockRouter.navigate).toHaveBeenCalledWith([FINES_DRAFT_CAM_ROUTING_PATHS.children.inputter], {
      relativeTo: component['activatedRoute'].parent,
      fragment: finesDraftStore.fragment(),
    });
  });
});
