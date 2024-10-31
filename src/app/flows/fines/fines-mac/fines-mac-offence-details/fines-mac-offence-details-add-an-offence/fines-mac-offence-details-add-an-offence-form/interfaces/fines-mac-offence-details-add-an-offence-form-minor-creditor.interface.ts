import { IFinesMacOffenceDetailsMinorCreditorState } from '../../../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-state.interface';

export interface IFinesMacOffenceDetailsAddAnOffenceFormMinorCreditor {
  [imposition_position: number]: IFinesMacOffenceDetailsMinorCreditorState;
}
