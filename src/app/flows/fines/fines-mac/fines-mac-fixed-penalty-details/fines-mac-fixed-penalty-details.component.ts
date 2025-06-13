import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesMacFixedPenaltyDetailsForm } from './interfaces/fines-mac-fixed-penalty-details-form.interface';
import { FinesMacFixedPenaltyDetailsFormComponent } from './fines-mac-fixed-penalty-details-form/fines-mac-fixed-penalty-details-form.component';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-fixed-penalty-details',
  imports: [FinesMacFixedPenaltyDetailsFormComponent],
  templateUrl: './fines-mac-fixed-penalty-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacFixedPenaltyDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);
  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Handles the submission of personal details form.
   *
   * @param form - The personal details form data.
   * @returns void
   */
  public handleFixedPenaltyDetailsSubmit(form: IFinesMacFixedPenaltyDetailsForm): void {
    this.finesMacStore.setFixedPenaltyDetails(form);
    this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.reviewAccount);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
