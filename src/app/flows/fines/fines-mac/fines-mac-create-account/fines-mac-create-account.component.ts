import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IAlphagovAccessibleAutocompleteItem } from '@interfaces/components/alphagov';
import { Observable, tap, map } from 'rxjs';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form/fines-mac-create-account-form.component';
import { IFinesMacCreateAccountState } from './interfaces';
import { FinesService, OpalFines } from '@services/fines';
import { IOpalFinesBusinessUnit, IOpalFinesBusinessUnitRefData } from '@interfaces/fines';
import { IGovUkSelectOptions } from '@interfaces/components/govuk';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';

@Component({
  selector: 'app-fines-mac-create-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacCreateAccountFormComponent],
  templateUrl: './fines-mac-create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCreateAccountComponent extends AbstractFormParentBaseComponent {
  protected readonly finesService = inject(FinesService);
  private opalFinesService = inject(OpalFines);
  private businessUnits!: IOpalFinesBusinessUnit[];
  public data$: Observable<IGovUkSelectOptions[]> = this.opalFinesService
    .getBusinessUnits('MANUAL_ACCOUNT_CREATION')
    .pipe(
      tap((response: IOpalFinesBusinessUnitRefData) => this.setBusinessUnit(response)),
      map((response: IOpalFinesBusinessUnitRefData) => {
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
  private setBusinessUnit(response: IOpalFinesBusinessUnitRefData): void {
    const { count, refData } = response;
    const { accountDetails } = this.finesService.finesMacState;

    if (count === 1 && accountDetails.BusinessUnit === null) {
      accountDetails.BusinessUnit = refData[0].businessUnitName;
      this.finesService.finesMacState.businessUnit = refData[0];
    }
    this.businessUnits = refData;
  }

  /**
   * Creates an array of autocomplete items based on the response from the server.
   * @param response - The response object containing the business unit reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItems(response: IOpalFinesBusinessUnitRefData): IAlphagovAccessibleAutocompleteItem[] {
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
  public handleAccountDetailsSubmit(formData: IFinesMacCreateAccountState): void {
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      accountDetails: formData,
      businessUnit: this.businessUnits.find((unit) => unit.businessUnitName === formData.BusinessUnit)!,
      unsavedChanges: false,
      stateChanges: true,
    };

    this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.accountDetails);
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
