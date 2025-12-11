import { GetDefendantAccountHeaderSummaryResponse } from '@services/fines/opal-fines-service/interfaces/generated/opal-fines-get-defendant-account-header-summary-response.interface';
import {
  IOpalFinesDefendantAccountAlias,
  IOpalFinesDefendantAccountPartyDetails,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { AccountStatusReferenceCommon } from '@services/fines/opal-fines-service/interfaces/generated/opal-fines-account-status-reference-common.interface';
import { BusinessUnitSummaryCommon } from '@services/fines/opal-fines-service/interfaces/generated/opal-fines-business-unit-summary-common.interface';
import { PaymentStateSummaryCommon } from '@services/fines/opal-fines-service/interfaces/generated/opal-fines-payment-state-summary-common.interface';

export interface IOpalFinesAccountDefendantDetailsHeader
  extends Omit<
    GetDefendantAccountHeaderSummaryResponse,
    'party_details' | 'account_status_reference' | 'business_unit_summary' | 'payment_state_summary'
  > {
  version: string | null;
  party_details: IOpalFinesDefendantAccountPartyDetails & {
    organisation_details?: {
      organisation_name?: string | null;
      organisation_aliases?: IOpalFinesDefendantAccountAlias[] | null;
    } | null;
    individual_details?: {
      title?: string | null;
      forenames?: string | null;
      surname?: string | null;
      date_of_birth?: string | null;
      age?: string | null;
      national_insurance_number?: string | null;
      individual_aliases?: IOpalFinesDefendantAccountAlias[] | null;
    } | null;
  };
  account_status_reference: AccountStatusReferenceCommon;
  business_unit_summary: BusinessUnitSummaryCommon;
  payment_state_summary: PaymentStateSummaryCommon;
  defendant_account_party_id: string | null;
  parent_guardian_party_id: string | null;
}
