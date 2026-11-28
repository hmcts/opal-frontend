import { IFinesMacPayloadAccountDefendantCompanyDebtorDetailsAlias } from './fines-mac-payload-account-defendant-company-debtor-details-alias.interface';

export interface IFinesMacPayloadAccountDefendantCompanyDebtorDetails {
  vehicle_make: string | null;
  vehicle_registration_mark: string | null;
  document_language: string | null;
  hearing_language: string | null;
  aliases: IFinesMacPayloadAccountDefendantCompanyDebtorDetailsAlias[] | null;
}
