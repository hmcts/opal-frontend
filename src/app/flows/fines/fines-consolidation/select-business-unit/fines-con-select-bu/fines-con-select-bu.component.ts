import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesConSelectBuFormComponent } from './fines-con-select-bu-form/fines-con-select-bu-form.component';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { IFinesConSelectBuForm } from './interfaces/fines-con-select-bu-form.interface';
import { FINES_CON_DEFENDANT_TYPES } from '../fines-con-select-bu/constants/fines-con-defendant-types.constant';
import { FinesConStore } from '../../stores/fines-con.store';

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
  public selectedBusinessUnit = signal<IOpalFinesBusinessUnit | null>(null);
  public defendantTypes = FINES_CON_DEFENDANT_TYPES;

  /**
   * Sets the business unit automatically if there's only one available
   * and caches the selection for the consolidation journey
   */
  private setBusinessUnit(result: IOpalFinesBusinessUnitRefData): void {
    if (result.refData.length === 1) {
      this.selectedBusinessUnit.set(result.refData[0]);
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
   * Pre-populates the form with data from the store if it exists
   */
  private prePopulateFromStore(): void {
    const storedBusinessUnitId = this.finesConStore.getBusinessUnitId();

    if (storedBusinessUnitId) {
      const businessUnit = this.businessUnitsRefData.refData.find(
        (unit) => unit.business_unit_id === storedBusinessUnitId,
      );
      if (businessUnit) {
        this.selectedBusinessUnit.set(businessUnit);
      }
    }
  }
  /**
   * Handles form submission for business unit and defendant type selection
   * Stores the data in the consolidation store for use across the flow
   */
  public handleFormSubmit(formData: IFinesConSelectBuForm): void {
    this.finesConStore.updateSelectBuForm(formData.formData);

    // Navigate to next screen when routing is implemented
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
   * Initializes the component by loading business unit reference data from the route,
   * applying the selected business unit, preparing autocomplete items, and prepopulating
   * values from the store.
   */
  public ngOnInit(): void {
    this.businessUnitsRefData = this['activatedRoute'].snapshot.data['businessUnits'] || { refData: [] };
    this.setBusinessUnit(this.businessUnitsRefData);
    this.businessUnitAutoCompleteItems.set(this.createAutoCompleteItems(this.businessUnitsRefData));
    this.prePopulateFromStore();
  }
}
