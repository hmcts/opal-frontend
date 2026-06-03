import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from './routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

@Component({
  selector: 'app-fines-reports-summary-list',
  imports: [GovukButtonDirective],
  templateUrl: './fines-reports-summary-list.component.html',
  styleUrl: './fines-reports-summary-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSummaryListComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routeWithReportId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportId = toSignal(
    this.routeWithReportId.paramMap.pipe(map((paramMap) => paramMap.get('reportId') ?? '')),
    {
      initialValue: this.routeWithReportId.snapshot.paramMap.get('reportId') ?? '',
    },
  );

  public get pageHeading(): string {
    return (
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportId())?.heading ?? ''
    );
  }

  public get canCreateReport(): boolean {
    return [
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    ].includes(this.reportId());
  }

  public handleCreateReport(): void {
    this.router.navigate(['..', FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits], {
      relativeTo: this.activatedRoute,
    });
  }
}
