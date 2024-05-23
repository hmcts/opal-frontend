import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StateService } from '@services';
import { EmployerDetailsFormComponent } from './employer-details-form/employer-details-form.component';
import { IManualAccountCreationEmployerDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { GovukBackLinkComponent } from '@components';
import { CanDeactivateType } from 'src/app/guards/can-deactivate/can-deactivate.guard';

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, EmployerDetailsFormComponent, GovukBackLinkComponent],
  templateUrl: './employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsComponent {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);

  public hasChanged = false;

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): CanDeactivateType {
    if (this.stateService.manualAccountCreation.unsavedChanges) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(formData: IManualAccountCreationEmployerDetailsState): void {
    this.stateService.manualAccountCreation = {
      employerDetails: formData,
      unsavedChanges: false
    };

    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
  }

  handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateService.manualAccountCreation.unsavedChanges = unsavedChanges;
  }
}
