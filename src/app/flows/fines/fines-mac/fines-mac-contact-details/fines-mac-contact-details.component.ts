import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IFinesMacContactDetailsForm } from './interfaces';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FinesMacContactDetailsFormComponent } from './fines-mac-contact-details-form/fines-mac-contact-details-form.component';
import { FINES_MAC_NESTED_ROUTES, FINES_MAC_ROUTING_PATHS } from '@constants/fines/mac';
import { FinesService } from '@services/fines';

@Component({
  selector: 'app-fines-mac-contact-details',
  standalone: true,
  imports: [FinesMacContactDetailsFormComponent],
  templateUrl: './fines-mac-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacContactDetailsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Handles the form submission for contact details.
   * @param formData - The form data containing the search parameters.
   */
  public handleContactDetailsSubmit(form: IFinesMacContactDetailsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      contactDetails: form.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_NESTED_ROUTES[this.defendantType]['contactDetails'];
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
