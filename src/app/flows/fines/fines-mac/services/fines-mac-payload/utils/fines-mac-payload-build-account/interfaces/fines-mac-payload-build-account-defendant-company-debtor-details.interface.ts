import { IFinesMacPayloadBuildAccountDefendantCompanyDebtorDetailsAlias } from './fines-mac-payload-build-account-defendant-company-debtor-details-alias.interface';

export interface IFinesMacPayloadBuildAccountDefendantCompanyDebtorDetails {
  document_language: string | null;
  hearing_language: string | null;
  aliases: IFinesMacPayloadBuildAccountDefendantCompanyDebtorDetailsAlias[] | null;
}
