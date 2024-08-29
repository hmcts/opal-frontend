import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IAlphagovAccessibleAutocompleteItem } from '@interfaces/components/alphagov';
import { Observable, tap, map } from 'rxjs';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form/fines-mac-create-account-form.component';
import { IFinesMacCreateAccountForm } from './interfaces';
import { FinesService, OpalFines } from '@services/fines';
import { IOpalFinesBusinessUnit, IOpalFinesBusinessUnitRefData } from '@interfaces/fines';
import { IGovUkSelectOptions } from '@interfaces/components/govuk';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';
import { FINES_MAC_STATE, FINES_MAC_STATUS } from '../constants';
import { FINES_MAC_CREATE_ACCOUNT_FORM, FINES_MAC_CREATE_ACCOUNT_STATE } from './constants';

@Component({
  selector: 'app-fines-mac-create-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacCreateAccountFormComponent],
  templateUrl: './fines-mac-create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCreateAccountComponent extends AbstractFormParentBaseComponent implements OnInit {
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
    const { formData } = this.finesService.finesMacState.accountDetails;

    if (count === 1 && formData.BusinessUnit === null) {
      formData.BusinessUnit = refData[0].businessUnitName;
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
  public handleAccountDetailsSubmit(form: IFinesMacCreateAccountForm): void {
    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      accountDetails: form,
      businessUnit: this.businessUnits.find((unit) => unit.businessUnitName === form.formData.BusinessUnit)!,
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

  public ngOnInit(): void {
    const { BusinessUnit } = this.finesService.finesMacState.accountDetails.formData;
    this.finesService.finesMacState = {
      ...FINES_MAC_STATE,
      accountDetails: {
        ...FINES_MAC_CREATE_ACCOUNT_FORM,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE,
          BusinessUnit: BusinessUnit,
        },
      },
    };
  }
}
