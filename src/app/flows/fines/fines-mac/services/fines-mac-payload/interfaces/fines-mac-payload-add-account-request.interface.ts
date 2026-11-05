import { IFinesMacPayloadAccount } from './fines-mac-payload-account.interface';
import { FinesMacPayloadSource } from '../types/fines-mac-payload-source.type';

export interface IFinesMacAddAccountRequestPayload {
  business_unit_id: number;
  account: IFinesMacPayloadAccount;
  account_type: string;
  account_status: string | null;
  status_message: string | null;
  source: FinesMacPayloadSource;
}
