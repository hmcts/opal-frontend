import { IFinesMacPayloadAccount } from './fines-mac-payload-account.interface';

export interface IFinesMacAddAccountPayload {
  business_unit_id: number;
  submitted_by: string | null;
  submitted_by_name: string;
  account: IFinesMacPayloadAccount; // Replace 'any' with the actual type of accountPayload if known
  account_type: string | null;
  account_status: string;
  timeline_data: null; // Replace 'any' with the actual type if known
}
