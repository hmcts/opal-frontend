import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@components/abstract';
import { IAlphagovAccessibleAutocompleteItem } from '@interfaces/components/alphagov';
import { Observable, tap, map } from 'rxjs';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form/fines-mac-create-account-form.component';
import { IFinesMacCreateAccountForm } from './interfaces/fines-mac-create-account-form.interface';
import { FinesService } from '@services/fines/fines-service/fines';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines';
import {
  IOpalFinesBusinessUnit,
  IOpalFinesBusinessUnitRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data';

import { IGovUkSelectOptions } from '@interfaces/components/govuk';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { FINES_MAC_CREATE_ACCOUNT_FORM } from './constants/fines-mac-create-account-form';
import { FINES_MAC_CREATE_ACCOUNT_STATE } from './constants/fines-mac-create-account-state';
import { FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS } from './constants/fines-mac-create-account-configuration-items';

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
  private configurationItems = FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS;
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
    const { business_unit: businessUnit } = this.finesService.finesMacState.accountDetails.formData;

    if (count === 1 && businessUnit === null) {
      this.finesService.finesMacState.accountDetails.formData.business_unit = refData[0].businessUnitName;
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
    // Get the business unit and default language from the business unit if applicable
    const businessUnit = this.businessUnits.find((unit) => unit.businessUnitName === form.formData.business_unit)!;
    const defaultDocumentLanguage = this.opalFinesService.getConfigurationItemValue(
      businessUnit,
      this.configurationItems.defaultDocumentLanguagePreference,
    );
    const defaultCourtHearingLanguage = this.opalFinesService.getConfigurationItemValue(
      businessUnit,
      this.configurationItems.defaultDocumentCourtHearingPreference,
    );

    // Update the status as form is mandatory
    form.status = FINES_MAC_STATUS.PROVIDED;

    // Update the state with the form data
    this.finesService.finesMacState = {
      ...this.finesService.finesMacState,
      accountDetails: form,
      businessUnit: this.businessUnits.find((unit) => unit.businessUnitName === form.formData.business_unit)!,
      languagePreferences: {
        ...this.finesService.finesMacState.languagePreferences,
        formData: {
          ...this.finesService.finesMacState.languagePreferences.formData,
          document_language: defaultDocumentLanguage,
          hearing_language: defaultCourtHearingLanguage,
        },
      },
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
    const { business_unit: businessUnit } = this.finesService.finesMacState.accountDetails.formData;
    this.finesService.finesMacState = {
      ...FINES_MAC_STATE,
      accountDetails: {
        ...FINES_MAC_CREATE_ACCOUNT_FORM,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE,
          business_unit: businessUnit,
        },
      },
    };
  }
}
