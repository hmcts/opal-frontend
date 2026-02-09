import { signalStore, withState, withMethods, patchState, withComputed, withHooks } from '@ngrx/signals';
import { computed } from '@angular/core';
import { IFinesConSelectBuState } from '../select-business-unit/fines-con-select-bu/interfaces/fines-con-select-bu-state.interface';
import { IFinesConSelectBuForm } from '../select-business-unit/fines-con-select-bu/interfaces/fines-con-select-bu-form.interface';
import { FINES_CON_SELECT_BU_FORM } from '../select-business-unit/fines-con-select-bu/constants/fines-con-select-bu-form.constant';

export const FinesConStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    selectBuForm: FINES_CON_SELECT_BU_FORM,
  })),
  withHooks((store) => {
    return {
      onDestroy() {
        patchState(store, {
          selectBuForm: FINES_CON_SELECT_BU_FORM,
        });
      },
    };
  }),
  withComputed((store) => {
    return {
      /**
       * Gets the selected business unit ID
       */
      getBusinessUnitId: computed(() => {
        return store.selectBuForm().formData.fcon_select_bu_business_unit_id;
      }),

      /**
       * Gets the selected defendant type
       */
      getDefendantType: computed(() => {
        return store.selectBuForm().formData.fcon_select_bu_defendant_type;
      }),

      /**
       * Checks if both business unit and defendant type are selected
       */
      isSelectBuFormComplete: computed(() => {
        const formData = store.selectBuForm().formData;
        return !!(formData.fcon_select_bu_business_unit_id && formData.fcon_select_bu_defendant_type);
      }),
    };
  }),
  withMethods((store) => ({
    /**
     * Updates the business unit and defendant type selection
     */
    updateSelectBuForm(formData: IFinesConSelectBuState): void {
      patchState(store, {
        selectBuForm: {
          ...store.selectBuForm(),
          formData,
        },
      });
    },

    /**
     * Updates the entire select BU form including nested flow flag
     */
    updateSelectBuFormComplete(form: IFinesConSelectBuForm): void {
      patchState(store, {
        selectBuForm: form,
      });
    },

    /**
     * Resets the entire consolidation form state
     */
    resetConsolidationState(): void {
      patchState(store, {
        selectBuForm: FINES_CON_SELECT_BU_FORM,
      });
    },
  })),
);
