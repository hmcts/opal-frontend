import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IFinesMacParentGuardianDetailsForm } from './interfaces';
import { FinesMacRoutes } from '@enums/fines/mac';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinesMacParentGuardianDetailsFormComponent } from './fines-mac-parent-guardian-details-form/fines-mac-parent-guardian-details-form.component';
import { FINES_MAC_NESTED_ROUTES } from '@constants/fines/mac';
import { FinesService } from '@services/fines';

@Component({
  selector: 'app-fines-mac-parent-guardian-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacParentGuardianDetailsFormComponent],
  templateUrl: './fines-mac-parent-guardian-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacParentGuardianDetailsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Handles the form submission for parent/guardian details.
   * @param formData - The form data containing the search parameters.
   */
  public handleParentGuardianDetailsSubmit(form: IFinesMacParentGuardianDetailsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      parentGuardianDetails: form.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_NESTED_ROUTES[this.defendantType]['parentOrGuardianDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(FinesMacRoutes.finesMacAccountDetails);
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
