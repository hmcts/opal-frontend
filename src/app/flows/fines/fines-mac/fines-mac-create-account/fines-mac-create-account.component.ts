import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@components/abstract/abstract-form-parent-base/abstract-form-parent-base.component';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { Observable, tap, map } from 'rxjs';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form/fines-mac-create-account-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import {
  IOpalFinesBusinessUnit,
  IOpalFinesBusinessUnitRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

import { IGovUkSelectOptions } from '@components/govuk/govuk-select/interfaces/govuk-select-options.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { FINES_MAC_CREATE_ACCOUNT_FORM } from './constants/fines-mac-create-account-form';
import { FINES_MAC_CREATE_ACCOUNT_STATE } from './constants/fines-mac-create-account-state';
import { FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS } from './constants/fines-mac-create-account-configuration-items';
import { IFinesMacAccountDetailsForm } from '../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';

@Component({
  selector: 'app-fines-mac-create-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FinesMacCreateAccountFormComponent],
  templateUrl: './fines-mac-create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCreateAccountComponent extends AbstractFormParentBaseComponent implements OnInit {
  protected readonly finesService = inject(FinesService);
  private readonly opalFinesService = inject(OpalFines);
  private businessUnits!: IOpalFinesBusinessUnit[];
  private readonly configurationItems = FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS;
  public data$: Observable<IGovUkSelectOptions[]> = this.opalFinesService
    .getBusinessUnits('CREATE_MANAGE_DRAFT_ACCOUNTS')
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
    const { fm_create_account_business_unit_id: businessUnit } =
      this.finesService.finesMacState.accountDetails.formData;

    if (count === 1 && businessUnit === null) {
      this.finesService.finesMacState.accountDetails.formData.fm_create_account_business_unit_id =
        refData[0].business_unit_id;
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
        value: item.business_unit_id,
        name: item.business_unit_name,
      };
    });
  }

  /**
   * Handles the form submission for account details.
   * @param formData - The form data containing the search parameters.
   */
  public handleAccountDetailsSubmit(form: IFinesMacAccountDetailsForm): void {
    // Get the business unit and default language from the business unit if applicable
    const businessUnit = this.businessUnits.find(
      (unit) => unit.business_unit_id === form.formData.fm_create_account_business_unit_id,
    )!;
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
      businessUnit: this.businessUnits.find(
        (unit) => unit.business_unit_id === form.formData.fm_create_account_business_unit_id,
      )!,
      languagePreferences: {
        ...this.finesService.finesMacState.languagePreferences,
        formData: {
          ...this.finesService.finesMacState.languagePreferences.formData,
          fm_language_preferences_document_language: defaultDocumentLanguage,
          fm_language_preferences_hearing_language: defaultCourtHearingLanguage,
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
    const { fm_create_account_business_unit_id: businessUnitId } =
      this.finesService.finesMacState.accountDetails.formData;
    this.finesService.finesMacState = {
      ...FINES_MAC_STATE,
      accountDetails: {
        ...FINES_MAC_CREATE_ACCOUNT_FORM,
        formData: {
          ...FINES_MAC_CREATE_ACCOUNT_STATE,
          fm_create_account_business_unit_id: businessUnitId,
        },
      },
    };
    this.finesService.finesMacState.offenceDetails = [];
  }
}
