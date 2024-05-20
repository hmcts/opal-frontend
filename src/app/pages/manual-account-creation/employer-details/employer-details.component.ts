import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StateService } from '@services';
import { EmployerDetailsFormComponent } from './employer-details-form/employer-details-form.component';
import { IManualAccountCreationEmployerDetailsState } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, EmployerDetailsFormComponent],
  templateUrl: './employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerDetailsComponent {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    //const employerDetails = this.stateService.manualAccountCreation.employerDetails;
    // if (employerDetails) {
    //   const keys = Object.keys(employerDetails) as (keyof typeof employerDetails)[];
    //   for (const key of keys) {
    //     const value = employerDetails[key];
    //     if (value && value.trim() !== '') {
    //       return false;
    //     }
    //   }
    // }
    return true;
  }

  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(formData: IManualAccountCreationEmployerDetailsState): void {
    this.stateService.manualAccountCreation = {
      employerDetails: formData
    };

    console.log(this.stateService.manualAccountCreation);
    this.router.navigate([ManualAccountCreationRoutes.createAccount]);
  }
}
