import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import {
  FormParentBaseComponent,
  GovukButtonComponent,
  GovukHeadingWithCaptionComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components';
import { DEFENDANT_TYPES_STATE } from '@constants';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { CanDeactivateType } from '@interfaces';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukTagComponent,
    GovukTaskListComponent,
    GovukTaskListItemComponent,
    GovukButtonComponent,
    GovukHeadingWithCaptionComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
  ],
  templateUrl: './create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent extends FormParentBaseComponent {
  public readonly routingPaths = RoutingPaths;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  public readonly defendantTypes = DEFENDANT_TYPES_STATE;

  public defendantType = '';

  /**
   * Sets the defendant type based on the value stored in the account details.
   * If the defendant type is found in the `defendantTypes` array, it is assigned to `this.defendantType`.
   */
  private setDefendantType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { defendantType } = this.stateService.manualAccountCreation.accountDetails.formData;
    if (defendantType) {
      this.defendantType = this.defendantTypes[defendantType] || '';
    }
  }

  public override ngOnInit(): void {
    this.setDefendantType();
    super.ngOnInit();
    // const { unsavedChanges } = this.stateService.manualAccountCreation;
    // this.unsavedChanges = true;
  }
}
