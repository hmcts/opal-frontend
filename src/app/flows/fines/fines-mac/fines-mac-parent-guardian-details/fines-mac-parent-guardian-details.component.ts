import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_MAC_NESTED_ROUTE_KEYS } from '../constants/fines-mac-nested-route-keys.constant';
import { FinesMacFormParentBaseComponent } from '../components/abstract/fines-mac-form-parent-base/fines-mac-form-parent-base.component';
import { IFinesMacParentGuardianDetailsForm } from './interfaces/fines-mac-parent-guardian-details-form.interface';

import { RouterModule } from '@angular/router';
import { FinesMacParentGuardianDetailsFormComponent } from './fines-mac-parent-guardian-details-form/fines-mac-parent-guardian-details-form.component';

@Component({
  selector: 'app-fines-mac-parent-guardian-details',
  imports: [RouterModule, FinesMacParentGuardianDetailsFormComponent],
  templateUrl: './fines-mac-parent-guardian-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacParentGuardianDetailsComponent extends FinesMacFormParentBaseComponent {
  /**
   * Handles the form submission for parent/guardian details.
   * @param formData - The form data containing the search parameters.
   */
  public handleParentGuardianDetailsSubmit(form: IFinesMacParentGuardianDetailsForm): void {
    this.finesMacStore.setParentGuardianDetails(form);
    if (form.nestedFlow) {
      this.handleNestedFlowNavigation(FINES_MAC_NESTED_ROUTE_KEYS.parentOrGuardianDetails);
      return;
    }

    this.navigateToAccountDetails();
  }
}
