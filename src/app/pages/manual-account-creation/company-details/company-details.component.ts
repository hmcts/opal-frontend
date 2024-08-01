import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormParentBaseComponent } from '@components';
import { MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationCompanyDetailsForm } from '@interfaces';
import { CompanyDetailsFormComponent } from './company-details-form/company-details-form.component';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CompanyDetailsFormComponent],
  templateUrl: './company-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailsComponent extends FormParentBaseComponent {
  public defendantType = this.macStateService.manualAccountCreation.accountDetails.defendantType!;

  /**
   * Handles the form submission for company details.
   * @param companyDetailsForm - The form data containing the company details.
   */
  public handleCompanyDetailsSubmit(companyDetailsForm: IManualAccountCreationCompanyDetailsForm): void {
    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      companyDetails: companyDetailsForm.formData,
      unsavedChanges: false,
      stateChanges: true,
    };

    if (companyDetailsForm.nestedFlow && this.defendantType) {
      const nextRoute = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES[this.defendantType]['companyDetails'];
      if (nextRoute) {
        this.routerNavigate(nextRoute.nextRoute);
      }
    } else {
      this.routerNavigate(ManualAccountCreationRoutes.accountDetails);
    }
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.macStateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }
}
