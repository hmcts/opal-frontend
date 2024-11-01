import { IFinesMacPayloadAccountDefendantParentGuardianParentGuardian } from './fines-mac-payload-defendant-parent-guardian-parent-guardian.interface';

export interface IFinesMacPayloadAccountDefendantParentGuardian {
  company_flag: boolean | null;
  title: string | null;
  surname: string | null;
  forenames: string | null;
  dob: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  post_code: string | null;
  national_insurance_number: string | null;
  parent_guardian: IFinesMacPayloadAccountDefendantParentGuardianParentGuardian;
}
