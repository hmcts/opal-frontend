import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacContactDetailsForm } from './interfaces/fines-mac-contact-details-form.interface';
import { FinesMacContactDetailsFormComponent } from './fines-mac-contact-details-form/fines-mac-contact-details-form.component';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-contact-details',
  imports: [FinesMacContactDetailsFormComponent],
  templateUrl: './fines-mac-contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacContactDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);
  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Handles the form submission for contact details.
   * @param formData - The form data containing the search parameters.
   */
  public handleContactDetailsSubmit(form: IFinesMacContactDetailsForm): void {
    this.finesMacStore.setContactDetails(form);

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_ROUTING_NESTED_ROUTES[this.defendantType]['contactDetails'];
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
    this.finesMacStore.setUnsavedChanges(unsavedChanges);
    this.stateUnsavedChanges = unsavedChanges;
  }
}
