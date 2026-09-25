import { IFinesMacPayloadAccount } from './fines-mac-payload-account.interface';

export interface IFinesMacReplaceAccountRequestPayload {
  business_unit_id: number;
  account: IFinesMacPayloadAccount;
  account_type: string;
  account_status: string | null;
}
