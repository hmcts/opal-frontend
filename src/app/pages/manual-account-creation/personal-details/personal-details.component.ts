import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ManualAccountCreationRoutes } from '@enums';
import { StateService } from '@services';
import { IManualAccountCreationPersonalDetailsState } from 'src/app/interfaces/manual-account-creation-personal-details-state.interface';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [PersonalDetailsFormComponent],
  templateUrl: './personal-details.component.html',
})
export class PersonalDetailsComponent {
  public readonly stateService = inject(StateService);
  protected readonly router = inject(Router);

  public stateUnsavedChanges!: boolean;

  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(formData: IManualAccountCreationPersonalDetailsState): void {
    this.stateService.manualAccountCreation = {
      personalDetails: formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
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
