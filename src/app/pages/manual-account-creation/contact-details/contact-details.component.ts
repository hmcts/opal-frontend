import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormParentBaseComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationContactDetailsState } from '@interfaces';
import { ContactDetailsFormComponent } from './contact-details-form/contact-details-form.component';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [ContactDetailsFormComponent],
  templateUrl: './contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDetailsComponent extends FormParentBaseComponent {
  /**
   * Handles the form submission for contact details.
   * @param formData - The form data containing the search parameters.
   */
  public handleContactDetailsSubmit(formData: IManualAccountCreationContactDetailsState): void {
    this.stateService.manualAccountCreation = {
      accountDetails: this.stateService.manualAccountCreation.accountDetails,
      employerDetails: this.stateService.manualAccountCreation.employerDetails,
      parentGuardianDetails: this.stateService.manualAccountCreation.parentGuardianDetails,
      contactDetails: formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.routerNavigate(ManualAccountCreationRoutes.createAccount);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
