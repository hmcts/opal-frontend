import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccConvertComponent } from './fines-acc-convert.component';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK } from '../fines-acc-defendant-details/mocks/fines-acc-defendant-details-header.mock';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-map-transform-items-config.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_TITLES } from '../routing/constants/fines-acc-defendant-routing-titles.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { routing } from '../routing/fines-acc.routes';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { defendantAccountHeadingResolver } from '../routing/resolvers/defendant-account-heading.resolver';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { finesAccStateGuard } from '../routing/guards/fines-acc-state-guard/fines-acc-state.guard';

describe('FinesAccConvertComponent', () => {
  let fixture: ComponentFixture<FinesAccConvertComponent>;
  let component: FinesAccConvertComponent;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: ActivatedRoute;
  let mockPayloadService: {
    transformPayload: ReturnType<typeof vi.fn>;
    transformAccountHeaderForStore: ReturnType<typeof vi.fn>;
  };
  let mockAccountStore: {
    setAccountState: ReturnType<typeof vi.fn>;
    account_number: ReturnType<typeof vi.fn>;
    party_name: ReturnType<typeof vi.fn>;
  };

  const defaultHeadingData = {
    ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
    debtor_type: 'Defendant',
    party_details: {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details),
      organisation_flag: false,
      individual_details: {
        ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details.individual_details),
        title: 'Mr',
        forenames: 'Terrence',
        surname: 'CONWAY-JOHNSON',
      },
    },
  };

  const configureRoute = (
    partyType = FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY,
    headingData = defaultHeadingData,
  ) => {
    mockActivatedRoute.snapshot = {
      data: { defendantAccountHeadingData: headingData },
      paramMap: convertToParamMap({ accountId: '123', partyType }),
    } as never;
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(FinesAccConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    mockActivatedRoute = { snapshot: {} as never } as ActivatedRoute;

    mockPayloadService = {
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
      transformAccountHeaderForStore: vi.fn().mockName('FinesAccPayloadService.transformAccountHeaderForStore'),
    };
    mockPayloadService.transformPayload.mockImplementation((payload) => payload);
    mockPayloadService.transformAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);

    mockAccountStore = {
      setAccountState: vi.fn().mockName('FinesAccountStore.setAccountState'),
      account_number: vi.fn().mockName('FinesAccountStore.account_number'),
      party_name: vi.fn().mockName('FinesAccountStore.party_name'),
    };
    mockAccountStore.account_number.mockReturnValue('06000427N');
    mockAccountStore.party_name.mockReturnValue('Mr Terrence CONWAY-JOHNSON');

    configureRoute();

    await TestBed.configureTestingModule({
      imports: [FinesAccConvertComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
      ],
    }).compileComponents();
  });

  it('should configure the convert route with title, permission, and heading resolver', () => {
    const defendantRoute = routing.find(
      (route) => route.path === `${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/:accountId`,
    );
    const convertRoute = defendantRoute?.children?.find(
      (child) => child.path === `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.convert}/:partyType`,
    );

    expect(convertRoute?.path).toBe(`${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.convert}/:partyType`);
    expect(convertRoute?.canActivate).toEqual([authGuard, routePermissionsGuard, finesAccStateGuard]);
    expect(convertRoute?.data).toEqual({
      routePermissionId: [FINES_PERMISSIONS['account-maintenance']],
      title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.convert,
    });
    expect(convertRoute?.resolve).toEqual({
      title: TitleResolver,
      defendantAccountHeadingData: defendantAccountHeadingResolver,
    });
  });

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should hydrate account state from defendantAccountHeadingData', () => {
    createComponent();

    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      defaultHeadingData,
      FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG,
    );
    expect(mockPayloadService.transformAccountHeaderForStore).toHaveBeenCalledWith(
      123,
      defaultHeadingData,
      'defendant',
    );
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
  });

  it('should render the caption, heading, warning text, and action buttons for company conversion', () => {
    createComponent();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('06000427N - Mr Terrence CONWAY-JOHNSON');
    expect(compiled.textContent).toContain('Are you sure you want to convert this account to a company account?');
    expect(compiled.textContent).toContain(
      'Certain data related to individual accounts, such as employment details, will be removed.',
    );
    expect(compiled.textContent).toContain('Yes - continue');
    expect(compiled.textContent).toContain('No - cancel');
  });

  it('should navigate to the company details page when continue is clicked', () => {
    createComponent();

    component.handleContinue();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [
        '../../',
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY,
        'amend',
      ],
      {
        relativeTo: mockActivatedRoute,
      },
    );
  });

  it('should navigate back to defendant details when cancel is clicked', () => {
    createComponent();

    component.navigateBackToAccountSummary();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'defendant',
    });
  });

  it('should redirect back to defendant details when partyType is unsupported', () => {
    configureRoute(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL);

    createComponent();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'defendant',
    });
  });

  it('should redirect back to defendant details when the account is already a company account', () => {
    configureRoute(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY, {
      ...defaultHeadingData,
      party_details: {
        ...defaultHeadingData.party_details,
        organisation_flag: true,
      },
    });

    createComponent();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'defendant',
    });
  });
});
