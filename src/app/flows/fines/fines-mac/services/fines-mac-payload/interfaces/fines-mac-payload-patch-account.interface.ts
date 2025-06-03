import { IFinesMacAccountTimelineData } from './fines-mac-payload-account-timeline-data.interface';

export interface IFinesMacPatchAccountPayload {
  business_unit_id: number | null;
  version: number | null;
  validated_by: string | null;
  validated_by_name: string | null;
  account_status: string | null;
  timeline_data: IFinesMacAccountTimelineData[];
}
