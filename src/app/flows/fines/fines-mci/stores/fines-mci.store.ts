import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IOpalFinesDefendantAccount } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalFinesDefendantAccountResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-response.interface';

interface FinesMciState {
  criminalSearchResults: IOpalFinesDefendantAccountResponse | null;
  selectedCriminalAccount: IOpalFinesDefendantAccount | null;
}

const FINES_MCI_STATE: FinesMciState = {
  criminalSearchResults: null,
  selectedCriminalAccount: null,
};

export const FinesMciStore = signalStore(
  { providedIn: 'root' },
  withState<FinesMciState>(() => FINES_MCI_STATE),
  withMethods((store) => ({
    setCriminalSearchResults: (criminalSearchResults: IOpalFinesDefendantAccountResponse | null) => {
      patchState(store, { criminalSearchResults, selectedCriminalAccount: null });
    },
    setSelectedCriminalAccount: (selectedCriminalAccount: IOpalFinesDefendantAccount | null) => {
      patchState(store, { selectedCriminalAccount });
    },
    resetCriminalSearch: () => {
      patchState(store, FINES_MCI_STATE);
    },
  })),
);
