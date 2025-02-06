import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacPersonalDetailsForm } from './interfaces/fines-mac-personal-details-form.interface';
import { FinesMacPersonalDetailsFormComponent } from './fines-mac-personal-details-form/fines-mac-personal-details-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';

@Component({
  selector: 'app-fines-mac-personal-details',
  imports: [FinesMacPersonalDetailsFormComponent],
  templateUrl: './fines-mac-personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.formData.fm_create_account_defendant_type!;

  /**
   * Handles the submission of personal details form.
   *
   * @param form - The personal details form data.
   * @returns void
   */
  public handlePersonalDetailsSubmit(form: IFinesMacPersonalDetailsForm): void {
    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      personalDetails: form,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_ROUTING_NESTED_ROUTES[this.defendantType]['personalDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesService.finesMacState.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
