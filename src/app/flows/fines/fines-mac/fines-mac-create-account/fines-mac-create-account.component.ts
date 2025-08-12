import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form/fines-mac-create-account-form.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS } from './constants/fines-mac-create-account-configuration-items';
import { IFinesMacAccountDetailsForm } from '../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FINES_MAC_ACCOUNT_TYPES_KEYS } from '../constants/fines-mac-account-types-keys';

@Component({
  selector: 'app-fines-mac-create-account',
  imports: [RouterModule, FinesMacCreateAccountFormComponent],
  templateUrl: './fines-mac-create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCreateAccountComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly opalFinesService = inject(OpalFines);
  private businessUnitsRefData!: IOpalFinesBusinessUnitRefData;
  private readonly configurationItems = FINES_MAC_CREATE_ACCOUNT_CONFIGURATION_ITEMS;
  public data: IAlphagovAccessibleAutocompleteItem[] = [];

  /**
   * Sets the business unit for the account details.
   * If there is only one business unit available and the current business unit is null,
   * it sets the business unit to the first available business unit.
   *
   * @param refData - The array of business unit reference data.
   */
  private setBusinessUnit(result: IOpalFinesBusinessUnitRefData): void {
    const { fm_create_account_business_unit_id: businessUnit } = structuredClone(
      this.finesMacStore.accountDetails().formData,
    );

    if (result.refData.length === 1 && businessUnit === null) {
      this.finesMacStore.setBusinessUnitId(result.refData[0].business_unit_id);
      this.finesMacStore.setBusinessUnit(result.refData[0]);
    }
  }

  /**
   * Creates an array of autocomplete items based on the business unit data.
   * @param refData - The array of business unit reference data.
   * @returns An array of autocomplete items.
   */
  private createAutoCompleteItems(result: IOpalFinesBusinessUnitRefData): IAlphagovAccessibleAutocompleteItem[] {
    return result.refData.map((item) => ({
      value: item.business_unit_id,
      name: item.business_unit_name,
    }));
  }

  /**
   * Handles the form submission for account details.
   * @param formData - The form data containing the search parameters.
   */
  public handleAccountDetailsSubmit(form: IFinesMacAccountDetailsForm): void {
    // Get the business unit and default language from the business unit if applicable
    const businessUnit = this.businessUnitsRefData.refData.find(
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

    // Construct language preference form
    const languagePreferenceForm = {
      ...structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_FORM),
      formData: {
        fm_language_preferences_document_language: defaultDocumentLanguage,
        fm_language_preferences_hearing_language: defaultCourtHearingLanguage,
      },
    };

    // Update the state with the form data
    this.finesMacStore.setAccountDetails(form, businessUnit, languagePreferenceForm);

    // Navigate to next screen, based on the account type
    if (form.formData.fm_create_account_account_type === FINES_MAC_ACCOUNT_TYPES_KEYS.fixedPenalty) {
      this.routerNavigate(FINES_MAC_ROUTING_PATHS.children.fixedPenaltyDetails);
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

  public ngOnInit(): void {
    this.businessUnitsRefData = this['activatedRoute'].snapshot.data['businessUnits'];
    this.setBusinessUnit(this.businessUnitsRefData);
    this.data = this.createAutoCompleteItems(this.businessUnitsRefData);
    const businessUnitId = this.finesMacStore.getBusinessUnitId();
    this.finesMacStore.resetFinesMacStore();
    if (businessUnitId) {
      this.finesMacStore.setBusinessUnitId(businessUnitId);
    }
  }
}
