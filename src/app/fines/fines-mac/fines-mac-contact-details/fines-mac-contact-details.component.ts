import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormParentBaseComponent } from '@components';
import { IFinesMacContactDetailsForm } from '../interfaces';
import { FINES_MAC_NESTED_ROUTES } from '../constants/fines-mac-nested-routes';
import { FinesMacRoutes } from '../enums';
import { FinesMacContactDetailsFormComponent } from "./fines-mac-contact-details-form/fines-mac-contact-details-form.component";

@Component({
  selector: 'app-fines-mac-contact-details',
  standalone: true,
  imports: [FinesMacContactDetailsFormComponent],
  templateUrl: './fines-mac-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacContactDetailsComponent extends FormParentBaseComponent {
  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Handles the form submission for contact details.
   * @param formData - The form data containing the search parameters.
   */
  public handleContactDetailsSubmit(form: IFinesMacContactDetailsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      contactDetails: form.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_NESTED_ROUTES[this.defendantType]['contactDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(FinesMacRoutes.finesMacAccountDetails);
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
