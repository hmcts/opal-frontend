import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';

@Component({
  selector: 'app-fines-reports-business-unit-warning-content',
  imports: [GovukButtonDirective, GovukCancelLinkComponent],
  templateUrl: './fines-reports-business-unit-warning-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsBusinessUnitWarningContentComponent {
  public readonly selectedBusinessUnitCount = input.required<number>();
  public readonly continueRequested = output<void>();
  public readonly goBackRequested = output<void>();

  /**
   * Emits the request to continue creating the report.
   */
  public handleContinue(): void {
    this.continueRequested.emit();
  }

  /**
   * Emits the request to return to business unit selection.
   */
  public handleGoBack(): void {
    this.goBackRequested.emit();
  }
}
