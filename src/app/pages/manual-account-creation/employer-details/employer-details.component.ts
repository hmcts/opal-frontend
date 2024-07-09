import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployerDetailsFormComponent } from './employer-details-form/employer-details-form.component';
import { IManualAccountCreationEmployerDetailsForm } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { FormParentBaseComponent } from '@components';
import { MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '@constants';

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, EmployerDetailsFormComponent],
  templateUrl: './employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsComponent extends FormParentBaseComponent {
  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(employerDetailsForm: IManualAccountCreationEmployerDetailsForm): void {
    const { defendantType } = this.macStateService.manualAccountCreation.accountDetails;

    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      employerDetails: employerDetailsForm.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (employerDetailsForm.continueFlow && defendantType) {
      this.routerNavigate(MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[defendantType]?.['employerDetails']);
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
