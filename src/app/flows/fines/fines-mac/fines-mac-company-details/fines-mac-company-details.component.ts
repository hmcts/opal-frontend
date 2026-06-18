import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FINES_MAC_NESTED_ROUTE_KEYS } from '../constants/fines-mac-nested-route-keys.constant';
import { FinesMacFormParentBaseComponent } from '../components/abstract/fines-mac-form-parent-base/fines-mac-form-parent-base.component';
import { IFinesMacCompanyDetailsForm } from './interfaces/fines-mac-company-details-form.interface';
import { FinesMacCompanyDetailsFormComponent } from './fines-mac-company-details-form/fines-mac-company-details-form.component';

@Component({
  selector: 'app-fines-mac-company-details',
  imports: [FinesMacCompanyDetailsFormComponent],
  templateUrl: './fines-mac-company-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsComponent extends FinesMacFormParentBaseComponent {
  /**
   * Handles the form submission for company details.
   * @param companyDetailsForm - The form data containing the company details.
   */
  public handleCompanyDetailsSubmit(form: IFinesMacCompanyDetailsForm): void {
    this.finesMacStore.setCompanyDetails(form);
    if (form.nestedFlow) {
      this.handleNestedFlowNavigation(FINES_MAC_NESTED_ROUTE_KEYS.companyDetails);
      return;
    }

    this.navigateToAccountDetails();
  }
}
