import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinesMacFormParentBaseComponent } from '../abstract/fines-mac-form-parent-base';
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
      this.navigateToNestedRoute('companyDetails');
      return;
    }

    this.navigateToAccountDetails();
  }
}
