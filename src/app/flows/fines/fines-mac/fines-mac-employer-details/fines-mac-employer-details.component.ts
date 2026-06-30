import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FINES_MAC_NESTED_ROUTE_KEYS } from '../constants/fines-mac-nested-route-keys.constant';
import { FinesMacFormParentBaseComponent } from '../components/abstract/fines-mac-form-parent-base/fines-mac-form-parent-base.component';
import { IFinesMacEmployerDetailsForm } from './interfaces/fines-mac-employer-details-form.interface';
import { FinesMacEmployerDetailsFormComponent } from './fines-mac-employer-details-form/fines-mac-employer-details-form.component';

@Component({
  selector: 'app-fines-mac-employer-details',
  imports: [RouterModule, FinesMacEmployerDetailsFormComponent],
  templateUrl: './fines-mac-employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacEmployerDetailsComponent extends FinesMacFormParentBaseComponent {
  /**
   * Handles the form submission for employer details.
   * @param formData - The form data containing the search parameters.
   */
  public handleEmployerDetailsSubmit(form: IFinesMacEmployerDetailsForm): void {
    this.finesMacStore.setEmployerDetails(form);
    if (form.nestedFlow) {
      this.handleNestedFlowNavigation(FINES_MAC_NESTED_ROUTE_KEYS.employerDetails);
      return;
    }

    this.navigateToAccountDetails();
  }
}
