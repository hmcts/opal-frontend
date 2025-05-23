import { IFinesMacPayloadAccountSnapshot } from './fines-mac-payload-account-snapshot.interface';
import { IFinesMacAccountTimelineData } from './fines-mac-payload-account-timeline-data.interface';
import { IFinesMacPayloadAccount } from './fines-mac-payload-account.interface';

export interface IFinesMacAddAccountPayload {
  business_unit_id: number | null;
  submitted_by: string | null;
  submitted_by_name: string | null;
  account: IFinesMacPayloadAccount; // Replace 'any' with the actual type of accountPayload if known
  account_type: string | null;
  account_status: string | null;
  timeline_data: IFinesMacAccountTimelineData[];
  draft_account_id: number | null;
  created_at: string | null;
  account_snapshot: IFinesMacPayloadAccountSnapshot | null;
  account_status_date: string | null;
  version: number | null;
}
