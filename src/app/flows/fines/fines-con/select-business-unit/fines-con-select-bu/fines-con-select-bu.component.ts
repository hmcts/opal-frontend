import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesConSelectBuFormComponent } from './fines-con-select-bu-form/fines-con-select-bu-form.component';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IFinesConSelectBuForm } from './interfaces/fines-con-select-bu-form.interface';
import { FINES_CON_DEFENDANT_TYPES } from '../fines-con-select-bu/constants/fines-con-defendant-types.constant';
import { FinesConStore } from '../../stores/fines-con.store';
import { FINES_CON_ROUTING_PATHS } from '../../routing/constants/fines-con-routing-paths.constant';

@Component({
  selector: 'app-fines-con-select-bu',
  imports: [FinesConSelectBuFormComponent],
  templateUrl: './fines-con-select-bu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSelectBuComponent extends AbstractFormParentBaseComponent implements OnInit {
  protected readonly finesConStore = inject(FinesConStore);

  public businessUnitsRefData!: IOpalFinesBusinessUnitRefData;
  public businessUnitAutoCompleteItems = signal<IAlphagovAccessibleAutocompleteItem[]>([]);
  public defendantTypes = FINES_CON_DEFENDANT_TYPES;

  /**
   * Sets the business unit for the consolidation selection.
   * If there is only one business unit available and the current business unit is null,
   * it sets the business unit to the first available business unit.
   */
  private setBusinessUnit(result: IOpalFinesBusinessUnitRefData): void {
    const { formData } = this.finesConStore.selectBuForm();

    if (result.refData.length === 1 && !formData.fcon_select_bu_business_unit_id) {
      this.finesConStore.updateSelectBuForm({
        fcon_select_bu_business_unit_id: result.refData[0].business_unit_id,
        fcon_select_bu_business_unit_name: result.refData[0].business_unit_name,
        fcon_select_bu_defendant_type: formData.fcon_select_bu_defendant_type,
      });
    }
  }

  /**
   * Creates an array of autocomplete items from business unit data
   */
  private createAutoCompleteItems(result: IOpalFinesBusinessUnitRefData): IAlphagovAccessibleAutocompleteItem[] {
    return result.refData.map((item: IOpalFinesBusinessUnit) => ({
      value: item.business_unit_id,
      name: item.business_unit_name,
    }));
  }

  /**
   * Performs the initial setup for the select business unit component.
   * Loads business unit reference data, auto-selects if only one is available,
   * and prepares autocomplete items.
   */
  private initialSelectBuSetup(): void {
    this.businessUnitsRefData = this['activatedRoute'].snapshot.data['businessUnits'] || { refData: [] };
    this.setBusinessUnit(this.businessUnitsRefData);
    this.businessUnitAutoCompleteItems.set(this.createAutoCompleteItems(this.businessUnitsRefData));
  }

  /**
   * Handles form submission for business unit and defendant type selection
   * Stores the data in the consolidation store for use across the flow
   */
  public handleFormSubmit(formData: IFinesConSelectBuForm): void {
    const selectedBusinessUnitId = formData.formData.fcon_select_bu_business_unit_id;
    const selectedBusinessUnit = this.businessUnitsRefData.refData.find(
      (bu) => bu.business_unit_id === selectedBusinessUnitId,
    );

    this.finesConStore.updateSelectBuForm({
      fcon_select_bu_business_unit_id: formData.formData.fcon_select_bu_business_unit_id,
      fcon_select_bu_business_unit_name: selectedBusinessUnit?.business_unit_name || null,
      fcon_select_bu_defendant_type: formData.formData.fcon_select_bu_defendant_type,
    });
    this.routerNavigate(FINES_CON_ROUTING_PATHS.children.consolidateAcc);
  }

  /**
   * Handles unsaved changes coming from the child component
   *
   * @param unsavedChanges boolean value from child component
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Initializes the component by performing initial select business unit setup.
   * The form component handles restoring data from store.
   */
  public ngOnInit(): void {
    this.initialSelectBuSetup();
  }
}
