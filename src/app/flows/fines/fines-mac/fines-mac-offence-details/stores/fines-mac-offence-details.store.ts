import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IAbstractFormArrayControls } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';

export const FinesMacOffenceDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    offenceDetailsDraft: [] as IFinesMacOffenceDetailsForm[],
    rowIndex: null as number | null,
    formArrayControls: [] as IAbstractFormArrayControls[],
    removeMinorCreditor: null as number | null,
    offenceIndex: 0,
    emptyOffences: false,
    addedOffenceCode: '',
    minorCreditorAdded: false,
    offenceRemoved: false,
    offenceCodeMessage: '',
  })),
  withMethods((store) => ({
    setOffenceCodeMessage: (message: string) => {
      patchState(store, { offenceCodeMessage: message });
    },
    setOffenceRemoved: (offenceRemoved: boolean) => {
      patchState(store, { offenceRemoved });
    },
    setMinorCreditorAdded: (minorCreditorAdded: boolean) => {
      patchState(store, { minorCreditorAdded });
    },
    setAddedOffenceCode: (addedOffenceCode: string) => {
      patchState(store, { addedOffenceCode });
    },
    setEmptyOffences: (emptyOffences: boolean) => {
      patchState(store, { emptyOffences });
    },
    setOffenceIndex: (offenceIndex: number) => {
      patchState(store, { offenceIndex });
    },
    setRemoveMinorCreditor: (removeMinorCreditor: number | null) => {
      patchState(store, { removeMinorCreditor });
    },
    setRowIndex: (rowIndex: number | null) => {
      patchState(store, { rowIndex });
    },
    setFormArrayControls: (formArrayControls: IAbstractFormArrayControls[]) => {
      patchState(store, { formArrayControls });
    },
    setOffenceDetailsDraft: (offenceDetailsDraft: IFinesMacOffenceDetailsForm[]) => {
      patchState(store, { offenceDetailsDraft });
    },
    resetStoreDraftImpositionMinor: () => {
      patchState(store, {
        offenceDetailsDraft: [],
        rowIndex: null,
        formArrayControls: [],
        removeMinorCreditor: null,
      });
    },
    resetOffenceCodeMessage: () => {
      patchState(store, { offenceCodeMessage: '' });
    },
    resetStore: () => {
      patchState(store, {
        offenceDetailsDraft: [],
        rowIndex: null,
        formArrayControls: [],
        removeMinorCreditor: null as number | null,
        offenceIndex: 0,
        emptyOffences: false,
        addedOffenceCode: '',
        minorCreditorAdded: false,
        offenceRemoved: false,
        offenceCodeMessage: '',
      });
    },
  })),
);
