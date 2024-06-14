import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormParentBaseComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import { IManualAccountCreationAccountDetailsState } from '@interfaces';
import { AccountDetailsFormComponent } from './account-details-form/account-details-form.component';
import { BusinessUnitService } from '@services';
@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule, AccountDetailsFormComponent],
  templateUrl: './account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent extends FormParentBaseComponent implements OnInit {
  private businessUnitService = inject(BusinessUnitService);

  /**
   * Handles the form submission for account details.
   * @param formData - The form data containing the search parameters.
   */
  public handleAccountDetailsSubmit(formData: IManualAccountCreationAccountDetailsState): void {
    this.stateService.manualAccountCreation = {
      accountDetails: formData,
      employerDetails: this.stateService.manualAccountCreation.employerDetails,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.routerNavigate(ManualAccountCreationRoutes.createAccount);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateService.manualAccountCreation.unsavedChanges = unsavedChanges;
    this.stateUnsavedChanges = unsavedChanges;
  }

  ngOnInit(): void {
    this.businessUnitService.getBusinessUnits('MANUAL_ACCOUNT_CREATION').subscribe((response) => {
      console.log(response);
    });
  }
}
