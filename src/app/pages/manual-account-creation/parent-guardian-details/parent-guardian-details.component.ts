import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormParentBaseComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationParentGuardianDetailsState } from '@interfaces';
import { ParentGuardianDetailsFormComponent } from './parent-guardian-details-form/parent-guardian-details-form.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  public handleParentGuardianDetailsSubmit(formData: IManualAccountCreationParentGuardianDetailsState): void {
    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      parentGuardianDetails: formData,
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
    this.macStateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
