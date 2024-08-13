import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IFinesMacCompanyDetailsForm } from './interfaces';
import { FINES_MAC_NESTED_ROUTES, FINES_MAC_ROUTING_PATHS } from '@constants/fines/mac';
import { FinesMacCompanyDetailsFormComponent } from './fines-mac-company-details-form/fines-mac-company-details-form.component';
import { FinesService } from '@services/fines';

@Component({
  selector: 'app-fines-mac-company-details',
  standalone: true,
  imports: [FinesMacCompanyDetailsFormComponent],
  templateUrl: './fines-mac-company-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
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
