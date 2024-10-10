import { IFinesMacCompanyDefendantDebtorDetailsAlias } from './fines-mac-company-defendant-debtor-details-alias.interface';

export interface IFinesMacCompanyDefendantDebtorDetails {
  document_language: string | null;
  hearing_language: string | null;
  aliases: IFinesMacCompanyDefendantDebtorDetailsAlias[] | null;
}
