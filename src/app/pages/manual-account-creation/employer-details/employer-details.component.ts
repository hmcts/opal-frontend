import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EmployerDetailsFormComponent } from './employer-details-form/employer-details-form.component';
import { IManualAccountCreationEmployerDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { FormParentBaseComponent, GovukBackLinkComponent } from '@components';

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, EmployerDetailsFormComponent, GovukBackLinkComponent],
  templateUrl: './employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsComponent extends FormParentBaseComponent {
  private readonly router = inject(Router);

  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(formData: IManualAccountCreationEmployerDetailsState): void {
    this.stateService.manualAccountCreation = {
      employerDetails: formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
  }

  handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
