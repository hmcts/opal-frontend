import { IFinesMacParentGuardianDefendantParentGuardian } from './fines-mac-parent-guardian-defendant-parent-guardian.interface';

export interface IFinesMacParentGuardianDefendant {
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
  parent_guardian: IFinesMacParentGuardianDefendantParentGuardian;
}
