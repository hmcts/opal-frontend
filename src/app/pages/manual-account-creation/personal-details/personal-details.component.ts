import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationPersonalDetailsState } from 'src/app/interfaces/manual-account-creation-personal-details-state.interface';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';
import { FormParentBaseComponent } from '@components';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [PersonalDetailsFormComponent],
  templateUrl: './personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalDetailsComponent extends FormParentBaseComponent {
  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handlePersonalDetailsSubmit(formData: IManualAccountCreationPersonalDetailsState): void {
    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      personalDetails: formData,
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
