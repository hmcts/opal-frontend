import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IFinesMacCompanyDetailsForm } from './interfaces/fines-mac-company-details-form.interface';
import { FinesMacCompanyDetailsFormComponent } from './fines-mac-company-details-form/fines-mac-company-details-form.component';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-company-details',
  imports: [FinesMacCompanyDetailsFormComponent],
  templateUrl: './fines-mac-company-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCompanyDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly finesMacStore = inject(FinesMacStore);
  public defendantType = this.finesMacStore.getDefendantType();

  /**
   * Handles the form submission for company details.
   * @param companyDetailsForm - The form data containing the company details.
   */
  public handleCompanyDetailsSubmit(form: IFinesMacCompanyDetailsForm): void {
    this.finesMacStore.setCompanyDetails(form);

    if (form.nestedFlow && this.defendantType) {
      const nextRoute = FINES_MAC_ROUTING_NESTED_ROUTES[this.defendantType]['companyDetails'];
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
