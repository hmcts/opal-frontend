import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesMacEmployerDetailsForm } from './interfaces/fines-mac-employer-details-form.interface';
import { FinesMacEmployerDetailsFormComponent } from './fines-mac-employer-details-form/fines-mac-employer-details-form.component';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-employer-details',
  imports: [CommonModule, RouterModule, FinesMacEmployerDetailsFormComponent],
  templateUrl: './fines-mac-employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacEmployerDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);
  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(form: IFinesMacEmployerDetailsForm): void {
    this.finesMacStore.setEmployerDetails(form);

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_ROUTING_NESTED_ROUTES[this.defendantType]['employerDetails'];
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
