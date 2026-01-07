import { IFinesMacPayloadAccountOffencesImposition } from './fines-mac-payload-account-offences-imposition.interface';

export interface IFinesMacPayloadAccountOffences {
  date_of_sentence: string | null;
  imposing_court_id: string | null;
  offence_id: number | null;
  impositions: IFinesMacPayloadAccountOffencesImposition[] | null;
}
