import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ManualAccountCreationRoutes } from '@enums';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';
import { FormParentBaseComponent } from '@components';
import { MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '@constants';
import { IManualAccountCreationPersonalDetailsForm } from '@interfaces';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [PersonalDetailsFormComponent],
  templateUrl: './personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDetailsComponent extends FormParentBaseComponent {
  public defendantType = this.macStateService.manualAccountCreation.accountDetails.DefendantType!;

  /**
   * Handles the submission of personal details form in the manual account creation process.
   * Updates the `manualAccountCreation` state with the form data and navigates to the appropriate route.
   *
   * @param personalDetailsForm - The form data for the personal details.
   */
  public handlePersonalDetailsSubmit(personalDetailsForm: IManualAccountCreationPersonalDetailsForm): void {
    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      personalDetails: personalDetailsForm.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (personalDetailsForm.nestedFlow && this.defendantType) {
      const nextRoute = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[this.defendantType]['personalDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(ManualAccountCreationRoutes.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.macStateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
