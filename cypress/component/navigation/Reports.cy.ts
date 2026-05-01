import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { mount } from 'cypress/angular';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { BehaviorSubject } from 'rxjs';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
import { FinesReportsSummaryListComponent } from 'src/app/flows/fines/fines-reports/fines-reports-summary-list/fines-reports-summary-list.component';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from 'src/app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from 'src/app/flows/fines/fines-reports/routing/constants/fines-reports-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from 'src/app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from 'src/app/flows/fines/routing/constants/fines-routing-paths.constant';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { ReportsLocators as L } from '../../shared/selectors/reports.locators';

const REPORTS_JIRA_LABEL = '@JIRA-LABEL:primary-nav-and-dashboards';
const REPORTS_STORY_TAG = '@JIRA-STORY:PO-2613';
const REPORTS_EPIC_TAG = '@JIRA-EPIC:PO-2627';

interface IComponentProperties {
  permissionIds: number[];
  dashboardType: string;
}

interface ISummaryListComponentProperties {
  reportId: string;
}

type MockActivatedRoute = {
  snapshot: {
    paramMap: ReturnType<typeof convertToParamMap>;
  };
  paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  parent: {
    snapshot: {
      paramMap: ReturnType<typeof convertToParamMap>;
    };
    paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  } | null;
};

const operationalReportPermissions = [
  FINES_PERMISSIONS['operational-report-by-enforcement'],
  FINES_PERMISSIONS['operational-report-by-payments'],
];

const componentProperties: IComponentProperties = {
  permissionIds: operationalReportPermissions,
  dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.reports,
};

const summaryListComponentProperties: ISummaryListComponentProperties = {
  reportId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
};

const reportsSummaryListPath = (reportId: string) =>
  `/${FINES_ROUTING_PATHS.root}/${FINES_REPORTS_ROUTING_PATHS.root}/${reportId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`;

