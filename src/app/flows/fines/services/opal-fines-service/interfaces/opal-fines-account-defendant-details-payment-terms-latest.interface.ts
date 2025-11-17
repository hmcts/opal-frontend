import { IOpalFinesDefendantAccountPaymentTermsSummary } from "./opal-fines-defendant-account.interface";

export interface IOpalFinesAccountDefendantDetailsPaymentTermsLatest {
  version: string | null;
  payment_terms: {
    days_in_default: number | null,
    date_days_in_default_imposed: string | null,
    extension: boolean | null,
    reason_for_extension: string | null,
    posted_details: {
        posted_date: string,
        posted_by: string,
        posted_by_name: string
    }
  } & IOpalFinesDefendantAccountPaymentTermsSummary,
  payment_card_last_requested: string | null,
  last_enforcement: string | null
}
