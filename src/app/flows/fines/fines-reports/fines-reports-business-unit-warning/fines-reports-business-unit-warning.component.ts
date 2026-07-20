import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';
import { FinesReportsBusinessUnitWarningContentComponent } from './fines-reports-business-unit-warning-content/fines-reports-business-unit-warning-content.component';

@Component({
  selector: 'app-fines-reports-business-unit-warning',
  imports: [FinesReportsBusinessUnitWarningContentComponent],
  templateUrl: './fines-reports-business-unit-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsBusinessUnitWarningComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly finesReportsStore = inject(FinesReportsStore);
  private readonly router = inject(Router);

  public readonly selectedBusinessUnitCount = computed(() => this.finesReportsStore.selectedBusinessUnitIds().length);

  /**
   * Navigates back to the business unit selection screen with the current selections restored.
   */
  public handleGoBack(): void {
    this.router.navigate([`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Logs selected business units while the next create-report screen is out of scope.
   */
  public handleContinue(): void {
    // eslint-disable-next-line no-console
    console.log('PO-2305 selected business unit ids', this.finesReportsStore.selectedBusinessUnitIds());
  }
}
