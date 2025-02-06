import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacSubmitConfirmationComponent } from './fines-mac-submit-confirmation.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_DRAFT_ROUTING_PATHS } from '../../fines-draft/routing/constants/fines-draft-routing-paths.constant';

describe('FinesMacSubmitConfirmationComponent', () => {
  let component: FinesMacSubmitConfirmationComponent;
  let fixture: ComponentFixture<FinesMacSubmitConfirmationComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };

    mockOpalFinesService = {
      postDraftAddAccountPayload: jasmine
        .createSpy('postDraftAddAccountPayload')
        .and.returnValue(of({ ...OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK })),
    };

    mockFinesMacPayloadService = jasmine.createSpyObj(FinesMacPayloadService, ['buildAddAccountPayload']);
    mockFinesMacPayloadService.buildAddAccountPayload.and.returnValue({ ...FINES_MAC_PAYLOAD_ADD_ACCOUNT });

    await TestBed.configureTestingModule({
      imports: [FinesMacSubmitConfirmationComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacSubmitConfirmationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create account on createNewAccount', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.createNewAccount();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.createAccount], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should navigate to create account on seeAllAccounts', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.seeAllAccounts();

    expect(routerSpy).toHaveBeenCalledWith(
      [
        `${FINES_ROUTING_PATHS.root}/${FINES_DRAFT_ROUTING_PATHS.root}/${FINES_DRAFT_ROUTING_PATHS.children.createAndManage}`,
      ],
      {
        fragment: 'review',
      },
    );
  });
});
