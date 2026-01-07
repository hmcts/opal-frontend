import { IFinesMacPayloadAccountOffencesMinorCreditor } from './fines-mac-payload-account-offences-minor-creditor.interface';

export interface IFinesMacPayloadAccountOffencesImposition {
  result_id: string | null;
  amount_imposed: number | null;
  amount_paid: number | null;
  major_creditor_id: number | null;
  minor_creditor: IFinesMacPayloadAccountOffencesMinorCreditor | null;
}
