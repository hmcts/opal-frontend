import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftViewAllRejectedComponent } from './fines-draft-view-all-rejected.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { FINES_DRAFT_ROUTING_PATHS } from '../routing/constants/fines-draft-routing-paths.constant';

describe('FinesDraftViewAllRejectedComponent', () => {
  let component: FinesDraftViewAllRejectedComponent;
  let fixture: ComponentFixture<FinesDraftViewAllRejectedComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesDraftFragment']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FinesDraftViewAllRejectedComponent, GovukBackLinkComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
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

    mockFinesService.finesDraftFragment.and.returnValue('rejected');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back on navigateBack', () => {
    component.navigateBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith([FINES_DRAFT_ROUTING_PATHS.children.createAndManage], {
      relativeTo: component['activatedRoute'].parent,
      fragment: 'rejected',
    });
  });
});
