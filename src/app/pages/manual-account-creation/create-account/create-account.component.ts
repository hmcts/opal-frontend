import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormParentBaseComponent } from '@components';
import { ManualAccountCreationRoutes } from '@enums';
import {
  IAutoCompleteItem,
  IBusinessUnit,
  IBusinessUnitRefData,
  IGovUkSelectOptions,
  IManualAccountCreationAccountDetailsState,
} from '@interfaces';
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';
import { BusinessUnitService } from '@services';
import { Observable, map, tap } from 'rxjs';
@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateAccountFormComponent],
  templateUrl: './create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent extends FormParentBaseComponent {
  private businessUnitService = inject(BusinessUnitService);
  private businessUnits!: IBusinessUnit[];
  public data$: Observable<IGovUkSelectOptions[]> = this.businessUnitService
    .getBusinessUnits('MANUAL_ACCOUNT_CREATION')
    .pipe(
      tap((response: IBusinessUnitRefData) => this.setBusinessUnit(response)),
      map((response: IBusinessUnitRefData) => {
        return this.createAutoCompleteItems(response);
      }),
    );

  /**
   * Sets the business unit for the account details.
   * If there is only one business unit available and the current business unit is null,
   * it sets the business unit to the first available business unit.
   *
   * @param response - The response containing the business unit reference data.
   */
  private setBusinessUnit(response: IBusinessUnitRefData): void {
    const { count, refData } = response;
    const { accountDetails } = this.macStateService.manualAccountCreation;

    if (count === 1 && accountDetails.BusinessUnit === null) {
      this.macStateService.manualAccountCreation.accountDetails.BusinessUnit = refData[0].businessUnitName;
      this.macStateService.manualAccountCreation.businessUnit = refData[0];
    }
    this.businessUnits = refData;
  }

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the business unit reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItems(response: IBusinessUnitRefData): IAutoCompleteItem[] {
    const businessUnits = response.refData;

    return businessUnits.map((item) => {
      return {
        value: item.businessUnitName,
        name: item.businessUnitName,
      };
    });
  }

  /**
   * Handles the form submission for account details.
   * @param formData - The form data containing the search parameters.
   */
  public handleAccountDetailsSubmit(formData: IManualAccountCreationAccountDetailsState): void {
    this.macStateService.manualAccountCreation = {
      ...this.macStateService.manualAccountCreation,
      accountDetails: formData,
      businessUnit: this.businessUnits.find((unit) => unit.businessUnitName === formData.BusinessUnit)!,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.routerNavigate(ManualAccountCreationRoutes.accountDetails);
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
