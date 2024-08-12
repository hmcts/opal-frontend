import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IFinesMacPersonalDetailsForm } from './interfaces';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FinesMacPersonalDetailsFormComponent } from './fines-mac-personal-details-form/fines-mac-personal-details-form.component';
import { FINES_MAC_NESTED_ROUTES } from '@constants/fines/mac';
import { FinesService } from '@services/fines';

@Component({
  selector: 'app-fines-mac-personal-details',
  standalone: true,
  imports: [FinesMacPersonalDetailsFormComponent],
  templateUrl: './fines-mac-personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Handles the submission of personal details form.
   *
   * @param form - The personal details form data.
   * @returns void
   */
  public handlePersonalDetailsSubmit(form: IFinesMacPersonalDetailsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      personalDetails: form.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_NESTED_ROUTES[this.defendantType]['personalDetails'];
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
