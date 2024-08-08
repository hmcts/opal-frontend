import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormParentBaseComponent } from '@components/abstract';
import { IFinesMacCompanyDetailsForm } from '@interfaces/fines/mac';
import { FINES_MAC_NESTED_ROUTES } from '@constants/fines/mac';
import { FinesMacRoutes } from '@enums/fines/mac';
import { FinesMacCompanyDetailsFormComponent } from './fines-mac-company-details-form/fines-mac-company-details-form.component';

@Component({
  selector: 'app-fines-mac-company-details',
  standalone: true,
  imports: [FinesMacCompanyDetailsFormComponent],
  templateUrl: './fines-mac-company-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsComponent extends FormParentBaseComponent {
  public defendantType = this.finesService.finesMacState.accountDetails.DefendantType!;

  /**
   * Handles the form submission for company details.
   * @param companyDetailsForm - The form data containing the company details.
   */
  public handleCompanyDetailsSubmit(form: IFinesMacCompanyDetailsForm): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      companyDetails: form.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_NESTED_ROUTES[this.defendantType]['companyDetails'];
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
