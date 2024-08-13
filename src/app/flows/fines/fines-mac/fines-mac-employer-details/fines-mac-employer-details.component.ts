import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IFinesMacEmployerDetailsForm } from './interfaces';
import { FinesMacEmployerDetailsFormComponent } from './fines-mac-employer-details-form/fines-mac-employer-details-form.component';
import { FINES_MAC_NESTED_ROUTES } from '@constants/fines/mac';
import { FinesService } from '@services/fines';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';

@Component({
  selector: 'app-fines-mac-employer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacEmployerDetailsFormComponent],
  templateUrl: './fines-mac-employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacEmployerDetailsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(form: IFinesMacEmployerDetailsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      employerDetails: form.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_NESTED_ROUTES[this.defendantType]['employerDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.finesService.finesMacState.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
