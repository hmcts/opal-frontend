import { IFinesMacAccountTimelineData } from '../../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-account-timeline-data.interface';
import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesDraftAccountPatchPayload extends IOpalFinesVersion {
  account_status: string;
  business_unit_id: number;
  reason_text: string | null;
  timeline_data: IFinesMacAccountTimelineData[];
  validated_by: string | null;
  validated_by_name: string | null;
}

export type IOpalFinesDraftAccountPatchRequestPayload = Omit<IOpalFinesDraftAccountPatchPayload, 'timeline_data'>;
