import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../../../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';

export interface IFetchMapFinesMacPayload {
  finesMacState: IFinesMacState;
  finesMacDraft: IFinesMacAddAccountPayload;
}
