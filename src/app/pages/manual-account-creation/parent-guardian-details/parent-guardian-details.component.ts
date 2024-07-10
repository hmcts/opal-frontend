import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormParentBaseComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationParentGuardianForm } from '@interfaces';
import { ParentGuardianDetailsFormComponent } from './parent-guardian-details-form/parent-guardian-details-form.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '@constants';

@Component({
  selector: 'app-parent-guardian-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ParentGuardianDetailsFormComponent],
  templateUrl: './parent-guardian-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentGuardianDetailsComponent extends FormParentBaseComponent {
  /**
   * Handles the form submission for parent/guardian details.
   * @param formData - The form data containing the search parameters.
   */
  public handleParentGuardianDetailsSubmit(parentGuardianForm: IManualAccountCreationParentGuardianForm): void {
    const { defendantType } = this.macStateService.manualAccountCreation.accountDetails;

    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      parentGuardianDetails: parentGuardianForm.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (parentGuardianForm.continueFlow && defendantType) {
      this.routerNavigate(MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[defendantType]?.['parentOrGuardianDetails']);
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
