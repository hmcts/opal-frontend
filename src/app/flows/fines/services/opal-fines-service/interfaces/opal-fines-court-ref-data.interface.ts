import { CourtReferenceCommon } from './generated/opal-fines-court-reference-common.interface';

export interface IOpalFinesCourt extends CourtReferenceCommon {
  court_code?: number | null;
  name?: string | null;
  name_cy?: string | null;
  national_court_code?: string | null;
  business_unit_id?: number | null;
}

export interface IOpalFinesCourtRefData {
  count: number;
  refData: IOpalFinesCourt[];
}
