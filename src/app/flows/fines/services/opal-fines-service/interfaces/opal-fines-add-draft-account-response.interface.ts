import { IFinesMacAddAccountPayload } from '../../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';

export interface IOpalFinesAddDraftAccountResponseAccountSnapshot {
  defendant_name: string;
  date_of_birth: string;
  created_date: string;
  account_type: string;
  submitted_by: string;
  submitted_by_name: string;
  business_unit_name: string;
}

export interface IOpalFinesAddDraftAccountResponse extends IFinesMacAddAccountPayload {
  draft_account_id: number;
  created_at: string;
  account_snapshot: IOpalFinesAddDraftAccountResponseAccountSnapshot;
  account_status_date: string;
}
