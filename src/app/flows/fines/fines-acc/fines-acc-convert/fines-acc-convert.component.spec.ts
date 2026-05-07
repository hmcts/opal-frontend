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
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES } from '../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-modes.constant';
import { IOpalFinesAccountDefendantDetailsHeader } from '../fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT } from '../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-text.constant';
import { HIDE_PRIMARY_NAV_ROUTE_DATA_KEY } from '@app/constants/route-data.constant';

describe('FinesAccConvertComponent', () => {
  let fixture: ComponentFixture<FinesAccConvertComponent>;
  let component: FinesAccConvertComponent;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockActivatedRoute: ActivatedRoute;
  let mockPayloadService: {
    transformPayload: ReturnType<typeof vi.fn>;
    transformDefendantAccountHeaderForStore: ReturnType<typeof vi.fn>;
  };
  let mockAccountStore: {
    setAccountState: ReturnType<typeof vi.fn>;
    account_number: ReturnType<typeof vi.fn>;
    party_name: ReturnType<typeof vi.fn>;
  };

  const defaultHeadingData: IOpalFinesAccountDefendantDetailsHeader = {
    ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
    debtor_type: 'Defendant',
    party_details: {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details),
      organisation_flag: false,
      individual_details: {
        title: 'Mr',
        forenames: 'Terrence',
        surname: 'CONWAY-JOHNSON',
        date_of_birth: FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details.individual_details?.date_of_birth ?? null,
        age: FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details.individual_details?.age ?? null,
        national_insurance_number:
          FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details.individual_details?.national_insurance_number ?? null,
        individual_aliases:
          FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details.individual_details?.individual_aliases ?? null,
      },
    },
  };

  const companyHeadingData: IOpalFinesAccountDefendantDetailsHeader = {
    ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK),
    debtor_type: 'Defendant',
    party_details: {
      ...structuredClone(FINES_ACC_DEFENDANT_DETAILS_HEADER_MOCK.party_details),
      organisation_flag: true,
      organisation_details: {
        organisation_name: 'Accdetail comp limited',
        organisation_aliases: [],
      },
      individual_details: null,
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

  const configureRouteWithoutPartyType = (headingData = defaultHeadingData) => {
    mockActivatedRoute.snapshot = {
      data: { defendantAccountHeadingData: headingData },
      paramMap: convertToParamMap({ accountId: '123' }),
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

    mockActivatedRoute = { snapshot: {} as never } as unknown as ActivatedRoute;

    mockPayloadService = {
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
      transformDefendantAccountHeaderForStore: vi
        .fn()
        .mockName('FinesAccPayloadService.transformDefendantAccountHeaderForStore'),
    };
    mockPayloadService.transformPayload.mockImplementation((payload) => payload);
    mockPayloadService.transformDefendantAccountHeaderForStore.mockReturnValue(MOCK_FINES_ACCOUNT_STATE);

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
    const defendantJourneyGroup = defendantRoute?.children?.find(
      (child) => child.path === '' && child.data?.[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY] === true,
    );
    const convertRoute = defendantJourneyGroup?.children?.find(
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

  it('should configure the party route to use partyType and mode route params', () => {
    const defendantRoute = routing.find(
      (route) => route.path === `${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/:accountId`,
    );
    const defendantJourneyGroup = defendantRoute?.children?.find(
      (child) => child.path === '' && child.data?.[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY] === true,
    );
    const partyRoute = defendantJourneyGroup?.children?.find(
      (child) => child.path === `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/:partyType/:mode`,
    );

    expect(partyRoute?.path).toBe(`${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/:partyType/:mode`);
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
    expect(mockPayloadService.transformDefendantAccountHeaderForStore).toHaveBeenCalledWith(123, defaultHeadingData);
    expect(mockAccountStore.setAccountState).toHaveBeenCalledWith(MOCK_FINES_ACCOUNT_STATE);
  });

  it('should render the caption, heading, warning text, and action buttons for company conversion', () => {
    createComponent();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('06000427N - Mr Terrence CONWAY-JOHNSON');
    expect(compiled.textContent).toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY].confirmationHeading,
    );
    expect(compiled.textContent).toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY].warningText,
    );
    expect(compiled.textContent).toContain('Yes - continue');
    expect(compiled.textContent).toContain('No - cancel');
  });

  it('should render the caption, heading, warning text, and action buttons for individual conversion', () => {
    mockAccountStore.party_name.mockReturnValue('Accdetail comp limited');
    configureRoute(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL, companyHeadingData);

    createComponent();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('06000427N - Accdetail comp limited');
    expect(compiled.textContent).toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL]
        .confirmationHeading,
    );
    expect(compiled.textContent).toContain(
      FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL].warningText,
    );
    expect(compiled.textContent).toContain('Yes - continue');
    expect(compiled.textContent).toContain('No - cancel');
  });

  it('should default the route party type to an empty string when the param is missing', () => {
    configureRouteWithoutPartyType();

    createComponent();

    expect(component.routePartyType).toBe('');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'defendant',
    });
  });

  it('should build the caption using blank fallbacks when account details are missing from the store', () => {
    mockAccountStore.account_number.mockReturnValue(null);
    mockAccountStore.party_name.mockReturnValue(null);

    createComponent();

    expect(component.captionText).toBe(' - ');
  });

  it('should navigate to the company details page when continue is clicked', () => {
    createComponent();

    component.handleContinue();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [
        '../../',
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT,
      ],
      {
        relativeTo: mockActivatedRoute,
      },
    );
  });

  it('should navigate to the defendant details page when continuing individual conversion', () => {
    configureRoute(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL, companyHeadingData);

    createComponent();

    component.handleContinue();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [
        '../../',
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL,
        FINES_ACC_PARTY_ADD_AMEND_CONVERT_MODES.CONVERT,
      ],
      {
        relativeTo: mockActivatedRoute,
      },
    );
  });

  it('should navigate back to account summary when continue is clicked for an invalid conversion target', () => {
    configureRoute('unsupported-target');

    createComponent();
    mockRouter.navigate.mockClear();

    component.handleContinue();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'defendant',
    });
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
    configureRoute('unsupported-target');

    createComponent();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../../', FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details], {
      relativeTo: mockActivatedRoute,
      fragment: 'defendant',
    });
  });

  it('should redirect back to defendant details when an individual account tries to convert to individual', () => {
    configureRoute(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL, defaultHeadingData);

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
