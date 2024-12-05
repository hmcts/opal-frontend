import { IFinesMacPayloadBuildAccountDefendantIndividualDebtorDetails } from './fines-mac-payload-build-account-defendant-individual-debtor-details.interface';

export interface IFinesMacPayloadBuildAccountDefendantParentGuardianParentGuardian {
  company_flag: boolean | null;
  surname: string | null;
  forenames: string | null;
  dob: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  post_code: string | null;
  telephone_number_home: string | null;
  telephone_number_business: string | null;
  telephone_number_mobile: string | null;
  email_address_1: string | null;
  email_address_2: string | null;
  national_insurance_number: string | null;
  debtor_detail: IFinesMacPayloadBuildAccountDefendantIndividualDebtorDetails;
}