describe('Reports dashboard navigation', { tags: [REPORTS_STORY_TAG, REPORTS_EPIC_TAG, REPORTS_JIRA_LABEL] }, () => {
  const setupDashboardComponent = (props: IComponentProperties = componentProperties) => {
    const dashboardTypeParamMapSubject = new BehaviorSubject(convertToParamMap({ dashboardType: props.dashboardType }));

    return mount(DashboardComponent, {
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: dashboardTypeParamMapSubject.asObservable(),
          },
        },
        {
          provide: PermissionsService,
          useValue: {
            getUniquePermissions: cy.stub().returns(props.permissionIds),
          },
        },
        { provide: GlobalStore, useValue: { userState: () => null } },
      ],
    }).then(({ fixture }) => {
      const router = fixture.componentRef.injector.get(Router);

      cy.stub(router, 'navigateByUrl')
        .callsFake(() => Promise.resolve(true))
        .as('routerNavigateByUrl');
      cy.wrap(router).as('router');

      fixture.detectChanges();
    });
  };

  const setupSummaryListComponent = (props: ISummaryListComponentProperties = summaryListComponentProperties) => {
    const activatedRoute: MockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({}),
      },
      paramMap: new BehaviorSubject(convertToParamMap({})),
      parent: {
        snapshot: {
          paramMap: convertToParamMap({ reportId: props.reportId }),
        },
        paramMap: new BehaviorSubject(convertToParamMap({ reportId: props.reportId })),
      },
    };

    return mount(FinesReportsSummaryListComponent, {
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
      ],
    });
  };

  const commonSetup = () => setupDashboardComponent();

  const setupDashboardWithPermissions = (permissionIds: number[]) =>
    setupDashboardComponent({
      ...componentProperties,
      permissionIds,
    });

  const noOperationalPermissionsSetup = () => setupDashboardWithPermissions([]);

  const enforcementPermissionSetup = () =>
    setupDashboardWithPermissions([FINES_PERMISSIONS['operational-report-by-enforcement']]);

  const paymentsPermissionSetup = () =>
    setupDashboardWithPermissions([FINES_PERMISSIONS['operational-report-by-payments']]);

  const setupSummaryListForReport = (reportId: string) =>
    setupSummaryListComponent({
      ...summaryListComponentProperties,
      reportId,
    });

  const yourReportsSummaryListSetup = () =>
    setupSummaryListForReport(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

  const operationalReportsByEnforcementSummaryListSetup = () =>
    setupSummaryListForReport(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

  const operationalReportsByPaymentsSummaryListSetup = () =>
    setupSummaryListForReport(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

  const assertNavigationTarget = (expectedPath: string) => {
    cy.get('@routerNavigateByUrl').should('have.been.called');
    cy.get('@routerNavigateByUrl')
      .its('lastCall.args.0')
      .then((urlTree) => {
        cy.get('@router').then((router) => {
          const serialisedUrl =
            typeof urlTree === 'string' ? urlTree : (router as unknown as Router).serializeUrl(urlTree);

          expect(serialisedUrl).to.eq(expectedPath);
        });
      });
  };

  it(
    'AC1a AC1b AC1d AC2a AC2b AC2c AC2d shows the Your reports panel and Operational reports links in the correct order',
    { tags: [] },
    () => {
      commonSetup();

      cy.contains(L.pageHeader, 'Reports').should('be.visible');
      cy.get(L.yourReportsLink).should('be.visible').and('contain.text', 'View all your reports');
      cy.contains(L.sectionHeading, 'Operational reports').should('be.visible');
      cy.get(L.operationalReportsByEnforcementLink)
        .should('be.visible')
        .and('contain.text', 'Operational reports (by enforcement)');
      cy.get(L.operationalReportsByPaymentsLink)
        .should('be.visible')
        .and('contain.text', 'Operational reports (by payments)');
      cy.get(`${L.operationalReportsByEnforcementLink}, ${L.operationalReportsByPaymentsLink}`).then(($links) => {
        const linkTexts = [...$links].map((link) => link.textContent?.trim());

        expect(linkTexts).to.deep.equal(['Operational reports (by enforcement)', 'Operational reports (by payments)']);
      });
    },
  );

  it('AC1c routes View all your reports to the Your reports summary list screen', { tags: [] }, () => {
    commonSetup();

    cy.get(L.yourReportsLink).click();

    assertNavigationTarget(reportsSummaryListPath(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports));
  });

  it('AC3a routes Operational reports by enforcement to the correct summary list screen', { tags: [] }, () => {
    commonSetup();

    cy.get(L.operationalReportsByEnforcementLink).click();

    assertNavigationTarget(
      reportsSummaryListPath(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement),
    );
  });

  it('AC3b routes Operational reports by payments to the correct summary list screen', { tags: [] }, () => {
    commonSetup();

    cy.get(L.operationalReportsByPaymentsLink).click();

    assertNavigationTarget(
      reportsSummaryListPath(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments),
    );
  });

  it('AC1c renders the Your reports summary list heading', { tags: [] }, () => {
    yourReportsSummaryListSetup();

    cy.contains(L.pageHeader, 'Your reports').should('be.visible');
  });

  it('AC3a renders the Operational reports by enforcement summary list heading', { tags: [] }, () => {
    operationalReportsByEnforcementSummaryListSetup();

    cy.contains(L.pageHeader, 'Operational reports (by enforcement)').should('be.visible');
  });

  it('AC3b renders the Operational reports by payments summary list heading', { tags: [] }, () => {
    operationalReportsByPaymentsSummaryListSetup();

    cy.contains(L.pageHeader, 'Operational reports (by payments)').should('be.visible');
  });

  it(
    'AC4d hides the Operational reports group when the user has no operational report permissions',
    { tags: [] },
    () => {
      noOperationalPermissionsSetup();

      cy.contains(L.pageHeader, 'Reports').should('be.visible');
      cy.get(L.yourReportsLink).should('be.visible');
      cy.contains(L.sectionHeading, 'Operational reports').should('not.exist');
      cy.get(L.operationalReportsByEnforcementLink).should('not.exist');
      cy.get(L.operationalReportsByPaymentsLink).should('not.exist');
    },
  );

  it(
    'AC4a AC4c shows only the enforcement link and keeps the Operational reports heading visible',
    { tags: [] },
    () => {
      enforcementPermissionSetup();

      cy.contains(L.sectionHeading, 'Operational reports').should('be.visible');
      cy.get(L.operationalReportsByEnforcementLink)
        .should('be.visible')
        .and('contain.text', 'Operational reports (by enforcement)');
      cy.get(L.operationalReportsByPaymentsLink).should('not.exist');
    },
  );

  it('AC4b AC4c shows only the payments link and keeps the Operational reports heading visible', { tags: [] }, () => {
    paymentsPermissionSetup();

    cy.contains(L.sectionHeading, 'Operational reports').should('be.visible');
    cy.get(L.operationalReportsByPaymentsLink)
      .should('be.visible')
      .and('contain.text', 'Operational reports (by payments)');
    cy.get(L.operationalReportsByEnforcementLink).should('not.exist');
  });
});
