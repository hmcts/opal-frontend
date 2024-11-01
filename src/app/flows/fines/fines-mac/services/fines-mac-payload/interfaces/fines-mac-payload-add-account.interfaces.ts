import { IFinesMacPayloadAccount } from './fines-mac-payload-account.interface';

export interface IFinesMacAddAccountPayload {
  business_unit_id: string;
  submitted_by: string;
  submitted_by_name: string;
  account: IFinesMacPayloadAccount; // Replace 'any' with the actual type of accountPayload if known
  account_type: string;
  account_status: string;
  timeline_data: any | null; // Replace 'any' with the actual type if known
}
